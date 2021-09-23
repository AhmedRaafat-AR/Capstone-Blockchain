// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


import './ERC721Mintable.sol';
import './SquareVerifier.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

contract Verifier {
  function verifyTx(SquareVerifier.Proof memory proof, uint[2] memory input) public returns (bool r);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721Mintable {

    Verifier zkVerifier;

// TODO define a solutions struct that can hold an index & an address

    struct Solution{
        uint256 tokenId;
        address addr;
    }

// TODO define an array of the above struct

    Solution[] solution_list;

// TODO define a mapping to store unique solutions submitted

    mapping(bytes32 => bool) submittedSolutions;

    constructor(address verifierAddress, string memory name, string memory symbol) ERC721Mintable(name, symbol) public {
        zkVerifier = Verifier(verifierAddress);
    }


// TODO Create an event to emit when a solution is added

    event AddedSolution(Solution sol);


// TODO Create a function to add the solutions to the array and emit the event

    modifier newSolution (SquareVerifier.Proof memory proof, uint[2] memory input) {
        require(!submittedSolutions[keccak256(abi.encodePacked(input))], "Solution already submitted");
        _;
    }

    function addSolution (address addr, uint256 tokenId, SquareVerifier.Proof memory proof, uint[2] memory input) newSolution(proof, input) public returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(input));
        bool verified = zkVerifier.verifyTx(proof, input);

        if (verified) {
            submittedSolutions[key] = true;
            Solution memory solution = Solution(tokenId, addr);
            solution_list.push(solution);
            emit AddedSolution(solution);
        }

        return verified;
    }

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address addr, uint256 tokenId, SquareVerifier.Proof memory proof, uint[2] memory input) public {
        bool verified = addSolution(addr, tokenId, proof, input);
        if (verified) {
            super.mint(addr, tokenId);
        }
    }
}