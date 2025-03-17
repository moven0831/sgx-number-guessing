use alloy::{primitives::Address, sol};
use std::env;
use base::eth::Eth;

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
        let client = Eth::dial(RPC_URL, None).unwrap();
        let nonce_call = IGuess::nonceCall {};
        let ret = client.call(guess_address, &nonce_call).await.unwrap();
        ret._0
    }
}
