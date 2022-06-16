// TODO: these values should be loaded based on the network
// i.e. getAvailableSourceTokens(chainId)

import { ADDRESSES } from "./constants";

const getSourceTokenOptions = (chainId) => {
  return [{ id: 0, label: "FDAIx", value: ADDRESSES[chainId].ADDRESS_FDAIX }];
};

const getTargetTokenOptions = (chainId) => {
  return [{ id: 0, label: "ETHGx", value: ADDRESSES[chainId].ADDRESS_ETHGX }];
};

const OPTIONS_CADENCE = [{ label: "day", value: "1" }];

export { getSourceTokenOptions, getTargetTokenOptions, OPTIONS_CADENCE };
