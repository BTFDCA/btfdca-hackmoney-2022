const { ethers } = require("hardhat");

module.exports = {
  mineBlocks: async function (n) {
    // console.log("block", await ethers.provider.getBlockNumber());
    for (let index = 0; index < n; index++) {
      await ethers.provider.send("evm_mine");
    }
    // console.log("block", await ethers.provider.getBlockNumber());
  },

  getTokenxBalance: async function (provider, tokenx, address) {
    return ethers.utils.parseEther(
      await tokenx.balanceOf({
        account: address,
        providerOrSigner: provider,
      })
    );
  },
};
