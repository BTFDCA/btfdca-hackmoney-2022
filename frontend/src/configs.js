// TODO: these values should be loaded based on the network

import { ADDRESSES } from "./constants";

// i.e. getAvailableSourceTokens(chainId)
const getSourceTokenOptions = (chainId) => {
  return [{ label: "FDAIx", value: ADDRESSES[chainId].ADDRESS_FDAIX }];
};

const getTargetTokenOptions = (chainId) => {
  return [{ label: "ETHGx", value: ADDRESSES[chainId].ADDRESS_ETHGX }];
};

const OPTIONS_CADENCE = [{ label: "day", value: "1" }];

const getWrapTokensOptions = (chainId) => {
  return [
    {
      label: "FDAI",
      value: 0,
      address: ADDRESSES[chainId].ADDRESS_FDAI,
      upgradeTo: ADDRESSES[chainId].ADDRESS_FDAI,
    },
    {
      label: "FDAIx",
      value: 1,
      downgradeFrom: ADDRESSES[chainId].ADDRESS_FDAIX,
    },
    {
      label: "ETHGx",
      value: 2,
      address: ADDRESSES[chainId].ADDRESS_ETHGX,
    },
  ];
};

export {
  getWrapTokensOptions,
  getSourceTokenOptions,
  getTargetTokenOptions,
  OPTIONS_CADENCE,
};
