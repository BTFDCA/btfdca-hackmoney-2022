const deployFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-framework");
const deployTestToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-token");
const deploySuperToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-super-token");
const { Framework } = require("@superfluid-finance/sdk-core");
const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");

const erc20abi = require("./abis/ERC20ABI");
const {
  fundWithERC20,
  generateAccounts,
  upgradeToTokenX,
} = require("./helpers/Accounts");
const { mineBlocks } = require("./helpers/Utils");

// TODO: time travelling
// https://ethereum.stackexchange.com/questions/86633/time-dependent-tests-with-hardhat
// https://www.npmjs.com/package/@atixlabs/hardhat-time-n-mine

const provider = web3;

let omnifient, alice, bob, mallory;
let sf, superSigner, dai, daix, btc, btcx;
let dcaPoolContract, uniswapContract;

const errHandler = (err) => {
  if (err) throw err;
};

before(async function () {
  // get accounts from hardhat
  // [omnifient, alice, bob, mallory] = await ethers.getSigners();
  [omnifient, alice, bob, mallory] = await generateAccounts([
    "0x3ee7171FcBEe0FF94889F08b46f1Ca933c142b6E",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  ]);

  // deploy the framework
  await deployFramework(errHandler, {
    isTruffle: false,
    web3: provider,
    from: omnifient.address,
  });

  // deploy a fake erc20 token (fDAI)
  await deployTestToken(errHandler, [":", "fDAI"], {
    web3: provider,
    from: omnifient.address,
  });
  // deploy a fake erc20 wrapper super token around the fDAI token
  await deploySuperToken(errHandler, [":", "fDAI"], {
    web3: provider,
    from: omnifient.address,
  });

  // deploy a fake erc20 token (fBTC)
  await deployTestToken(errHandler, [":", "fBTC"], {
    web3: provider,
    from: omnifient.address,
  });
  // deploy a fake erc20 wrapper super token around the fBTC token
  await deploySuperToken(errHandler, [":", "fBTC"], {
    web3: provider,
    from: omnifient.address,
  });

  // initialize the superfluid framework...put custom and web3 only bc we are using hardhat locally
  sf = await Framework.create({
    networkName: "custom",
    provider: provider,
    dataMode: "WEB3_ONLY",
    resolverAddress: process.env.RESOLVER_ADDRESS,
    protocolReleaseVersion: "test",
  });

  // TODO: why?
  superSigner = await sf.createSigner({
    signer: omnifient,
    provider: provider,
  });

  // use the framework to get the super token
  daix = await sf.loadSuperToken("fDAIx");
  btcx = await sf.loadSuperToken("fBTCx");
  // and then get the erc20 tokens
  dai = new ethers.Contract(daix.underlyingToken.address, erc20abi, omnifient);
  btc = new ethers.Contract(btcx.underlyingToken.address, erc20abi, omnifient);

  // deploy a mock for uniswapv3 router
  const RouterFactory = await ethers.getContractFactory("MockSwapRouter");
  uniswapContract = await RouterFactory.deploy();

  // get the contract
  const DCAPoolFactory = await ethers.getContractFactory("DCAPool");
  dcaPoolContract = await DCAPoolFactory.deploy(
    sf.settings.config.hostAddress,
    sf.settings.config.cfaV1Address,
    sf.settings.config.idaV1Address,
    123,
    daix.address,
    btcx.address,
    "",
    uniswapContract.address,
    3000
  );
  await dcaPoolContract.deployed();
  console.log("DCA deployed to:", dcaPoolContract.address);

  await dcaPoolContract.setPoolConfig(24 * 60 * 60 * 1000, 0, 0, 0);
});

beforeEach(async function () {
  await fundWithERC20(dai, omnifient, omnifient);
  await upgradeToTokenX(dai, daix, omnifient);

  await fundWithERC20(dai, omnifient, alice);
  await upgradeToTokenX(dai, daix, alice);

  await fundWithERC20(dai, omnifient, bob);
  await upgradeToTokenX(dai, daix, bob);

  await fundWithERC20(dai, omnifient, mallory);
  await upgradeToTokenX(dai, daix, mallory);

  // fund uniswap with btc
  await fundWithERC20(btc, omnifient, uniswapContract);

  await mineBlocks(1);
});

describe("CFA", () => {
  it("something", async function () {
    expect(1).to.equal(1);
  });
});

describe("SWAP", () => {
  // TODO:
});

describe("IDA", () => {
  // TODO:
});
