use alloy::{primitives::Address, providers::ProviderBuilder, sol, transports::http::reqwest::Url};
use std::env;

// Guess contract interface to fetch the current nonce
sol! {
    #[sol(rpc)]
    interface IGuess {
        #[derive(Debug)]
        function nonce() external view returns (uint64);
    }
}

const RPC_URL: &str = "https://1rpc.io/ata/testnet";

pub async fn get_nonce() -> u64 {
    let rpc_url: Url = RPC_URL.parse().unwrap();
    let provider = ProviderBuilder::new().on_http(rpc_url);

    let guess_address = if let Ok(address) = env::var("GUESS_ADDRESS") {
        address.parse::<Address>().unwrap()
    } else {
        Address::default()
    };

    // We don't throw an error if the guess address is not set
    // this way is easier to test the Winning message signature ECDSA verification without
    // explicitly providing the Guess contract address
    if guess_address.is_zero() {
        return 0;
    } else {
        let guess = IGuess::new(guess_address, provider);
        let ret = guess.nonce().call().await.unwrap();
        ret._0
    }
}
