// SPDX-License-Identifier: APACHE-2.0
pragma solidity ^0.8.13;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

import {IGuess} from "./interfaces/IGuess.sol";

contract GuessNFT is ERC721 {
    string IMAGE_URI;

    constructor(string memory _name, string memory _symbol, string memory imageUri) ERC721(_name, _symbol) {
        IMAGE_URI = imageUri;
    }

    function safeMint(address to, uint256 tokenId) public {
        // check caller is a contract
        require(msg.sender.code.length > 0, "GuessNFT: Caller is not a contract");

        // check caller satisfies IGuess interface
        try IGuess(msg.sender).supportsInterface(type(IGuess).interfaceId) returns (bool) {
            require(true, "GuessNFT: Caller does not satisfy IGuess");
        } catch {
            revert("GuessNFT: Caller does not satisfy IGuess");
        }

        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        return IMAGE_URI;
    }
}
