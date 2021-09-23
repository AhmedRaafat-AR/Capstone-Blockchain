const SquareVerifier = artifacts.require('SquareVerifier');

const fs = require("fs");
const { proof, inputs } = JSON.parse(fs.readFileSync("./zokrates/code/square/proof.json"));

contract('TestSquareVerifier', accounts => {

    describe('Verify Zokrate proof', function () {
        beforeEach(async function () { 
            this.contract = await SquareVerifier.new({from: accounts[0]});
        })

        it('Test with correct proof', async function () { 

            let tx = await this.contract.verifyTx.call(proof, inputs);
            assert(tx, "proof is correct");

        });

        it('Test with incorrect proof', async function () { 

            const incorProof = { a: proof.c, b: proof.b, c: proof.a };
            let tx = await this.contract.verifyTx.call(incorProof, inputs);
            assert.notOk(tx, "proof is incorrect"); 
        });

    });

})
