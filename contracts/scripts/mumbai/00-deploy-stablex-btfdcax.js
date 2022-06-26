const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  console.log("deploying to", network.name, network.chainId);

  const signer = await hre.ethers.provider.getSigner();
  console.log("deploying with", await signer.getAddress());

  const dcaFactory = await hre.ethers.getContractFactory("DCAPool");
  const dcaContract = await dcaFactory.deploy(
    process.env.MUMBAI_SF_HOST, // host
    process.env.MUMBAI_SF_CFA, // cfa
    process.env.MUMBAI_SF_IDA, // ida
    process.env.MUMBAI_IDX_STABLEX_BTFDCAX, // ida index
    process.env.MUMBAI_STABLEX, // source token
    process.env.MUMBAI_BTFDCAX, // target token
    "", // registration key
    process.env.MUMBAI_UNISWAP_ROUTER, // uniswap router
    process.env.MUMBAI_UNISWAP_POOL_FEE // uniswap pool fee
  );
  await dcaContract.deployed();
  console.log("DCA deployed to:", dcaContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
