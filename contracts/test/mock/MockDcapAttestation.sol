// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";

/**
 * @dev Lossely based on
 * https://github.com/automata-network/automata-dcap-attestation/blob/main/evm/contracts/AutomataDcapAttestationFee.sol
 */

contract MockDcapAttestation {

    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function verifyAndAttestOnChain(bytes calldata)
        external
        view
        returns (bool success, bytes memory output)
    {
        // success
        success = true;

        string memory outputPath = string.concat(
            vm.projectRoot(),
            "/test/sample/output.bin"
        );

        output = vm.readFileBinary(outputPath);
    }

}