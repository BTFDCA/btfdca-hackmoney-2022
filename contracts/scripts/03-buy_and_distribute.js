const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  console.log("executing in", network.name, network.chainId);

  const signer = await hre.ethers.provider.getSigner();
  console.log("executing with", await signer.getAddress());

  const dcaContract = new hre.ethers.Contract(
    "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E", // dca contract
    [
      "function addressSetup(address) public view returns (uint256,uint256,string,string)",
      "function investors() public view returns (address[])",
      "function buyAndDistribute() external returns (uint256,uint256)",
    ],
    hre.ethers.provider
  );

  // check the contract's matic balance (0)
  const balance = (
    await hre.ethers.provider.getBalance(dcaContract.address)
  ).toString();
  console.log("contract's balance", balance);

  // check the investors
  // const investors = await dcaContract.investors();
  // console.log("num of investors", investors.length);
  // console.log(investors);

  // call DCA's buyAndDistribute
  const delay = 60;
  await dcaContract.connect(signer).buyAndDistribute(delay);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// get future balances
// const tomorrowTimestamp = (await provider.getBlock()).timestamp + 86400;
// await daiXcontract.realtimeBalanceOf(wallet.address, tomorrowTimestamp);
// await daiXcontract.realtimeBalanceOf(dcaContract.address, tomorrowTimestamp);
