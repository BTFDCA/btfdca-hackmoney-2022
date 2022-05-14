const hre = require("hardhat");

const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers, web3 } = require("hardhat");
// const daiABI = require("../abis/fDAIABI");

console.log("............", web3);

const deployFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-framework");
const deployTestToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-token");
const deploySuperToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-super-token");

const errorHandler = (err) => {
  if (err) throw err;
};

async function main() {
  const provider = web3;
  const accounts = await ethers.getSigners();

  // deploy the framework
  await deployFramework(errorHandler, {
    web3,
    from: accounts[0].address,
  });

  // deploy a fake erc20 token
  await deployTestToken(errorHandler, [":", "fDAI"], {
    web3,
    from: accounts[0].address,
  });
  // deploy a fake erc20 wrapper super token around the fDAI token
  await deploySuperToken(errorHandler, [":", "fDAI"], {
    web3,
    from: accounts[0].address,
  });

  // initialize the superfluid framework...put custom and web3 only bc we are using hardhat locally
  const sf = await Framework.create({
    networkName: "custom",
    provider,
    dataMode: "WEB3_ONLY",
    resolverAddress: process.env.RESOLVER_ADDRESS, // this is how you get the resolver address
    protocolReleaseVersion: "test",
  });

  // let superSigner = await sf.createSigner({
  //   signer: accounts[0],
  //   provider: provider,
  // });
  // use the framework to get the super toen
  const daix = await sf.loadSuperToken("fDAIx");

  // get the contract object for the erc20 token
  // const daiAddress = daix.underlyingToken.address;
  // const dai = new ethers.Contract(daiAddress, daiABI, accounts[0]);

  const DCA = await hre.ethers.getContractFactory("DCA");
  const dca = await DCA.deploy(
    sf.settings.config.hostAddress,
    sf.settings.config.cfaV1Address,
    sf.settings.config.idaV1Address,
    daix.address
  );
  await dca.deployed();
  console.log("DCA deployed to:", dca.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
