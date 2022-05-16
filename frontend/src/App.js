import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ADDRESSES } from "./constants";

import "./App.css";

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
  console.log(`connected to chain ${chainId}`);
  // TODO: get addresses for this chain id (resolver)
  // TODO: if test network, send test params to create, otherwise don't
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
    dataMode: "WEB3_ONLY",
    resolverAddress: ADDRESSES.LOCAL.ADDRESS_SUPERFLUID_RESOLVER,
    protocolReleaseVersion: "test",
  });
  console.log("got the sf object", sf);

  // TODO: assert source token exists in this network
  const srcTokenContract = await sf.loadSuperToken(sourceToken);
  const srcTokenAddress = srcTokenContract.address;

  // the amount of source token per second to be streamed from the user to the contract
  const monthlyBuyAmount = amount * (30 / cadenceInDays);
  const flowRateInEth = monthlyBuyAmount / 3600 / 24 / 30;
  const flowRateInWei = ethers.utils.parseEther(flowRateInEth.toFixed(18));
  console.log("flow rate:", flowRateInWei.toString());

  // start streaming the tokens from the user to the dca superapp contract
  try {
    let userData = ethers.utils.defaultAbiCoder.encode(
      ["string", "uint256", "string", "uint8"],
      [sourceToken, amount, targetToken, cadenceInDays]
    );
    console.log(userData);

    const createFlowOperation = sf.cfaV1.createFlow({
      receiver: ADDRESSES.LOCAL.ADDRESS_DCA_SUPERAPP,
      flowRate: flowRateInWei.toString(),
      superToken: srcTokenAddress,
      userData: userData,
    });

    const result = await createFlowOperation.exec(signer);
    console.log("stream created!", result);

    // const userFlowRate = await sf.cfaV1.getFlow({
    //   superToken: srcTokenAddress,
    //   sender: sender,
    //   receiver: ADDRESSES.LOCAL.ADDRESS_DCA_SUPERAPP,
    //   providerOrSigner: signer,
    // });
    // console.log(".........", userFlowRate);
  } catch (error) {
    console.error(error);
  }
}

// TODO: these values should be loaded based on the network
// i.e. getAvailableSourceTokens(chainId)
const OPTIONS_SOURCE_TOKEN = [
  { label: "DAI", value: "fDAIx" },
  { label: "USDC", value: "fUSDCx" },
];

const OPTIONS_TARGET_TOKEN = [
  { label: "BTC", value: "BTC" },
  { label: "ETH", value: "ETH" },
];

const OPTIONS_CADENCE = [
  { label: "month", value: "30" },
  { label: "week", value: "7" },
  { label: "day", value: "1" },
];

const renderOptions = (options) => {
  return options.map((opt) => (
    <option key={opt.label} value={opt.value}>
      {opt.label}
    </option>
  ));
};

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  // TODO: set default values (following the order from the dropdowns)
  const [buyAmount, setBuyAmount] = useState(0);
  const [srcToken, setSourceToken] = useState(OPTIONS_SOURCE_TOKEN[0].value);
  const [targetToken, setTargetToken] = useState(OPTIONS_TARGET_TOKEN[0].value);
  const [buyCadence, setBuyCadence] = useState(OPTIONS_CADENCE[0].value);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const setupDCAFlow = async () => {
    console.log(
      `setup an agreement to trade ${buyAmount} ${srcToken} for ${targetToken} every ${buyCadence}`
    );
    // TODO: perform validations - i.e. check if the wallet has the funds etc
    // if not srcToken
    // TODO: disable the button and show some info msg

    // TODO: do stuff - create the superfluid stream, etc
    createDCAFlow(currentAccount, buyAmount, srcToken, targetToken, buyCadence);

    // TODO:
    // redirect the user somewhere if DCA is set up
    // show an error message if something goes wrong
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
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
            step="100"
            placeholder="100"
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

        <div>TODO: calculate how much in funds the wallet must have</div>
      </div>

      {/* action buttons */}
      <div className="lfgWrapper">
        {currentAccount === "" ? (
          <button id="connectWallet" className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <button id="lfgButton" onClick={setupDCAFlow}>
            LFG!
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
