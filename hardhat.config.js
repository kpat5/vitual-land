require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    // hardhat: {
    //   chainId: "1337",
    //   allowUnlimitedContractSize: true,
    // },
    // ganache: {
    //   url: "http://127.0.0.1:7545",
    //   chainId: "5777",
    // },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  solidity: "0.8.17",
};
