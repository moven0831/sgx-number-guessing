use alloy::primitives::{Address, Keccak256};
use automata_sgx_sdk::dcap::dcap_quote;

pub mod output;
pub mod types;

use output::*;
use types::MyApiServer;

use super::contract::{check_contract_interface, get_nonce};
use super::state::{State, STATE};
use async_trait::async_trait;
use jsonrpsee::core::RpcResult;
use jsonrpsee::types::{ErrorCode, ErrorObject};

// Implement the API
pub struct MyRpc;

#[async_trait]
impl MyApiServer for MyRpc {

    async fn get_attestation(&self, contract_address: Option<Address>) -> RpcResult<Vec<u8>> {
        // Must be run on sgx-supported machine
        let mut data = [0u8; 64];
        
        // if the contract address is provided, then include
        // both the signer and contract address in the attestation report
        if let Some(contract_address) = contract_address {
            if let Some(state_ref) = STATE.get(&contract_address) {
                let current_signer = state_ref.get_signer_address();
                // occupies 20 bytes of the first 32 bytes
                data[..20].copy_from_slice(current_signer.as_slice());
                // occupies 20 bytes of the last 32 bytes
                data[32..52].copy_from_slice(contract_address.as_slice());
            } else {
                // returns an error for invalid contract address
                return Err(ErrorObject::from(ErrorCode::InvalidParams));
            }
        }

        let attestation = dcap_quote(data).unwrap_or_default();
        Ok(attestation)
    }

    async fn init_state(&self, contract_address: Address) -> RpcResult<()> {
        // Check if the contract_address is valid
        let contract_address_is_valid = check_contract_state(&contract_address).await;
        if !contract_address_is_valid {
            return Err(ErrorObject::from(ErrorCode::InvalidParams));
        }

        // Using entry API to insert only if the key doesn't exist
        STATE.entry(contract_address).or_insert(State::new());

        Ok(())
    }

    async fn get_signer_address(&self, contract_address: Address) -> RpcResult<String> {
        if let Some(state_ref) = STATE.get(&contract_address) {
            Ok(state_ref.get_signer_address().to_string())
        } else {
            Err(ErrorObject::from(ErrorCode::InvalidParams))
        }
    }

    async fn get_round(&self, contract_address: Address) -> RpcResult<u64> {
        if let Some(state_ref) = STATE.get(&contract_address) {
            Ok(state_ref.get_current_round())
        } else {
            Err(ErrorObject::from(ErrorCode::InvalidParams))
        }
    }

    async fn guess_number(
        &self,
        contract_address: Address,
        user_address: Address,
        number: u64,
    ) -> RpcResult<GuessResponse> {
        // Check if the contract_address is valid, then fetch nonce
        let contract_address_is_valid = check_contract_state(&contract_address).await;
        let nonce;
        if contract_address_is_valid {
            nonce = get_nonce(&contract_address).await;
            tracing::info!("Nonce: {}", nonce);
        } else {
            return Err(ErrorObject::from(ErrorCode::InvalidParams));
        }

        if let Some(mut state_ref) = STATE.get_mut(&contract_address) {
            let guessed = state_ref.guess_number(number);
            if guessed {
                let winning_message = WinningMessage {
                    round: state_ref.get_current_round(),
                    number: number,
                    winner_address: user_address,
                };

                tracing::info!("Winning message: {:?}", winning_message);

                let winning_message_vec = winning_message.to_vec(nonce, &contract_address);

                let mut hasher = Keccak256::new();
                hasher.update(&winning_message_vec);
                let digest = hasher.finalize();

                tracing::info!("digest: {}", digest);

                let signature = state_ref.sign(digest);
                state_ref.new_round();

                tracing::info!("signautre: {:?}", signature);

                Ok(GuessResponse::Correct(WinningOutput {
                    message_bytes: winning_message_vec,
                    signature: signature.to_vec(),
                }))
            } else {
                let current_number = state_ref.get_current_round_number();
                if number > current_number {
                    Ok(GuessResponse::TooHigh)
                } else {
                    Ok(GuessResponse::TooLow)
                }
            }
        } else {
            Err(ErrorObject::from(ErrorCode::InvalidParams))
        }
    }

    async fn rotate_key(&self, contract_address: Address) -> RpcResult<String> {
        if let Some(mut state_ref) = STATE.get_mut(&contract_address) {
            state_ref.rotate_key();
            Ok(state_ref.get_signer_address().to_string())
        } else {
            Err(ErrorObject::from(ErrorCode::InvalidParams))
        }
    }
}

async fn check_contract_state(contract_address: &Address) -> bool {
    check_contract_interface(contract_address).await
}
