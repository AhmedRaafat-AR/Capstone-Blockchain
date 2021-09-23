// migrating the appropriate contracts
const SquareVerifier = artifacts.require("SquareVerifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = async function(deployer) {
  deployer.deploy(SquareVerifier).then(function() {
    return deployer.deploy(SolnSquareVerifier, SquareVerifier.address, "Egypt","LE-EG");
  });
};
