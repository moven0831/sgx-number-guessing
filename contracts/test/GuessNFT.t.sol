// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockGuess} from "./mock/MockGuess.sol";
import {FakeContract} from "./mock/FakeContract.sol";
import {GuessNFT} from "../src/GuessNFT.sol";

import {IERC721Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";

contract GuessNFTTest is Test {
    GuessNFT nft;
    MockGuess guess;
    address user = 0x1234567890123456789012345678901234567890;

    function setUp() public {
        nft = new GuessNFT("Test", "TEST", "");
        guess = new MockGuess(address(nft));
    }

    function testMint() public {
        vm.prank(user);
        guess.claimReward(0, 0, hex"");
        assertEq(nft.ownerOf(42069), user);
    }

    function testAttemptToMintDirectly() public {
        vm.expectRevert("GuessNFT: Caller is not a contract");
        vm.prank(user);
        nft.safeMint(user, 42069);
        
        vm.expectRevert(abi.encodeWithSelector(
            IERC721Errors.ERC721NonexistentToken.selector,
            42069
        ));
        nft.ownerOf(42069);
    }

    function testAttemptToMintFromFake() public {
        FakeContract fake = new FakeContract(address(nft));
        vm.expectRevert("GuessNFT: Caller does not satisfy IGuess");
        vm.prank(user);
        fake.mint();
        
        vm.expectRevert(abi.encodeWithSelector(
            IERC721Errors.ERC721NonexistentToken.selector,
            42069
        ));
        nft.ownerOf(42069);
    }
}