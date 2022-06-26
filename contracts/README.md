# DCA

## testing on local node

```shell
yarn chain

npx hardhat run --network localhost scripts/local/00-deploy.js
npx hardhat run --network localhost scripts/local/01-create-flow.js
npx hardhat run --network localhost scripts/local/02-buy-and-distribute.js
```

## testing on polygon mumbai

```shell
npx hardhat run --network mumbai scripts/mumbai/00-deploy-stablex-encx.js
npx hardhat run --network mumbai scripts/mumbai/00-deploy-stablex-btfdcax.js
npx hardhat run --network mumbai scripts/mumbai/01-swap-tokens.js
npx hardhat run --network mumbai scripts/mumbai/03-buy-and-distribute.js
```

### network fork

```shell
npx hardhat node --fork https://polygon-mumbai.g.alchemy.com/v2/9P0PsfcTEi-qha6LUTGMmBxVr_zqEhk1
npx hardhat run --network localhost scripts/local/00-deploy.js
npx hardhat run --network localhost scripts/mumbai/01-swap-tokens.js
npx hardhat run --network localhost scripts/mumbai/03-buy-and-distribute.js

```

## common commands

```shell
npx hardhat console --network hardhat
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```
