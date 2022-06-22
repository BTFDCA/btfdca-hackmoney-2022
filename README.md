# BTFDCA

```notes
https://docs.google.com/document/d/14slkmrXMwsRnxpq0subWCeeJpQp3YcVie8luGrmM63Q/edit#heading=h.xckt2lhsl9er
```

## TODO

### product

- [ ] implement concept of dca pool - source/target/cadence
- [ ] support source/target tokens dynamically, based on network
- [ ] support source tokens usdc, dai
- [ ] support target tokens btc, eth
  - [ ] buy crypto indexes
    - [ ] indexcoop
- [ ] support other target assets
  - [ ] fractionalized nfts
- [ ] buy modes
  - [ ] spend a fixed amount (e.g. $10/month)
  - [ ] buy target amount (e.g. 1 BTC / N time = x/month/day)
- [ ] keeper/sentinel
- [ ] reinvest assets
- [ ] push notifications
- [ ] analytics (per pool - i.e. token pair)
  - [ ] total amount invested
  - [ ] number of total investors
  - [ ] current amount invested
  - [ ] number of current investors
  - [ ] average swap price
  - [ ] total amount returned (distributed)
  - [ ] last amount returned (distributed)
  - [ ] list of current investors and invested amount
  - [ ] list of all investors and invested amount
  - [ ] timeline with swaps/prices/amounts
- [ ] show contract balance (per dca pool)
- [ ] show counter until next buy (per dca pool)
- [ ] show amount bought and distributed
  - [ ] per dca pool
- [ ] show how much an investor has invested/received
  - [ ] list transactions
- [ ] show available balance to "claim"

- encoode polygon hackathon
- [ ] research how to use unstoppable domains
  - [ ] link to dca dashboard
  - [ ] distribute to domain
  - [ ] login?
  - [ ] take your streams?
  - [ ] export data?
- [ ] research how to use covalent
  - [ ] wallet
  - [ ] contract dashboard
- [ ] 3min max video
- [ ] presentation
- [ ] website or online demo
- [ ] technical paper

- integrations
- [ ] gearbox?
- [ ] apwine?
- [ ] voltz?
- [ ] aave?
- [ ] babylon?
- [ ] badgerdao?
- [ ] tempus?
- [ ] lyra?
- [ ] yearn?
- [ ] compound?
- [ ] transak?
- [ ] spheron?
- [ ] swing?
- [ ] connext?
- [ ] unstoppable domains?
- [ ] wallet connect?
- [ ] coinbase wallet?

- [x] rename things to BTFDCA

### frontend

- app
- [x] host on vercel/etc
- [ ] restyle with mui `https://mui.com/`
- [ ] use wagmi hooks `https://wagmi.sh/`

- main
- [x] clicking the LFG button creates the stream with selected values
- [ ] show info messages
- [ ] show error messages
- [ ] implement validations
  - [x] check that wallet has enough tokens
- [x] offer ability to wrap tokens

- wallet
- [x] offer ability to wrap tokens
- [x] allow claiming
- [x] allow approving subscription

### contract

- [x] implement cfa requirements
  - [x] test that cfa is working
- [x] implement ida requirements
  - [ ] test that ida is working
- [x] implement swap logic
- [x] deploy to testnet

- [ ] how to support multiple pairs without deploying 1 contract per pair?
- [ ] how to compute and distribute assets correctly
  - [ ] updateSubscriptionUnits(newInvestor, pro-rata)
    - [ ] needs an update mechanism
  - [ ] updateSubscriptionUnits(newInvestor, full-amount)
    - [ ] buy+distribute before registering new investor
  - [ ] buy+distribute decides the investors and their amounts
    - [ ] requires trust
- [ ] contracts should not be owned by a single wallet
  - [ ] `https://gnosis-safe.io/`
- [ ] emit events
  - [ ] on new investor (maybe not needed, since CFA might emit)
  - [ ] on distribution

## Resources

