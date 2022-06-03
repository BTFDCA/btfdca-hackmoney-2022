const { ethers } = require("hardhat");

module.exports = {
  mineBlocks: async function mineBlocks(n) {
    console.log("block", await ethers.provider.getBlockNumber());
    for (let index = 0; index < n; index++) {
      await ethers.provider.send("evm_mine");
    }
    console.log("block", await ethers.provider.getBlockNumber());
  },
};
