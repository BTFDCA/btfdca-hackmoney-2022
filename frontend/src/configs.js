// TODO: these values should be loaded based on the network

import { ADDRESSES } from "./constants";

// i.e. getAvailableSourceTokens(chainId)
const OPTIONS_SOURCE_TOKEN = [
  { label: "MATICx", value: ADDRESSES.MUMBAI.ADDRESS_MATICX },
  { label: "FDAIx", value: ADDRESSES.MUMBAI.ADDRESS_FDAIX },
  // { label: "USDCx", value: ADDRESSES.MUMBAI.ADDRESS_FUSDCX },
];

const OPTIONS_TARGET_TOKEN = [
  // { label: "WBTCx", value: ADDRESSES.MUMBAI.ADDRESS_WBTCX },
  { label: "WETHx", value: ADDRESSES.MUMBAI.ADDRESS_WETHX },
];

const OPTIONS_CADENCE = [
  // { label: "month", value: "30" },
  // { label: "week", value: "7" },
  { label: "day", value: "1" },
];

const OPTIONS_TOKEN_WRAPS = [
  {
    label: "MATIC",
    value: 0,
    upgradeTo: ADDRESSES.MUMBAI.ADDRESS_MATICX,
    isNative: true,
  },
  {
    label: "FDAI",
    value: 1,
    address: ADDRESSES.MUMBAI.ADDRESS_FDAI,
    upgradeTo: ADDRESSES.MUMBAI.ADDRESS_FDAIX,
  },
  {
    label: "FUSDC",
    value: 2,
    address: ADDRESSES.MUMBAI.ADDRESS_FUSDC,
    upgradeTo: ADDRESSES.MUMBAI.ADDRESS_FUSDCX,
  },
  {
    label: "WETH",
    value: 3,
    address: ADDRESSES.MUMBAI.ADDRESS_WETH,
    upgradeTo: ADDRESSES.MUMBAI.ADDRESS_WETHX,
  },

  { label: "MATICx", value: 4, downgradeFrom: ADDRESSES.MUMBAI.ADDRESS_MATICX },
  { label: "WETHx", value: 5, downgradeFrom: ADDRESSES.MUMBAI.ADDRESS_WETHX },
  { label: "FDAIx", value: 6, downgradeFrom: ADDRESSES.MUMBAI.ADDRESS_FDAIX },
  { label: "FUSDCx", value: 7, downgradeFrom: ADDRESSES.MUMBAI.ADDRESS_FUSDCX },
];

export {
  OPTIONS_TOKEN_WRAPS,
  OPTIONS_SOURCE_TOKEN,
  OPTIONS_TARGET_TOKEN,
  OPTIONS_CADENCE,
};
