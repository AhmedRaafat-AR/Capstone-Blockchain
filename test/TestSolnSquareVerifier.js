const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const fs = require("fs");

const { proof, inputs } = JSON.parse(fs.readFileSync("./zokrates/code/square/proof.json"));

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('Verify SolnSquareVerifier', function () {
        beforeEach(async function () { 
            let verifier = await SquareVerifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(verifier.address,"Egypt", "EG",{from: account_one});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can be added', async function () {
            
            let result = await this.contract.addSolution(account_two, 999, proof, inputs);
            assert(result, true, "the solution was not added")

        });
            
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted', async function () { 

            let result = await this.contract.mintToken.call(account_two, 999, proof, inputs);
            assert(result, true, "the solution was not added")

        });
    });

})