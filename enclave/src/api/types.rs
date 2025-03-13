use jsonrpsee::core::RpcResult;
use jsonrpsee::proc_macros::rpc;

use super::output::GuessResponse;

// Define the RPC API
#[rpc(server)]
pub trait MyApi {
    #[method(name = "get_signer_address")]
    async fn get_signer_address(&self) -> RpcResult<String>;

    #[method(name = "get_round")]
    async fn get_round(&self) -> RpcResult<u64>;

    #[method(name = "get_signer_attestation")]
    async fn get_signer_attestation(&self) -> RpcResult<Vec<u8>>;

    #[method(name = "guess_number")]
    async fn guess_number(&self, user_address: String, number: u64) -> RpcResult<GuessResponse>;

    #[method(name = "rotate_key")]
    async fn rotate_key(&self) -> RpcResult<String>;
}
