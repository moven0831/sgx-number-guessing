// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IGuessNFT {
    function safeMint(address to, uint256 tokenId) external;
}

contract FakeContract {
    IGuessNFT nft;

    constructor(address _nft) {
        nft = IGuessNFT(_nft);
    }

    function mint() public {
        nft.safeMint(msg.sender, 42069);
    }
}