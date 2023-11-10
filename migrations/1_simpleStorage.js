var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(SimpleStorage);
};
