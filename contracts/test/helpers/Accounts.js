const { hexValue } = require("@ethersproject/bytes");
const { parseEther } = require("@ethersproject/units");
const { ethers, network } = require("hardhat");

async function fundWithNative(addr) {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [addr],
  });

  await network.provider.send("hardhat_setBalance", [
    addr,
    hexValue(parseEther("1000")),
  ]);
}

async function fundWithERC20(erc20, signer, account) {
  await erc20
    .connect(signer)
    .mint(account.address, ethers.utils.parseEther("1000"));
}

async function upgradeToTokenX(erc20, tokenx, account) {
  await erc20
    .connect(account)
    .approve(tokenx.address, ethers.utils.parseEther("1000"));

  const upgradeOperation = tokenx.upgrade({
    amount: ethers.utils.parseEther("1000"),
  });
  await upgradeOperation.exec(account);
}

async function generateAccounts(addresses) {
  const signers = [];

  for (let i = 0; i < addresses.length; ++i) {
    fundWithNative(addresses[i]);

    signers[i] = await ethers.getSigner(addresses[i]);
  }

  return signers;
}

module.exports = {
  fundWithERC20: fundWithERC20,
  fundWithNative: fundWithNative,
  generateAccounts: generateAccounts,
  upgradeToTokenX: upgradeToTokenX,
};
