// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Guess} from "../src/Guess.sol";
import {GuessNFT} from "../src/GuessNFT.sol";

contract GuessScript is Script {
    Guess guess;
    address owner = vm.envAddress("OWNER");
    bytes32 CREATE2_SALT = keccak256(bytes("SGX_GUESS"));

    function deployNFT() public {
        vm.startBroadcast(owner);

        GuessNFT nft = new GuessNFT{salt: CREATE2_SALT}();
        console.log("NFT Contract deployed at: ", address(nft));

        vm.stopBroadcast();
    }

    function deployGuess() public {
        vm.startBroadcast(owner);

        guess = new Guess{salt: CREATE2_SALT}(
            vm.envAddress("DCAP_PORTAL"),
            vm.envBytes32("MR_SIGNER"),
            vm.envBytes32("MR_ENCLAVE"),
            vm.envAddress("NFT_ADDRESS")
        );

        console.log("Contract deployed at: ", address(guess));

        vm.stopBroadcast();
    }
}
