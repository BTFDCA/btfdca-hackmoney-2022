const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
require("dotenv").config();

async function createFlow(sf, daix, signer) {
  const createFlowOperation = sf.cfaV1.createFlow({
    receiver: "0x9bEEf8c74666d7b5d9ad299C24C38E1E233E0dB0", // FDAIX-ENCX
    superToken: daix.address,
    flowRate: "578703703703704",
  });
  const txn = await createFlowOperation.exec(signer);
  const receipt = await txn.wait();
  console.log(receipt);
}

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  console.log("deploying to", network.name, network.chainId);

  const signer = await hre.ethers.provider.getSigner();
  console.log("deploying with", await signer.getAddress());

  // TODO: TEST TEST  TEST TEST  TEST TEST

  const sf = await Framework.create({
    chainId: 31337,
    provider: signer,
    customSubgraphQueriesEndpoint: "",
    resolverAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  });
  // const signer = await provider.getSigner();
  const daix = await sf.loadSuperToken("fDAIx");

  await createFlow(sf, daix, signer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