```links
https://github.com/LooksRare/contracts-token-staking/blob/d754b6e0f41f70532fa5a4fc9196ce67575325b7/contracts/test/utils/MockUniswapV3Router.sol
https://github.com/superfluid-finance/protocol-monorepo/blob/6e6d5ef213938f8b8b66b3ff787a059d0132ff4e/packages/ethereum-contracts/contracts/superfluid/SuperfluidToken.sol
https://github.com/superfluid-finance/protocol-monorepo/blob/bd59c6c270e62d6b1a62761f6bad89de44aa2ce9/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol
https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/apps/IDAv1Library.sol

https://github.com/Ricochet-Exchange/ricochet-protocol/blob/main/contracts/REXMarket.sol#L479
https://github.com/Ricochet-Exchange/ricochet-protocol/blob/main/test/REXMarket.test.js
https://github.com/Ricochet-Exchange/ricochet-protocol/blob/21bef8c63beb3f3cb5ac91b0247a946209159913/misc/helpers.js#L16
https://github.com/Ricochet-Exchange/ricochet-protocol/blob/main/contracts/REXOneWayMarket.sol
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol
https://github.com/Uniswap/v3-periphery/blob/main/contracts/libraries/TransferHelper.sol
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol
https://github.com/superfluid-finance/protocol-monorepo/tree/dev/examples

https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
https://docs.superfluid.finance/superfluid/developers/solidity-examples/solidity-libraries/cfav1-library
```

```shell
# SOLIDITY
https://solidity-by-example.org/
https://medium.com/coinmonks/abi-encode-and-decode-using-solidity-2d372a03e110
https://blog.b9lab.com/storage-pointers-in-solidity-7dcfaa536089

# UNISWAP
https://docs.uniswap.org/protocol/guides/swaps/single-swaps
https://docs.uniswap.org/protocol/reference/deployments

# PARASWAP
https://doc.paraswap.network/

# SUPERFLUID
https://docs.superfluid.finance/superfluid/protocol-overview/super-apps/super-app-callbacks/calling-agreements-in-super-apps
https://docs.superfluid.finance/superfluid/protocol-developers/solidity-examples/solidity-libraries/idav1-library
https://docs.superfluid.finance/superfluid/protocol-overview/super-apps/user-data
https://docs.superfluid.finance/superfluid/protocol-overview/super-apps/super-app-callbacks

https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/

https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/js-sdk/src/ConstantFlowAgreementV1Helper.js
https://github.com/superfluid-finance/protocol-monorepo/blob/dev/examples/nftbillboard-userdata/packages/hardhat/contracts/RedirectAll.sol

## helper scripts for interacting with cfa
https://github.com/superfluid-finance/protocol-monorepo/tree/dev/examples/tradeable-cashflow-hardhat/scripts

## ida examples
https://github.com/superfluid-finance/protocol-monorepo/tree/dev/examples/rewards-distribution-token

https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/mocks/IDASuperAppTester.sol

https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/test/contracts/agreements/InstantDistributionAgreementV1.test.js

### IDA Solidity Library
https://docs.superfluid.finance/superfluid/protocol-developers/solidity-examples/solidity-libraries/idav1-library
https://github.com/superfluid-finance/protocol-monorepo/blob/590735474c141004b75a3b0bea9de5bc2b115932/packages/ethereum-contracts/contracts/apps/IDAv1Library.sol
### IDA JS
https://github.com/superfluid-finance/protocol-monorepo/blob/590735474c141004b75a3b0bea9de5bc2b115932/packages/sdk-core/src/InstantDistributionAgreementV1.ts#L33

# REX
https://github.com/Ricochet-Exchange/ricochet-protocol/blob/main/contracts/REXMarket.sol
https://github.com/Ricochet-Exchange/ricochet-protocol/blob/main/contracts/REXOneWayMarket.sol

# MUMBAI TOKENS
## wmatic
https://mumbai.polygonscan.com/address/0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889#code
## ethgx
https://mumbai.polygonscan.com/address/0xDbF73fD909aD55f2aEE04f328b590945aFC7e5e6#code

https://github.com/tmm/wagmi
```

