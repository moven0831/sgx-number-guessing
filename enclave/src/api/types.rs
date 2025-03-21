use alloy::primitives::Address;

use jsonrpsee::core::RpcResult;
use jsonrpsee::proc_macros::rpc;

use super::output::GuessResponse;

// Define the RPC API
#[rpc(server)]
pub trait MyApi {
    #[method(name = "init_state")]
    async fn init_state(&self, contract_address: Address) -> RpcResult<()>;

    #[method(name = "get_signer_address")]
    async fn get_signer_address(&self, contract_address: Address) -> RpcResult<String>;

    #[method(name = "get_round")]
    async fn get_round(&self, contract_address: Address) -> RpcResult<u64>;

    #[method(name = "get_signer_attestation")]
    async fn get_signer_attestation(&self, contract_address: Address) -> RpcResult<Vec<u8>>;

    #[method(name = "guess_number")]
    async fn guess_number(&self, contract_address: Address, user_address: Address, number: u64) -> RpcResult<GuessResponse>;

    #[method(name = "rotate_key")]
    async fn rotate_key(&self, contract_address: Address) -> RpcResult<String>;
}
