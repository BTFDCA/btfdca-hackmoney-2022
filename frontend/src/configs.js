import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

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

async function getSignerAndFramework() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const chainId = Number(
    await window.ethereum.request({ method: "eth_chainId" })
  );
  // TODO: if test network, send test params to create, otherwise don't
  const sf = await Framework.create({
    chainId: chainId,
    provider: provider,
    customSubgraphQueriesEndpoint: "",
    resolverAddress: ADDRESSES[chainId].ADDRESS_SUPERFLUID_RESOLVER,
    // dataMode: "WEB3_ONLY",
    // protocolReleaseVersion: "test",
  });
  console.log("[common] got the sf object");

  return [chainId, signer, sf];
}
export {
  getWrapTokensOptions,
  getSourceTokenOptions,
  getTargetTokenOptions,
  OPTIONS_CADENCE,
  getSignerAndFramework,
};
