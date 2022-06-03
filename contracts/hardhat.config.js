require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("hardhat-gas-reporter");
require("solidity-coverage");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.9",
  settings: {
    optimizer: {
      runs: 200,
      enable: true,
    },
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 1000,
      },
      accounts: [
        {
          privateKey: process.env.MUMBAI_WALLET1,
          balance: "100000000000000000000000000",
        },
        {
          privateKey: process.env.MUMBAI_WALLET2,
          balance: "100000000000000000000000000",
        },
      ],
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.MUMBAI_WALLET1],
      gas: 3000000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  mocha: {
    timeout: 100000000,
  },
};
