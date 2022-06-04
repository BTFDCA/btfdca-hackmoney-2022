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
const { mineBlocks, getTokenxBalance } = require("./helpers/Utils");
const { startFlow } = require("./helpers/Superfluid");
const { BigNumber } = require("ethers");

// TODO: time travelling
// https://ethereum.stackexchange.com/questions/86633/time-dependent-tests-with-hardhat
// https://www.npmjs.com/package/@atixlabs/hardhat-time-n-mine

const provider = web3;

let omnifient, alice, bob, mallory;
let sf, sfSigner, dai, daix, btc, btcx;
let dcaPool, uniswapContract;

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

  // signer/provider for superfluid operations
  sfSigner = await sf.createSigner({
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
  dcaPool = await DCAPoolFactory.deploy(
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
  await dcaPool.deployed();
  console.log("DCA deployed to:", dcaPool.address);

  await dcaPool.setPoolConfig(24 * 60 * 60 * 1000, 0, 0, 0);
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

describe("DCA", () => {
  it("index exists", async function () {
    // MEH
    const idx = await sf.idaV1.getIndex({
      indexId: "123",
      providerOrSigner: sfSigner,
      publisher: dcaPool.address,
      superToken: btcx.address,
    });
    console.log(idx);
  });
  it("single investor starts dca-ing correctly", async function () {
    //   const aliceBal1 = await getTokenxBalance(sfSigner, daix, alice.address);
    //   const dcaBal1 = await getTokenxBalance(sfSigner, daix, dcaPool.address);
    //   expect(aliceBal1).to.be.gt(BigNumber.from(0));
    //   expect(dcaBal1).to.equal(BigNumber.from(0));
    //   const flowrate = 3860000000000; // $10/month
    //   await startFlow(sf, alice, dcaPool, daix.address, flowrate.toString());
    //   await mineBlocks(5);
    //   const aliceBal2 = await getTokenxBalance(sfSigner, daix, alice.address);
    //   const dcaBal2 = await getTokenxBalance(sfSigner, daix, dcaPool.address);
    //   const result = ethers.utils.parseEther((flowrate * 5).toString());
    //   expect(aliceBal2).to.be.lt(aliceBal1);
    //   expect(dcaBal2).to.equal(result);
  });

  it("multiple investors can stream money to the contract", async function () {
    const flowrate = 3860000000000; // $10/month

    console.log("go alice");
    await startFlow(sf, alice, dcaPool, daix.address, flowrate.toString());

    console.log("go bob");
    await startFlow(sf, bob, dcaPool, daix.address, flowrate.toString());

    console.log("go mallory");
    await startFlow(sf, mallory, dcaPool, daix.address, flowrate.toString());

    await mineBlocks(1);

    const dcaBal = await getTokenxBalance(sfSigner, daix, dcaPool.address);
    console.log("dca bal", dcaBal);
    expect(dcaBal).to.equal(
      // 12315456465465
      ethers.utils.parseEther("9999999")
    );
    // console.log(await provider.getBlock(await provider.getBlockNumber()));
    // TODO: multiple investors subscribe correctly
    // TODO: when a new investor streams money, the balance is reset
  });

  it("contract swaps tokens and distributes correctly", async function () {
    //   // TODO: last buy timestamp changes
    //   // TODO: investors receive the correct proportion
  });

  // TODO: investors must stream minimum amount required
  // TODO: only swaps if balance is greater than minimum amount to spend
  // TODO: only distributes if balance is greater than minimum amount to distribute
  // TODO: investor unsubscribes correctly
});
