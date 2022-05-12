import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";

async function createDCAFlow() {
  // TODO: missing parameters (amount, sourceToken, targetToken, cadence)
  console.log("Creating the DCA flow");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });
  console.log("got the sf object", sf);

  // TODO: change to sourceToken
  // const DAIxContract = await sf.loadSuperToken("fDAIx");
  // const DAIx = DAIxContract.address;

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

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  // TODO: set default values (following the order from the dropdowns)
  const [buyAmount, setBuyAmount] = useState();
  const [srcToken, setSourceToken] = useState();
  const [targetToken, setTargetToken] = useState();
  const [buyCadence, setBuyCadence] = useState();

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
    // TODO: disable the button and show some info msg

    // TODO: do stuff - create the superfluid stream, etc
    createDCAFlow();

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
          <select onChange={(e) => setSourceToken(e.target.value)}>
            <option value="dai">DAI</option>
            <option value="usdc">USDC</option>
          </select>
        </span>
        <span>worth of</span>
        <span>
          <select onChange={(e) => setTargetToken(e.target.value)}>
            <option value="wbtc">wBTC</option>
            <option value="weth">wETH</option>
          </select>
        </span>
        <span>every</span>
        <span>
          <select onChange={(e) => setBuyCadence(e.target.value)}>
            <option value="month">month</option>
            <option value="week">week</option>
            <option value="day">day</option>
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
