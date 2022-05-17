import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { OPTIONS_SOURCE_TOKEN } from "./configs";
import { ADDRESSES } from "./constants";

async function getClaimDetails(sender, targetToken) {
  console.log(
    "retrieving details of the IDA subscription",
    sender,
    targetToken
  );
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  console.log(`connected to chain ${chainId}`);
  // TODO: get addresses for this chain id (resolver)
  // TODO: if test network, send test params to create, otherwise don't
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
    customSubgraphQueriesEndpoint: "",
    resolverAddress: ADDRESSES.LOCAL.ADDRESS_SUPERFLUID_RESOLVER,
    dataMode: "WEB3_ONLY",
    protocolReleaseVersion: "test",
  });
  console.log("got the sf object", sf);

  // TODO: assert source token exists in this network
  const targetTokenContract = await sf.loadSuperToken(targetToken);
  const targetTokenAddress = targetTokenContract.address;

  try {
    const subscription = await sf.idaV1.getSubscription({
      publisher: ADDRESSES.LOCAL.ADDRESS_DCA_SUPERAPP,
      indexId: 0, // TODO: change
      superToken: targetTokenAddress,
      subscriber: sender,
      providerOrSigner: provider,
    });

    console.log("fetched the subscription!", subscription);
  } catch (error) {
    console.error(error);
  }
}

async function claim(sender, targetToken) {
  console.log("claiming rewards!");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  console.log(`connected to chain ${chainId}`);
  // TODO: get addresses for this chain id (resolver)
  // TODO: if test network, send test params to create, otherwise don't
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
    customSubgraphQueriesEndpoint: "",
    resolverAddress: ADDRESSES.LOCAL.ADDRESS_SUPERFLUID_RESOLVER,
    dataMode: "WEB3_ONLY",
    protocolReleaseVersion: "test",
  });
  console.log("got the sf object", sf);

  // TODO: assert source token exists in this network
  const targetTokenContract = await sf.loadSuperToken(targetToken);
  const targetTokenAddress = targetTokenContract.address;

  try {
    const claimOperation = await sf.idaV1.claim({
      publisher: ADDRESSES.LOCAL.ADDRESS_DCA_SUPERAPP,
      indexId: 0, // TODO: change
      superToken: targetTokenAddress,
      subscriber: sender,
    });
    const result = await claimOperation.exec(signer);
    console.log("claimed!", result);
  } catch (error) {
    console.error(error);
  }
}

function Wallet({ account, connectWallet }) {
  const [srcToken] = useState(OPTIONS_SOURCE_TOKEN[0].value);

  useEffect(() => {
    console.log("hey");
  }, []);

  return (
    <div>
      <div>
        <a href="/">Go Back</a>
      </div>

      <div style={{ margin: "10rem 0" }}>
        <button
          style={{ marginRight: "1rem" }}
          onClick={async () => {
            getClaimDetails(account, srcToken);
          }}
        >
          get distribution details!
        </button>
        <button
          style={{ marginLeft: "1rem" }}
          onClick={async () => {
            claim(account, srcToken);
          }}
        >
          claim!
        </button>
      </div>
    </div>
  );
}

export default Wallet;
