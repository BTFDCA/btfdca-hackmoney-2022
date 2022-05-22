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

export { getSourceTokenOptions, getTargetTokenOptions, OPTIONS_CADENCE };
