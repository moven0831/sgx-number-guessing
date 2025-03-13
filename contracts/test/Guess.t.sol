// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IDcapPortal, DcapPortal} from "@dcap-portal/src/DcapPortal.sol";
import {Guess} from "../src/Guess.sol";
import {MockDcapAttestation} from "./mock/MockDcapAttestation.sol";

contract GuessTest is Test {
    address admin = address(0x69);

    Guess guess;
    DcapPortal portal;
    MockDcapAttestation attestation;

    bytes32 mrenclave = vm.envBytes32("MR_ENCLAVE");
    bytes32 mrsigner = vm.envBytes32("MR_SIGNER");
    address signer = 0xf05DC498ba7E64c6a5A27A9A00b549E521f7388D;

    function setUp() public {
        vm.startPrank(admin);

        attestation = new MockDcapAttestation();
        portal = new DcapPortal();
        portal.initialize(admin, address(attestation));
        guess = new Guess(address(portal), mrsigner, mrenclave);

        vm.stopPrank();
    }

    function test_attestSigner() public {
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
}