use alloy::primitives::Address;
use lazy_static::lazy_static;
use std::sync::Mutex;

lazy_static! {
    pub static ref STATE: Mutex<State> = Mutex::new(State::new());
}

use alloy::signers::local::PrivateKeySigner;
use alloy::signers::SignerSync;
use alloy::primitives::FixedBytes;
use rand::Rng;

#[derive(Debug)]
pub struct State {
    round: u64,
    current_round_number: u64,
    key_signer: PrivateKeySigner,
}

impl State {
    pub fn new() -> Self {
        State {
            round: 1,
            current_round_number: Self::generate_round_number(),
            key_signer: PrivateKeySigner::random()
        }
    }

    pub fn rotate_key(&mut self) {
        let new_signer = PrivateKeySigner::random();
        self.key_signer = new_signer;
    }

    pub fn guess_number(&mut self, number: u64) -> bool {
        self.current_round_number == number
    }

    pub fn new_round(&mut self) {
        self.round += 1;
        self.current_round_number = Self::generate_round_number();
    }

    pub fn get_current_round_number(&self) -> u64 {
        self.current_round_number
    }

    pub fn get_signer_address(&self) -> Address {
        self.key_signer.address()
    }

    pub fn get_current_round(&self) -> u64 {
        self.round
    }

    pub fn sign(&self, digest: FixedBytes<32>) -> [u8; 65] {
        self.key_signer.sign_hash_sync(&digest)
            .expect("Signing failed")
            .as_bytes()
    }

    fn generate_round_number() -> u64 {
        let mut rng = rand::thread_rng();
        rng.gen_range(1..=20)
    }
}
