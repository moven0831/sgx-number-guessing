use std::str::FromStr;
use alloy::primitives::Address;
use serde::Serialize;

#[derive(Serialize, Clone, Debug)]
pub enum GuessResponse {
    Correct(WinningOutput),
    TooHigh,
    TooLow,
}

#[derive(Serialize, Clone, Debug)]
pub struct WinningOutput {
    pub message_bytes: Vec<u8>,
    pub signature: Vec<u8>,
}

#[derive(Serialize, Clone, Debug)]
pub struct WinningMessage {
    pub round: u64,
    pub number: u64,
    pub winner_address: String,
}

impl WinningMessage {
    pub fn to_vec(&self, nonce: u64, contract_address: &Address) -> Vec<u8> {
        let mut message = Vec::with_capacity(44);
        let address = Address::from_str(&self.winner_address).unwrap();
        message.extend_from_slice(&nonce.to_be_bytes());
        message.extend_from_slice(contract_address.as_slice());
        message.extend_from_slice(&self.round.to_be_bytes());
        message.extend_from_slice(&self.number.to_be_bytes());
        message.extend_from_slice(address.as_slice());
        message
    }
}
