use alloy::{primitives::{Address, FixedBytes}, sol};
use base::eth::Eth;

// Guess contract interface to fetch the current nonce
sol! {
    #[sol(rpc)]
    interface IGuess {
        #[derive(Debug)]
        function nonce() external view returns (uint64);

        #[derive(Debug)]
        function supportsInterface(bytes4 interfaceID) external view returns (bool);
    }
}

const RPC_URL: &str = "https://1rpc.io/ata/testnet";

pub async fn get_nonce(guess_address: &Address) -> u64 {
    // We don't throw an error if the guess address is not set
    // this way is easier to test the Winning message signature ECDSA verification without
    // explicitly providing the Guess contract address
    if guess_address.is_zero() {
        return 0;
    } else {
        let client = Eth::dial(RPC_URL, None).unwrap();
        let nonce_call = IGuess::nonceCall {};
        let ret = client
            .call(guess_address.clone(), &nonce_call)
            .await
            .unwrap();
        ret._0
    }
}

pub async fn check_contract_interface(guess_address: &Address) -> bool {
    let client = Eth::dial(RPC_URL, None).unwrap();
    let supports_interface_call = IGuess::supportsInterfaceCall {
        interfaceID: FixedBytes::from_slice(&[0xeb, 0xc4, 0x09, 0x75])
    };
    let ret = client
        .call(guess_address.clone(), &supports_interface_call)
        .await;
    if let Ok(ret) = ret {
        ret._0
    } else {
        false
    }
}