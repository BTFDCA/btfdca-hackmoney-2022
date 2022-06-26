const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const localChain = "http://127.0.0.1:8545/";
  const provider = new hre.ethers.providers.JsonRpcProvider(localChain);
  (await provider.getBlockNumber()).toString();

  // const signer = await provider.getSigner();
  // const dcaContract = getDcaContract(provider);
  // listBalances(provider, signer, dcaContract);

  console.log("getting an instance of the contract");
  const dcaFactory = await hre.ethers.getContractFactory("DCAPool");
  const dcaContract = await dcaFactory.attach(
    "0x62b103d49a05E860c370cddA6d030cDb1e223195" // STABLEX/BTFDCAX
  );

  // assert that the contract was retrieved
  (await provider.getBalance(dcaContract.address)).toString();

  // call DCA's buyAndDistribute
  // delay in seconds
  await dcaContract.connect(await provider.getSigner()).buyAndDistribute(60);
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
