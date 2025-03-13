use automata_sgx_sdk::types::SgxStatus;

//Enclave definition. Used by the automata_sgx_sdk.
automata_sgx_sdk::enclave! {
    name: Enclave,
    ecall: {
        fn run_tee_server() -> SgxStatus;
    }
}

/**
 * This is the entry point of the app.
 * It creates a new enclave(in debug mode) and calls the run_tee_server function.
 */
fn main() {
    println!("=============== Starting the app =================");
    let result = Enclave::new().run_tee_server().unwrap();
    if result.is_success() {
        println!("Execution succeeded: {:?}", result);
    } else {
        println!("Execution did not succeed: {:?}", result);
    }
    println!("=============== End of the app =================");
}