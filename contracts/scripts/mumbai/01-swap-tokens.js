const hre = require("hardhat");
require("dotenv").config();

async function getBalanceOf(provider, token, wallet) {
  const erc20abi = [
    "function balanceOf(address account) external view returns(uint256 balance)",
  ];
  const erc20 = new hre.ethers.Contract(token, erc20abi, provider);
  return (await erc20.balanceOf(wallet)).toString();
}

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  console.log("executing in", network.name, network.chainId);

  const signer = await hre.ethers.provider.getSigner();
  console.log("executing with", await signer.getAddress());

  console.log("getting an instance of the contract");
  const dcaFactory = await hre.ethers.getContractFactory("DCA");
  const dcaContract = await dcaFactory.attach(process.env.MUMBAI_DCA);

  // do something just to check that the contract is fetched
  console.log("just some call to check if we fetched the correct instance");
  const ret = await dcaContract.uniswapPoolFee();
  console.log("some return value", ret);

  console.log(
    "wmatic balance of the contract",
    await getBalanceOf(
      signer,
      process.env.MUMBAI_WMATIC,
      process.env.MUMBAI_DCA
    )
  );

  // TODO: just for testing - function is internal in the contract
  // // call swap tokens
  // console.log(
  //   "swapping tokens",
  //   process.env.MUMBAI_WMATIC,
  //   process.env.MUMBAI_WETH
  // );
  // const result = await dcaContract
  //   .connect(signer)
  //   .swapTokens(
  //     process.env.MUMBAI_WMATIC,
  //     process.env.MUMBAI_WETH,
  //     hre.ethers.utils.parseEther("0.5")
  //   );
  // console.log("done!", result);

  console.log(
    "weth balance of the contract",
    await getBalanceOf(signer, process.env.MUMBAI_WETH, process.env.MUMBAI_DCA)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
