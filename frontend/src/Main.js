import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useState } from "react";
import {
  OPTIONS_CADENCE,
  OPTIONS_SOURCE_TOKEN,
  OPTIONS_TARGET_TOKEN,
} from "./configs";
import { ADDRESSES } from "./constants";

import "./Main.css";

async function createDCAFlow(
  sender,
  amount,
  sourceToken,
  targetToken,
  cadenceInDays
) {
  console.log("Creating the DCA flow");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  console.log(`connected to chain ${Number(chainId)}`);
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

  // the amount of source token per second to be streamed from the user to the contract
  const monthlyBuyAmount = amount * (30 / cadenceInDays);
  const flowRateInEth = monthlyBuyAmount / 3600 / 24 / 30;
  const flowRateInWei = ethers.utils.parseEther(flowRateInEth.toFixed(18));
  console.log("flow rate:", flowRateInWei.toString());

  const amountInWei = ethers.utils.parseEther(amount);
  console.log("amount per day in wei", amountInWei.toString());

  // start streaming the tokens from the user to the dca superapp contract
  try {
    let userData = ethers.utils.defaultAbiCoder.encode(
      ["string", "uint256", "string"],
      [sourceToken, amountInWei, targetToken]
    );
    console.log("user data:", userData);

    const createFlowOperation = sf.cfaV1.createFlow({
      receiver: ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP,
      flowRate: flowRateInWei.toString(),
      superToken: sourceToken,
      userData: userData,
    });
    console.log("created the create flow operation", createFlowOperation);

    const result = await createFlowOperation.exec(signer);
    console.log("stream created!", result);
  } catch (error) {
    console.error(error);
  }
}

function Main({ account, connectWallet }) {
  const [buyAmount, setBuyAmount] = useState(0);
  const [srcToken, setSourceToken] = useState(OPTIONS_SOURCE_TOKEN[0].value);
  const [targetToken, setTargetToken] = useState(OPTIONS_TARGET_TOKEN[0].value);
  const [buyCadence, setBuyCadence] = useState(OPTIONS_CADENCE[0].value);

  const renderOptions = (options) => {
    return options.map((opt) => (
      <option key={opt.label} value={opt.value}>
        {opt.label}
      </option>
    ));
  };

  const estimateRequiredAmount = (amount, cadenceInDays) => {
    if (amount > 0 && cadenceInDays > 0) {
      const cadenceInHours = cadenceInDays * 24;
      const amountPerHour = amount / cadenceInHours;

      let escrowHours = 4; // TODO: if testnet == 1, else == 4
      const requiredEscrow = amountPerHour * escrowHours;

      return requiredEscrow.toFixed(2);
      // const flowRateInEth = monthlyBuyAmount / 3600 / 24 / 30;
      // const flowRateInWei = ethers.utils.parseEther(flowRateInEth.toFixed(18));
      // console.log("flow rate:", flowRateInWei.toString());

      // const amountInWei = ethers.utils.parseEther(amount);
      // console.log("amount per day in wei", amountInWei.toString());
    } else {
      return 0;
    }
  };

  const setupDCAFlow = async () => {
    console.log(
      `setup an agreement to trade ${buyAmount} ${srcToken} for ${targetToken} every ${buyCadence} day(s)`
    );

    // TODO: perform validations - i.e. check if the wallet has the funds etc
    // if not srcToken
    // TODO: disable the button and show some info msg

    // TODO: do stuff - create the superfluid stream, etc
    createDCAFlow(account, buyAmount, srcToken, targetToken, buyCadence);

    // TODO:
    // redirect the user somewhere if DCA is set up
    // show an error message if something goes wrong
  };

  return (
    <div>
      <div>
        <a href="/wallet">Wallet</a>
      </div>
      {/* logo stuff */}
      <div className="logoWrapper">
        <div>Buy Crypto Assets the Smart Way!</div>
        <div>DCA is the Way.</div>
      </div>

      {/* the dca configuration */}
      <div className="dcaWrapper">
        <span>I want to buy</span>
        <span>
          {/* TODO: cannot be negative */}
          <input
            type="number"
            step="10"
            placeholder="10"
            onChange={(e) => setBuyAmount(e.target.value)}
          />
        </span>
        <span>
          <select
            className="dropdown"
            onChange={(e) => setSourceToken(e.target.value)}
          >
            {renderOptions(OPTIONS_SOURCE_TOKEN)}
          </select>
        </span>
        <span>worth of</span>
        <span>
          <select
            className="dropdown"
            onChange={(e) => setTargetToken(e.target.value)}
          >
            {renderOptions(OPTIONS_TARGET_TOKEN)}
          </select>
        </span>
        <span>every</span>
        <span>
          <select
            className="dropdown"
            onChange={(e) => setBuyCadence(e.target.value)}
          >
            {renderOptions(OPTIONS_CADENCE)}
          </select>
        </span>
        <span>.</span>
      </div>

      {/* error / info messages */}
      <div className="alertWrapper">
        <div>
          if something goes wrong, or we want to alert the user about something
        </div>

        {/* TODO: show label of srcToken */}
        <div>
          Your wallet must have at least{" "}
          {estimateRequiredAmount(buyAmount, buyCadence)} {srcToken} to BTFDCA!
        </div>
        <div>
          we're using superfluid, so you need to wrap your token into tokenx.
          you can do it in /wallet
        </div>
      </div>

      {/* action buttons */}
      <div className="lfgWrapper">
        {account === "" ? (
          <button id="connectWallet" className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <button id="lfgButton" onClick={setupDCAFlow}>
            BTFDCA!
          </button>
        )}
      </div>
    </div>
  );
}

export default Main;
