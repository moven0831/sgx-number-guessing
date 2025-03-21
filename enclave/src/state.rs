use alloy::primitives::Address;
use lazy_static::lazy_static;
use std::collections::HashMap;
use std::sync::Mutex;

lazy_static! {
    pub static ref STATE: Mutex<HashMap<Address, State>> = Mutex::new(HashMap::new());
}

use base::eth::Keypair;
use alloy::primitives::FixedBytes;
use rand::Rng;

#[derive(Debug)]
pub struct State {
    round: u64,
    current_round_number: u64,
    keypair: Keypair
}

impl State {
    pub fn new() -> Self {
        State {
            round: 1,
            current_round_number: Self::generate_round_number(),
            keypair: Keypair::new()
        }
    }

    pub fn rotate_key(&mut self) {
        self.keypair = Keypair::new();
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
        self.keypair.address()
    }

    pub fn get_current_round(&self) -> u64 {
        self.round
    }

    pub fn sign(&self, digest: FixedBytes<32>) -> [u8; 65] {
        let sk_binding = self.keypair.secret_key();
        let sk = sk_binding.as_ref();
        let digest_slice: [u8; 32] = digest.into();
        Keypair::sign_digest_ecdsa(sk, digest_slice)
    }

    fn generate_round_number() -> u64 {
        let mut rng = rand::thread_rng();
        rng.gen_range(1..=20)
    }
}
