// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IGuess, IERC165} from "../../src/interfaces/IGuess.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

interface IGuessNFT {
    function safeMint(address to, uint256 tokenId) external;
}

contract MockGuess is ERC165, IGuess {

    IGuessNFT public immutable nft;

    constructor(address _nft) {
        nft = IGuessNFT(_nft);
    }

    function attestAndSetSigner() external override {
        // do nothing
    }

    function claimReward(uint64, uint64, bytes calldata) external override {
        nft.safeMint(msg.sender, 42069);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IGuess).interfaceId || super.supportsInterface(interfaceId);
    }
}