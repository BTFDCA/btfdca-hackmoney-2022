require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      // mining: {
      //   auto: false,
      //   interval: 1000,
      // },
      accounts: [
        {
          privateKey: process.env.MUMBAI_WALLET,
          balance: "100000000000000000000000000",
        },
      ],
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.MUMBAI_WALLET],
      gas: 2100000,
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.RINKEBY_WALLET],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
