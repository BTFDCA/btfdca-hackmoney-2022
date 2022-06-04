const hre = require("hardhat");

const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers, web3 } = require("hardhat");
const daiABI = require("./abis/fDAIABI");

const deployFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-framework");
const deployTestToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-token");
const deploySuperToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-super-token");

const errorHandler = (err) => {
  if (err) throw err;
};

async function mintTokensTo(token, tokenx, signer, account) {
  console.log("minting token/x to", account.address);

  await token
    .connect(signer)
    .mint(account.address, ethers.utils.parseEther("10000"));
  console.log("token minted");

  // const tokenBal = await token.balanceOf({
  //   account: account.address,
  //   providerOrSigner: signer,
  // });
  // console.log("token bal for acct: ", tokenBal);

  await token
    .connect(account)
    .approve(tokenx.address, ethers.utils.parseEther("10000"));
  console.log("approved token usage");

  const tokenxUpgradeOperation = tokenx.upgrade({
    amount: ethers.utils.parseEther("10000"),
  });
  await tokenxUpgradeOperation.exec(account);
  console.log("token upgraded to tokenx");

  const tokenxBal = await tokenx.balanceOf({
    account: account.address,
    providerOrSigner: signer,
  });
  console.log("tokenx bal for acct: ", tokenxBal);
}

async function main() {
  const provider = web3;
  const accounts = await ethers.getSigners();

  // --------------------------------------------------------------------------
  // DEPLOY THE FRAMEWORK
  // --------------------------------------------------------------------------
  await deployFramework(errorHandler, {
    web3,
    from: accounts[0].address,
  });

  // --------------------------------------------------------------------------
  // DEPLOY THE TOKENS
  // --------------------------------------------------------------------------
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

  // deploy another fake erc20 token and a wrapper
  await deployTestToken(errorHandler, [":", "ETHG"], {
    web3,
    from: accounts[0].address,
  });
  await deploySuperToken(errorHandler, [":", "ETHG"], {
    web3,
    from: accounts[0].address,
  });

  // --------------------------------------------------------------------------
  // initialize the superfluid framework...put custom and web3 only bc we are using hardhat locally
  // --------------------------------------------------------------------------
  const sf = await Framework.create({
    networkName: "custom",
    provider,
    dataMode: "WEB3_ONLY",
    resolverAddress: process.env.RESOLVER_ADDRESS, // this is how you get the resolver address
    protocolReleaseVersion: "test",
  });

  // --------------------------------------------------------------------------
  // MINT TOKENS TO ACCOUNTS
  // --------------------------------------------------------------------------
  // use the framework to get the super token
  const daix = await sf.loadSuperToken("fDAIx");
  // get the contract object for the erc20 token
  const daiAddress = daix.underlyingToken.address;
  const dai = new ethers.Contract(daiAddress, daiABI, accounts[0]);
  // mint daix tokens to accounts
  await mintTokensTo(dai, daix, accounts[0], accounts[0]);
  await mintTokensTo(dai, daix, accounts[0], accounts[1]);

  // --------------------------------------------------------------------------

  // use the framework to get the super token
  const ethgx = await sf.loadSuperToken("ETHGx");
  // get the contract object for the erc20 token
  const ethgxAddress = ethgx.underlyingToken.address;
  const ethg = new ethers.Contract(ethgxAddress, daiABI, accounts[0]);
  // mint ethgx tokens to accounts
  await mintTokensTo(ethg, ethgx, accounts[0], accounts[0]);

  // --------------------------------------------------------------------------
  // DEPLOY THE DCA CONTRACT
  // --------------------------------------------------------------------------
  console.log("deploying DCA");
  const DCA = await hre.ethers.getContractFactory("DCAPool");
  const dca = await DCA.deploy(
    sf.settings.config.hostAddress,
    sf.settings.config.cfaV1Address,
    sf.settings.config.idaV1Address,
    123, // ida index
    daix.address,
    ethgx.address,
    "",
    process.env.MUMBAI_UNISWAP_ROUTER, // uniswap router
    process.env.MUMBAI_UNISWAP_POOL_FEE // uniswap pool fee
  );
  await dca.deployed();
  console.log("DCA deployed to:", dca.address);

  dca.setPoolConfig(24 * 60 * 60 * 1000, 0, 0, 0);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
