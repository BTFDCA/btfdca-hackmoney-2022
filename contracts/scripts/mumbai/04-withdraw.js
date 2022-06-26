const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  console.log("executing in", network.name, network.chainId);

  const signer = await hre.ethers.provider.getSigner();
  console.log("executing with", await signer.getAddress());

  console.log("getting an instance of the contract");
  const dcaFactory = await hre.ethers.getContractFactory("DCAPool");
  const dcaContract = await dcaFactory.attach(
    "0x21Ef7C58AAEba58248DB4e420091B196FdC9e78F" // STABLEX/ENCX
  );

  // do something just to check that the contract is fetched
  console.log("just some call to check if we fetched the correct instance");
  const ret = await dcaContract.withdrawTokens(
    "0x358b34D52675C6D8B9b932015662625292e1Fd12" // STABLEX
  );
  console.log("some return value", ret);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
