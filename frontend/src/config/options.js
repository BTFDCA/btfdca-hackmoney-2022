// TODO: these values should be loaded based on the network
// i.e. getAvailableSourceTokens(chainId)

import { ADDRESSES } from "./constants";

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
      label: "ETHG",
      value: 2,
      address: ADDRESSES[chainId].ADDRESS_ETHG,
    },
    {
      label: "ETHGx",
      value: 3,
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
