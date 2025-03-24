use automata_sgx_sdk::types::SgxStatus;

pub mod api;
pub mod state;
pub mod contract;

use crate::api::types::MyApiServer;
use crate::api::MyRpc;

use hyper::Method;
use jsonrpsee::server::Server;
use std::net::SocketAddr;
use tower;
use tower_http::cors::{Any, CorsLayer};

pub async fn entrypoint() {
    let addr = format!("0.0.0.0:{}", 8080);

    // Create a CORS middleware with the most permissive settings
    let cors = CorsLayer::new()
		// Allow `POST` when accessing the resource
		.allow_methods([Method::POST])
		// Allow requests from any origin
		.allow_origin(Any)
		.allow_headers([hyper::header::CONTENT_TYPE]);

    let cors_middleware = tower::ServiceBuilder::new().layer(
        cors
    );

    // Create the server
    let server = Server::builder()
        .set_http_middleware(cors_middleware)
        .build(addr.parse::<SocketAddr>().unwrap())
        .await
        .expect("Failed to create server");

    // Create an API instance
    let rpc_api = MyRpc.into_rpc();

    // Start the server
    let handle = server.start(rpc_api);

    println!("Server running on {}", addr);

    // Wait for the server to exit
    handle.stopped().await;
}

/**
 * This is an ECALL function defined in the edl file.
 * It will be called by the application.
 */
#[no_mangle]
pub unsafe extern "C" fn run_tee_server() -> SgxStatus {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();
    
    println!("=============== Trusted execution =================");

    let rt = tokio::runtime::Runtime::new().unwrap();
    rt.block_on(entrypoint());

    println!("=============== End of trusted execution =================");

    SgxStatus::Success
}
