require("@nomicfoundation/hardhat-toolbox");

//Place for your private account key abcasd
const KEY = require('./secured.js');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.12",
  networks: {
    //allowUnlimitedContractSize: true,
    Mumbai: {
      allowUnlimitedContractSize: true,
      chainId: 80001, 
      url : 'https://matic-mumbai.chainstacklabs.com',
      accounts: [KEY],
      gas: 9007199254740,
      gasPrice: 8000000000
    }
  }
};
