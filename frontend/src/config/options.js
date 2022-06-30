import { getErc20Balance } from "../helpers/balances";

// TODO: everything should be loaded based on the network

import { ADDRESSES } from "./constants";

const getSuperfluidResolverAddress = (chainId) => {
  return ADDRESSES[chainId].ADDRESS_SUPERFLUID_RESOLVER;
};

const getStablexAddress = (chainId) => {
  return ADDRESSES[chainId].ADDRESS_STABLEX;
};

const getSourceTokenOptions = (chainId) => {
  return [
    { id: 0, label: "STABLEx", value: ADDRESSES[chainId].ADDRESS_STABLEX },
  ];
};

const getTargetTokenOptions = (chainId) => {
  return [
    { id: 1, label: "ENCx", value: ADDRESSES[chainId].ADDRESS_ENCX },
    { id: 2, label: "BTFDCAx", value: ADDRESSES[chainId].ADDRESS_BTFDCAX },
  ];
};

const getUpgradableTokens = (chainId) => {
  return [
    {
      label: "STABLE",
      value: 0,
      address: ADDRESSES[chainId].ADDRESS_STABLE,
      upgradeTo: ADDRESSES[chainId].ADDRESS_STABLEX,
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
  ];
};

const getDowgradableTokens = (chainId) => {
  return [
    {
      label: "STABLEx",
      value: 1,
      downgradeFrom: ADDRESSES[chainId].ADDRESS_STABLEX,
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
  ];
};

async function fetchBalances(chainId, account, onFetchComplete) {
  const balances = [
    {
      unwrappedTokenAddress: ADDRESSES[chainId].ADDRESS_STABLE,
      unwrappedToken: "STABLE",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_STABLE,
        account
      ),
      wrappedTokenAddress: ADDRESSES[chainId].ADDRESS_STABLEX,
      wrappedToken: "STABLEx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_STABLEX,
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
  ];

  onFetchComplete(balances);
}

const getDcaPoolContracts = (chainId) => {
  return {
    "STABLEx/ENCx": ADDRESSES[chainId].ADDRESS_DCA_STABLEX_ENCX,
    "STABLEx/BTFDCAx": ADDRESSES[chainId].ADDRESS_DCA_STABLEX_BTFDCAX,
  };
};

const getDcaPoolContract = (chainId, sourceTokenAddr, targetTokenAddr) => {
  if (
    sourceTokenAddr === ADDRESSES[chainId].ADDRESS_STABLEX &&
    targetTokenAddr === ADDRESSES[chainId].ADDRESS_ENCX
  )
    return ADDRESSES[chainId].ADDRESS_DCA_STABLEX_ENCX;
  if (
    sourceTokenAddr === ADDRESSES[chainId].ADDRESS_STABLEX &&
    targetTokenAddr === ADDRESSES[chainId].ADDRESS_BTFDCAX
  )
    return ADDRESSES[chainId].ADDRESS_DCA_STABLEX_BTFDCAX;
};

export {
  getSourceTokenOptions,
  getTargetTokenOptions,
  getUpgradableTokens,
  getDowgradableTokens,
  fetchBalances,
  getDcaPoolContracts,
  getDcaPoolContract,
  getSuperfluidResolverAddress,
  getStablexAddress,
};
