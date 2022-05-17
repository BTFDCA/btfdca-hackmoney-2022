const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers, web3 } = require("hardhat");

async function createFlow(sf, daix, signer) {
  const userData = ethers.utils.defaultAbiCoder.encode(
    ["string", "uint256", "string"],
    ["fDAIx", "50000000000000000000", "BTC"]
  );

  const createFlowOperation = sf.cfaV1.createFlow({
    receiver: "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E",
    superToken: daix.address,
    flowRate: "115740740740741",
    userData: userData,
  });
  const txn = await createFlowOperation.exec(signer);
  const receipt = await txn.wait();
  console.log(receipt);
}

async function main() {
  // const localChain = "http://127.0.0.1:8545/";
  // const provider = new ethers.providers.JsonRpcProvider(localChain);
  const provider = web3;
  const accounts = await ethers.getSigners();

  const sf = await Framework.create({
    chainId: 31337,
    provider: provider,
    customSubgraphQueriesEndpoint: "",
    resolverAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    dataMode: "WEB3_ONLY",
    protocolReleaseVersion: "test",
  });
  // const signer = await provider.getSigner();
  const daix = await sf.loadSuperToken("fDAIx");

  await createFlow(sf, daix, accounts[0]);
  await createFlow(sf, daix, accounts[1]);
  await createFlow(sf, daix, accounts[2]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
