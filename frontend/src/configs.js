// TODO: these values should be loaded based on the network
// i.e. getAvailableSourceTokens(chainId)
const OPTIONS_SOURCE_TOKEN = [
  { label: "DAI", value: "fDAIx" },
  // { label: "USDC", value: "fUSDCx" },
];

const OPTIONS_TARGET_TOKEN = [
  { label: "BTC", value: "BTC" },
  // { label: "ETH", value: "ETH" },
];

const OPTIONS_CADENCE = [
  // { label: "month", value: "30" },
  // { label: "week", value: "7" },
  { label: "day", value: "1" },
];

export { OPTIONS_SOURCE_TOKEN, OPTIONS_TARGET_TOKEN, OPTIONS_CADENCE };
