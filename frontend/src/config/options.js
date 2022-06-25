import { getErc20Balance } from "../helpers/balances";

// TODO: these values should be loaded based on the network
// i.e. getAvailableSourceTokens(chainId)

import { ADDRESSES } from "./constants";

const getSourceTokenOptions = (chainId) => {
  return [{ id: 0, label: "FDAIx", value: ADDRESSES[chainId].ADDRESS_FDAIX }];
};

const getTargetTokenOptions = (chainId) => {
  // return [{ id: 0, label: "ETHGx", value: ADDRESSES[chainId].ADDRESS_ETHGX }];
  return [
    { id: 1, label: "ENCx", value: ADDRESSES[chainId].ADDRESS_ENCX },
    { id: 2, label: "BTFDCAx", value: ADDRESSES[chainId].ADDRESS_BTFDCAX },
  ];
};

const getUpgradableTokens = (chainId) => {
  // TODO: get these values from the network
  return [
    {
      label: "FDAI",
      value: 0,
      address: ADDRESSES[chainId].ADDRESS_FDAI,
      upgradeTo: ADDRESSES[chainId].ADDRESS_FDAIX,
    },
    {
      label: "ENC",
      value: 1,
      address: ADDRESSES[chainId].ADDRESS_ENC,
      upgradeTo: ADDRESSES[chainId].ADDRESS_ENCX,
    },
    {
      label: "BTFDCA",
      value: 2,
      address: ADDRESSES[chainId].ADDRESS_BTFDCA,
      upgradeTo: ADDRESSES[chainId].ADDRESS_BTFDCAX,
    },
    // {
    //   label: "ETHG",
    //   value: 3,
    //   address: ADDRESSES[chainId].ADDRESS_ETHG,
    //   upgradeTo: ADDRESSES[chainId].ADDRESS_ETHGX,
    // },
  ];
};

const getDowgradableTokens = (chainId) => {
  // TODO: get these values from the network
  return [
    {
      label: "FDAIx",
      value: 1,
      downgradeFrom: ADDRESSES[chainId].ADDRESS_FDAIX,
    },
    {
      label: "ENCx",
      value: 1,
      downgradeFrom: ADDRESSES[chainId].ADDRESS_ENCX,
    },
    {
      label: "BTFDCAx",
      value: 2,
      downgradeFrom: ADDRESSES[chainId].ADDRESS_BTFDCAX,
    },
    // {
    //   label: "ETHGx",
    //   value: 3,
    //   address: ADDRESSES[chainId].ADDRESS_ETHGX,
    // },
  ];
};

async function fetchBalances(chainId, account, onFetchComplete) {
  // TODO: this should be more dynamic, by creating the structure based on getSource/TargetTokens
  const balances = [
    {
      unwrappedTokenAddress: ADDRESSES[chainId].ADDRESS_FDAI,
      unwrappedToken: "FDAI",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_FDAI,
        account
      ),
      wrappedTokenAddress: ADDRESSES[chainId].ADDRESS_FDAIX,
      wrappedToken: "FDAIx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_FDAIX,
        account
      ),
    },
    {
      unwrappedTokenAddress: ADDRESSES[chainId].ADDRESS_ENC,
      unwrappedToken: "ENC",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_ENC,
        account
      ),
      wrappedTokenAddress: ADDRESSES[chainId].ADDRESS_ENCX,
      wrappedToken: "ENCx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_ENCX,
        account
      ),
    },
    {
      unwrappedTokenAddress: ADDRESSES[chainId].ADDRESS_BTFDCA,
      unwrappedToken: "BTFDCA",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_BTFDCA,
        account
      ),
      wrappedTokenAddress: ADDRESSES[chainId].ADDRESS_BTFDCAX,
      wrappedToken: "BTFDCAx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_BTFDCAX,
        account
      ),
    },
    // {
    //   unwrappedTokenAddress: ADDRESSES[chainId].ADDRESS_ETHGX,
    //   unwrappedToken: "ETHGx",
    //   unwrappedTokenBalance: await getErc20Balance(
    //     ADDRESSES[chainId].ADDRESS_ETHGX,
    //     account
    //   ),
    //   wrappedTokenAddress: ADDRESSES[chainId].ADDRESS_ETHGX,
    //   wrappedToken: "ETHGx",
    //   wrappedTokenBalance: await getErc20Balance(
    //     ADDRESSES[chainId].ADDRESS_ETHGX,
    //     account
    //   ),
    // },
  ];

  onFetchComplete(balances);
}

const getDcaPoolContracts = (chainId) => {
  return {
    "FDAIx/ENCx": ADDRESSES[chainId].ADDRESS_DCA_FDAIX_ENCX,
    "FDAIx/BTFDCAx": ADDRESSES[chainId].ADDRESS_DCA_FDAIX_BTFDCAX,
    // "FDAIx/ETHGx": ADDRESSES[chainId].ADDRESS_DCA_FDAIX_ETHGX,
  };
};

const getDcaPoolContract = (chainId, sourceTokenAddr, targetTokenAddr) => {
  // if (
  //   sourceTokenAddr === ADDRESSES[chainId].ADDRESS_FDAIX &&
  //   targetTokenAddr === ADDRESSES[chainId].ADDRESS_ETHGX
  // )
  //   return ADDRESSES[chainId].ADDRESS_DCA_FDAIX_ETHGX;
  if (
    sourceTokenAddr === ADDRESSES[chainId].ADDRESS_FDAIX &&
    targetTokenAddr === ADDRESSES[chainId].ADDRESS_ENCX
  )
    return ADDRESSES[chainId].ADDRESS_DCA_FDAIX_ENCX;
  if (
    sourceTokenAddr === ADDRESSES[chainId].ADDRESS_FDAIX &&
    targetTokenAddr === ADDRESSES[chainId].ADDRESS_BTFDCAX
  )
    return ADDRESSES[chainId].ADDRESS_DCA_FDAIX_BTFDCAX;
};

export {
  getSourceTokenOptions,
  getTargetTokenOptions,
  getUpgradableTokens,
  getDowgradableTokens,
  fetchBalances,
  getDcaPoolContracts,
  getDcaPoolContract,
};
