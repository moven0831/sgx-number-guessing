// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IDcapPortal, DcapPortal} from "@dcap-portal/src/DcapPortal.sol";
import {Guess} from "../src/Guess.sol";
import {MockDcapAttestation} from "./mock/MockDcapAttestation.sol";

contract GuessTest is Test {
    address admin = address(0x69);
    address user = address(0x01);

    Guess guess;
    DcapPortal portal;
    MockDcapAttestation attestation;

    bytes32 mrenclave = vm.envBytes32("MR_ENCLAVE");
    bytes32 mrsigner = vm.envBytes32("MR_SIGNER");
    address signer = 0xa6F7B9b4ce833CA93e5375BC61fAC00cB141B85F;

    function setUp() public {
        vm.startPrank(admin);

        attestation = new MockDcapAttestation();
        portal = new DcapPortal();
        portal.initialize(admin, address(attestation));
        guess = new Guess(address(portal), mrsigner, mrenclave);

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

        uint256 userBalanceBefore = user.balance;
        uint256 guessBalanceBefore = address(guess).balance;

        string memory signaturePath = string.concat(
            vm.projectRoot(),
            "/test/sample/signature.bin"
        );

        uint64 round = 1;
        uint64 winningNumber = 2;
        bytes memory signature = vm.readFileBinary(signaturePath);

        vm.prank(user);
        guess.claimReward(round, winningNumber, signature);

        uint256 userBalanceAfter = user.balance;
        uint256 guessBalanceAfter = address(guess).balance;

        assertEq(userBalanceAfter, userBalanceBefore + 1 ether);
        assertEq(guessBalanceAfter, guessBalanceBefore - 1 ether);
    }   
}