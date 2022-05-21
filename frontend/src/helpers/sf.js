import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { ADDRESSES } from "../config/constants";

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

export { getSignerAndFramework };
