// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Guess} from "../src/Guess.sol";

contract GuessScript is Script {
    Guess guess;
    address owner = vm.envAddress("OWNER"); 
    bytes32 CREATE2_SALT = keccak256(bytes("SGX_GUESS"));

    function run() public {
        vm.startBroadcast(owner);

        guess = new Guess{salt: CREATE2_SALT}(
            vm.envAddress("DCAP_PORTAL"),
            vm.envBytes32("MR_SIGNER"),
            vm.envBytes32("MR_ENCLAVE")
        );

        console.log("Contract deployed at: ", address(guess));

        vm.stopBroadcast();
    }
}
