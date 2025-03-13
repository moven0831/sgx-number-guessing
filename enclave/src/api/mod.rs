use automata_sgx_sdk::dcap::dcap_quote;

pub mod output;
pub mod types;

use output::*;
use types::MyApiServer;

use super::state::STATE;
use async_trait::async_trait;
use jsonrpsee::core::RpcResult;

// Implement the API
pub struct MyRpc;

#[async_trait]
impl MyApiServer for MyRpc {
    async fn get_signer_address(&self) -> RpcResult<String> {
        let current_state = STATE.lock().unwrap();
        Ok(current_state.get_signer_address().to_string())
    }

    async fn get_round(&self) -> RpcResult<u64> {
        let current_state = STATE.lock().unwrap();
        Ok(current_state.get_current_round())
    }

    async fn get_signer_attestation(&self) -> RpcResult<Vec<u8>> {
        let current_state = STATE.lock().unwrap();
        let current_signer = current_state.get_signer_address();
        
        // pass the signer address as user data in the attestation report
        // Must be run on sgx-supported machine
        let mut data = [0u8; 64];
        data[..20].copy_from_slice(current_signer.as_slice());
        let attestation = dcap_quote(data).unwrap_or_default();
        Ok(attestation)
    }

    async fn guess_number(&self, user_address: String, number: u64) -> RpcResult<GuessResponse> {
        let mut current_state = STATE.lock().unwrap();
        let guessed = current_state.guess_number(number);
        if guessed {
            let winning_message = WinningMessage {
                round: current_state.get_current_round(),
                number: number,
                winner_address: user_address,
            };
            let winning_message_vec = winning_message.to_vec();
            let signature = current_state.sign(winning_message_vec.as_slice());
            current_state.new_round();
            Ok(GuessResponse::Correct(WinningOutput {
                message_bytes: winning_message_vec,
                signature: signature.to_vec(),
            }))
        } else {
            let current_number = current_state.get_current_round_number();
            if number > current_number {
                Ok(GuessResponse::TooHigh)
            } else {
                Ok(GuessResponse::TooLow)
            }
        }
    }

    async fn rotate_key(&self) -> RpcResult<String> {
        let mut current_state = STATE.lock().unwrap();
        current_state.rotate_key();
        Ok(current_state.get_signer_address().to_string())
    }
}
