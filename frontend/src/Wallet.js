import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { OPTIONS_SOURCE_TOKEN, OPTIONS_TARGET_TOKEN } from "./configs";
import { ADDRESSES } from "./constants";

async function getFlow(sender, sourceToken) {
  console.log("Getting the flow");
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
    resolverAddress: ADDRESSES.MUMBAI.ADDRESS_SUPERFLUID_RESOLVER,
    // dataMode: "WEB3_ONLY",
    // protocolReleaseVersion: "test",
  });
  console.log("got the sf object", sf);

  // start streaming the tokens from the user to the dca superapp contract
  try {
    const userFlowRate = await sf.cfaV1.getFlow({
      superToken: sourceToken,
      sender: sender,
      receiver: ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP,
      providerOrSigner: signer,
    });
    console.log(".........", userFlowRate);
  } catch (error) {
    console.error(error);
  }
}

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
    resolverAddress: ADDRESSES.MUMBAI.ADDRESS_SUPERFLUID_RESOLVER,
    // dataMode: "WEB3_ONLY",
    // protocolReleaseVersion: "test",
  });
  console.log("got the sf object", sf);

  try {
    console.log("getting the subscription");
    const subscription = await sf.idaV1.getSubscription({
      publisher: ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP,
      indexId: 0, // TODO: change
      superToken: targetToken,
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
    resolverAddress: ADDRESSES.MUMBAI.ADDRESS_SUPERFLUID_RESOLVER,
    // dataMode: "WEB3_ONLY",
    // protocolReleaseVersion: "test",
  });
  console.log("got the sf object", sf);

  try {
    const claimOperation = await sf.idaV1.claim({
      publisher: ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP,
      indexId: 0, // TODO: change
      superToken: targetToken,
      subscriber: sender,
    });
    console.log("created claim operation", claimOperation);

    const result = await claimOperation.exec(signer);
    console.log("claimed!", result);
  } catch (error) {
    console.error(error);
  }
}

function Wallet({ account, connectWallet }) {
  const [srcToken] = useState(OPTIONS_SOURCE_TOKEN[0].value);
  const [targetToken] = useState(OPTIONS_TARGET_TOKEN[0].value);

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
            getFlow(account, srcToken);
          }}
        >
          get flow
        </button>
        <button
          style={{ marginLeft: "1rem" }}
          onClick={async () => {
            getClaimDetails(account, targetToken);
          }}
        >
          get distribution details!
        </button>
        <button
          style={{ marginLeft: "1rem" }}
          onClick={async () => {
            claim(account, targetToken);
          }}
        >
          claim!
        </button>
      </div>

      <div>
        {/* TODO: get network name from somewhere */}
        <a
          href={
            "https://console.superfluid.finance/" +
            "mumbai" +
            "/accounts/" +
            account
          }
        >
          Go to your superfluid dashboard
        </a>
      </div>

      <div>
        {/* TODO: get network name from somewhere */}
        <a
          href={
            "https://console.superfluid.finance/" +
            "mumbai" +
            "/accounts/" +
            ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP
          }
        >
          Go to the contract's superfluid dashboard
        </a>
      </div>
    </div>
  );
}

export default Wallet;
