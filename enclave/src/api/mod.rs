use alloy::primitives::{Address, Keccak256};
use automata_sgx_sdk::dcap::dcap_quote;

pub mod output;
pub mod types;

use output::*;
use types::MyApiServer;

use super::contract::get_nonce;
use super::state::{State, STATE};
use async_trait::async_trait;
use jsonrpsee::core::RpcResult;
use jsonrpsee::types::{ErrorCode, ErrorObject};

// Implement the API
pub struct MyRpc;

#[async_trait]
impl MyApiServer for MyRpc {
    async fn init_state(&self, contract_address: Address) -> RpcResult<()> {
        // Check if the contract_address is valid
        let contract_address_is_valid = check_contract_state(&contract_address).await;
        if !contract_address_is_valid {
            return Err(ErrorObject::from(ErrorCode::InvalidParams));
        }

        let mut state = STATE.lock().unwrap();
        if !state.contains_key(&contract_address) {
            state.insert(contract_address, State::new());
        }

        Ok(())
    }

    async fn get_signer_address(&self, contract_address: Address) -> RpcResult<String> {
        let state = STATE.lock().unwrap();
        if state.contains_key(&contract_address) {
            let state = state.get(&contract_address).unwrap();
            Ok(state.get_signer_address().to_string())
        } else {
            Err(ErrorObject::from(ErrorCode::InvalidParams))
        }
    }

    async fn get_round(&self, contract_address: Address) -> RpcResult<u64> {
        let state = STATE.lock().unwrap();
        if state.contains_key(&contract_address) {
            let state = state.get(&contract_address).unwrap();
            Ok(state.get_current_round())
        } else {
            Err(ErrorObject::from(ErrorCode::InvalidParams))
        }
    }

    async fn get_signer_attestation(&self, contract_address: Address) -> RpcResult<Vec<u8>> {
        let mut state = STATE.lock().unwrap();
        if state.contains_key(&contract_address) {
            let state = state.get_mut(&contract_address).unwrap();
            let current_signer = state.get_signer_address();
            // pass the signer address as user data in the attestation report
            // Must be run on sgx-supported machine
            let mut data = [0u8; 64];
            data[..20].copy_from_slice(current_signer.as_slice());
            data[20..].copy_from_slice(contract_address.as_slice());
            let attestation = dcap_quote(data).unwrap_or_default();
            Ok(attestation)
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

        let mut state = STATE.lock().unwrap();
        if state.contains_key(&contract_address) {
            let state = state.get_mut(&contract_address).unwrap();
            let guessed = state.guess_number(number);
            if guessed {
                let winning_message = WinningMessage {
                    round: state.get_current_round(),
                    number: number,
                    winner_address: user_address.to_string(),
                };

                tracing::info!("Winning message: {:?}", winning_message);

                let winning_message_vec = winning_message.to_vec(nonce);

                let mut hasher = Keccak256::new();
                hasher.update(&winning_message_vec);
                let digest = hasher.finalize();

                tracing::info!("digest: {}", digest);

                let signature = state.sign(digest);
                state.new_round();

                tracing::info!("signautre: {:?}", signature);

                Ok(GuessResponse::Correct(WinningOutput {
                    message_bytes: winning_message_vec,
                    signature: signature.to_vec(),
                }))
            } else {
                let current_number = state.get_current_round_number();
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
        let mut state = STATE.lock().unwrap();
        if state.contains_key(&contract_address) {
            let state = state.get_mut(&contract_address).unwrap();
            state.rotate_key();
            Ok("Key rotated successfully".to_string())
        } else {
            Err(ErrorObject::from(ErrorCode::InvalidParams))
        }
    }
}

async fn check_contract_state(contract_address: &Address) -> bool {
    // TODO
    true
}
