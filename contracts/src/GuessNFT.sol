// SPDX-License-Identifier: APACHE-2.0
pragma solidity ^0.8.13;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

import {IGuess} from "./interfaces/IGuess.sol";

contract GuessNFT is ERC721 {
    string constant IMAGE_URI =
        "https://gateway.pinata.cloud/ipfs/bafkreih2oztywvohycvbal33oz2rwub2kcrptbne7eglc44jlueb2rx2gy#x-ipfs-companion-no-redirect";

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

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

        string memory tokenIdString = Strings.toString(tokenId);
        address owner = ownerOf(tokenId);

        string memory svg = _generateSvg(tokenIdString, owner);

        return string(
            abi.encodePacked(
                '{"name": "GuessNFT #',
                tokenIdString,
                '", "description": "GuessNFT is a collection of unique NFTs.",',
                '"image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(svg)),
                '"}'
            )
        );
    }

    function _generateSvg(string memory tokenIdString, address owner) private pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">',
                '<image href="',
                IMAGE_URI,
                '" x="0" y="0" width="720" height="730"/>',
                '<text x="50%" y="750" font-size="24" fill="black" text-anchor="middle" font-family="Arial">',
                "ID: #",
                tokenIdString,
                "</text>",
                '<text x="50%" y="775" font-size="20" fill="black" text-anchor="middle" font-family="Arial">',
                "Holder: ",
                Strings.toHexString(owner),
                "</text>",
                "</svg>"
            )
        );
    }
}
