const { ethers } = require("hardhat");

// async function checkDaixBalances(provider, address) {
//   const daixAbi = [
//     "function balanceOf(address account) external view returns(uint256 balance)",
//     "function realtimeBalanceOf(address account, uint256 timestamp) external view returns (int256 availableBalance, uint256 deposit, uint256 owedDeposit)",
//   ];
//   const daiXcontract = new ethers.Contract(
//     "0x1f65B7b9b3ADB4354fF76fD0582bB6b0d046a41c",
//     daixAbi,
//     provider
//   );
//   (await daiXcontract.balanceOf(address)).toString();
// }

// async function getDcaContract(provider) {
//   const dcaContract = new ethers.Contract(
//     "0x4A679253410272dd5232B3Ff7cF5dbB88f295319",
//     [
//       "function _addressSetup(address) public view returns (uint256,uint256,string,string)",
//       "function _investors() public view returns (address[])",
//       "function buyAndDistribute() external returns (uint256,uint256)",
//     ],
//     provider
//   );

//   // assert that the contract was retrieved
//   (await provider.getBalance(dcaContract.address)).toString();

//   return dcaContract;
// }

// async function listBalances(provider, signer, dcaContract) {
//   console.log("signer balances");
//   (await provider.getBalance(await signer.getAddress())).toString();
//   checkDaixBalances(signer.address);

//   console.log("dca balances");
//   (await provider.getBalance(await dcaContract.address)).toString();
//   checkDaixBalances(dcaContract.address);
// }

async function main() {
  const localChain = "http://127.0.0.1:8545/";
  const provider = new ethers.providers.JsonRpcProvider(localChain);
  (await provider.getBlockNumber()).toString();

  // const signer = await provider.getSigner();
  // const dcaContract = getDcaContract(provider);
  // listBalances(provider, signer, dcaContract);

  const dcaContract = new ethers.Contract(
    "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
    [
      "function _addressSetup(address) public view returns (uint256,uint256,string,string)",
      "function _investors() public view returns (address[])",
      "function buyAndDistribute() external returns (uint256,uint256)",
    ],
    provider
  );

  // assert that the contract was retrieved
  (await provider.getBalance(dcaContract.address)).toString();

  // TODO: call DCA's buyAndDistribute
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
