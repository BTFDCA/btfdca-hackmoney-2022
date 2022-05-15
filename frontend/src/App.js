import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
import { ADDRESSES } from "./constants";

async function createDCAFlow(sourceToken) {
  // TODO: missing parameters (amount, sourceToken, targetToken, cadence)
  console.log("Creating the DCA flow");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  // TODO: get addresses for this chain id

  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
    dataMode: "WEB3_ONLY",
    resolverAddress: ADDRESSES.LOCAL.ADDRESS_SUPERFLUID_RESOLVER,
    protocolReleaseVersion: "test",
  });
  console.log("got the sf object", sf);

  // TODO: change to sourceToken
  const DAIxContract = await sf.loadSuperToken(sourceToken);
  const DAIx = DAIxContract.address;
  console.log("xxxxxxxxxxxxx dai", DAIx);

  // TODO: convert the amount into flowRate based on cadence and amount
  // const amountInWei = ethers.BigNumber.from(amount);
  // const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
  // const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;

  // try {
  //   const createFlowOperation = sf.cfaV1.createFlow({
  //     receiver: recipient,  // TODO: change to superapp's address
  //     flowRate: flowRate,  // calculate flowRate based on amount and cadence
  //     superToken: DAIx,  // TODO: sourceToken
  //     userData?: string  // TODO: wrap args
  //   });

  //   console.log("Creating your stream...");
  //   const result = await createFlowOperation.exec(signer);
  //   console.log(result);

  //   console.log(
  //     `Congrats - you've just created a money stream!
  //   View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
  //   Network: Kovan
  //   Super Token: DAIx
  //   Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
  //   Receiver: ${recipient},
  //   FlowRate: ${flowRate}
  //   `
  //   );
  // } catch (error) {
  //   console.log(
  //     "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
  //   );
  //   console.error(error);
  // }
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
  { label: "month", value: "month" },
  { label: "week", value: "week" },
  { label: "day", value: "day" },
];

const renderOptions = (options) => {
  return options.map((opt) => <option value={opt.value}>{opt.label}</option>);
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
    createDCAFlow(srcToken);

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
