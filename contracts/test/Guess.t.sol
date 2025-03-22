// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IDcapPortal, DcapPortal} from "@dcap-portal/src/DcapPortal.sol";
import {Guess} from "../src/Guess.sol";
import {GuessNFT} from "../src/GuessNFT.sol";
import {MockDcapAttestation} from "./mock/MockDcapAttestation.sol";

contract GuessTest is Test {
    address admin = address(0x69);
    address user = 0x3D089C2f2CB86d4EfDe153C81cAbD4579784430b;

    Guess guess;
    GuessNFT nft;
    DcapPortal portal;
    MockDcapAttestation attestation;

    // this doesn't match with the actual values
    // these are only for testing
    bytes32 mrenclave = 0x728c3464fd4ea9af8d030f5db8ba6981d3bd823e9c238b7043ba3385d4ff67c0;
    bytes32 mrsigner = 0x10e1b8a5255dcd66418e19ddd75db2397f04060af24b1f91ed41ef1b44705ae5;
    address signer = 0xa9132Fd3be679AFfCA06dd091f1b7E3Bd9d539a8;
    address payable guessAddr = payable(0x8E90261d08f40D84B83BB8461909Ec6Ff9c5F984);

    function setUp() public {
        vm.startPrank(admin);

        attestation = new MockDcapAttestation();

        portal = new DcapPortal();
        portal.initialize(admin, address(attestation));

        nft = new GuessNFT("Test", "TEST");

        guess = new Guess(address(portal), mrsigner, mrenclave, address(nft));

        // i am going to cheat a little bit here, 
        // we want the runtime code that we just created
        // to be assigned to the declared guess address
        bytes memory runtimeCode = address(guess).code;
        vm.etch(guessAddr, runtimeCode);
        // DCAP Portal Address is stored in the contract instead of being an immutable value
        vm.store(guessAddr, bytes32(uint256(0)), bytes32(uint256(uint160(address(portal)))));
        guess = Guess(guessAddr);

        vm.deal(address(guess), 100 ether);

        vm.stopPrank();
    }

    function test_attest_signer() public {
        string memory quotePath = string.concat(
            vm.projectRoot(),
            "/test/sample/quote.bin"
        );
        bytes memory quote = vm.readFileBinary(quotePath);

        IDcapPortal.Callback memory callback = IDcapPortal.Callback({
            value: 0,
            to: address(guess),
            params: abi.encodeWithSelector(
                Guess.attestAndSetSigner.selector
            )
        });

        portal.verifyAndAttestOnChain(quote, callback);

        // check signer
        address signerFound = guess.signer();
        assertEq(signerFound, signer);
    }

    function test_claim_rewards() public {
        // skip attestation
        vm.store(
            address(guess),
            bytes32(uint256(10)),
            bytes32(uint256(uint160(signer)))
        );

        string memory signaturePath = string.concat(
            vm.projectRoot(),
            "/test/sample/signature.bin"
        );

        uint64 round = 1;
        uint64 winningNumber = 13;
        bytes memory signature = vm.readFileBinary(signaturePath);

        vm.prank(user);
        guess.claimReward(round, winningNumber, signature);
    }
}