```snippets
// fund a contract with btc
await fundWithERC20(btc, omnifient, dcaPoolContract);
await mineNBlocks(1);
console.log(
  dcaPoolContract.address,
  "btc bal:",
  await btc.balanceOf(dcaPoolContract.address)
);

// --------------------------------------------------------------------------

console.log(
  omnifient.address,
  "btc bal:",
  await btc.balanceOf(omnifient.address)
);

// --------------------------------------------------------------------------

btcx.transferFrom(
  omnifient,
  dcaPoolContract.address,
  ethers.utils.parseEther("1000")
);

// --------------------------------------------------------------------------

// btc
//   .connect(omnifient)
//   .transferFrom(
//     omnifient,
//     dcaPoolContract.address,
//     ethers.utils.parseEther("1000")
//   );

// console.log(
//   omnifient.address,
//   "btcx bal:",
//   await btcx.balanceOf({
//     account: omnifient.address,
//     providerOrSigner: omnifient,
//   })
// );

// --------------------------------------------------------------------------

// THIS WORKS
// const prov = dcaPoolContract.provider;

// // fund the contract with native tokens
// fundWithNative(dcaPoolContract.address);
// await mineNBlocks(1);
// console.log(
//   "contract.balance",
//   await prov.getBalance(dcaPoolContract.address)
// );

// // fund the signer with native tokens
// fundWithNative(dcaPoolContract.signer.address);
// await mineNBlocks(1);
// console.log(
//   "contract.signer.balance",
//   await prov.getBalance(dcaPoolContract.signer.address)
// );

// --------------------------------------------------------------------------

// THIS WORKS
// fund the signer with btc
await fundWithERC20(btc, omnifient, dcaPoolContract.signer);
await mineNBlocks(1);
console.log(
  dcaPoolContract.signer.address,
  "btc bal:",
  await btc.balanceOf(dcaPoolContract.signer.address)
);

// approve btc and upgrade to btcx for the signer
await btc
  .connect(dcaPoolContract.signer)
  .approve(btcx.address, ethers.utils.parseEther("1000"));

const signerUpgradeOperation = btcx.upgrade({
  amount: ethers.utils.parseEther("1000"),
});
await signerUpgradeOperation.exec(dcaPoolContract.signer);

await mineNBlocks(1);

console.log(
  dcaPoolContract.signer.address,
  "btc bal:",
  await btc.balanceOf(dcaPoolContract.signer.address)
);

console.log(
  dcaPoolContract.signer.address,
  "btcx bal:",
  await btcx.balanceOf({
    account: dcaPoolContract.signer.address,
    providerOrSigner: dcaPoolContract.signer,
  })
);

// --------------------------------------------------------------------------

await mineNBlocks(1);
console.log(
  uniswapContract.address,
  "btc bal:",
  await btc.balanceOf(uniswapContract.address)
);

// --------------------------------------------------------------------------

// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
expect(await token.balanceOf(wallet.address)).to.equal(993);
expect(BigNumber.from(100)).to.be.within(BigNumber.from(99), BigNumber.from(101));
expect(BigNumber.from(100)).to.be.closeTo(BigNumber.from(101), 10);

// Testing if function was called on the provided contract:
await token.balanceOf(wallet.address)
expect('balanceOf').to.be.calledOnContract(token);

// Called on contract with arguments
await token.balanceOf(wallet.address)
expect('balanceOf').to.be.calledOnContractWith(token, [wallet.address]);

// Testing if transaction was reverted:
await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;

// Revert with message
await expect(token.transfer(walletTo.address, 1007)).to.be.revertedWith('Insufficient funds');

// Change ether balance
await expect(() => wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalance(walletTo, 200);

await expect(await wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalance(walletTo, 200);

  // Change ether balance (multiple accounts)
  await expect(() => wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalances([wallet, walletTo], [-200, 200]);

await expect(await wallet.sendTransaction({to: walletTo.address, value: 200}))
  .to.changeEtherBalances([wallet, walletTo], [-200, 200]);

// Mocking your smart contract dependencies.
// https://ethereum-waffle.readthedocs.io/en/latest/mock-contract.html

// --------------------------------------------------------------------------

# @app.route("/transactions", methods=["GET"])
# def get_token_transfers():
#     # TODO: get chain id and contract address from args
#     data = cov_class_a.get_erc20_token_transfers(
#         CHAIN_ID,
#         CONTRACT_ADDR,
#         "0xdbf73fd909ad55f2aee04f328b590945afc7e5e6",
#     )

#     # TODO: handle if data["error"]

#     transfers = []
#     for item in data["data"]["items"]:
#         # from_address
#         # to_address
#         # gas_spent
#         # value
#         # tx_hash
#         # transfers - contract_name, delta, from_address, to_address, transfer_type

#         # pagination?
#         transfers.append()


#     rsp = jsonify(transfers)
#     rsp.headers.add("Access-Control-Allow-Origin", "*")
#     return rsp
```
