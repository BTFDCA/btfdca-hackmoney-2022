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
- [ ] buy modes
  - [ ] spend a fixed amount (e.g. $10/month)
  - [ ] buy target amount (e.g. 1 BTC / N time = x/month/day)
- [ ] time oracles
- [ ] reinvest assets
- [ ] push notifications
- [ ] show contract balance (per dca pool)
- [ ] show counter until next buy (per dca pool)
- [ ] show amount bought and distributed
  - [ ] per dca pool
- [ ] show how much an investor has invested/received
  - [ ] list transactions
- [ ] show available balance to "claim"

- polygon hackathon
- [ ] research how to use unstoppable domains
- [ ] research how to use covalent

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

- [ ] how to compute and distribute assets correctly

  - [ ] updateSubscriptionUnits(newInvestor, pro-rata)
    - [ ] needs an update mechanism
  - [ ] updateSubscriptionUnits(newInvestor, full-amount)
    - [ ] buy+distribute before registering new investor
  - [ ] buy+distribute decides the investors and their amounts
    - [ ] requires trust

- [ ] distribute the owner of the contracts
  - [ ] `https://gnosis-safe.io/`

## Resources

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
