// TODO: these values should be loaded based on the network

import { ADDRESSES } from "./constants";

// i.e. getAvailableSourceTokens(chainId)
const OPTIONS_SOURCE_TOKEN = [
  { label: "MATICx", value: ADDRESSES.MUMBAI.ADDRESS_MATICX },
  { label: "DAIx", value: ADDRESSES.MUMBAI.ADDRESS_DAIX },
  // { label: "USDC", value: "fUSDCx" },
];

const OPTIONS_TARGET_TOKEN = [
  // { label: "WBTCx", value: "BTC" },
  { label: "WETHx", value: ADDRESSES.MUMBAI.ADDRESS_WETHX },
];

const OPTIONS_CADENCE = [
  // { label: "month", value: "30" },
  // { label: "week", value: "7" },
  { label: "day", value: "1" },
];

export { OPTIONS_SOURCE_TOKEN, OPTIONS_TARGET_TOKEN, OPTIONS_CADENCE };
