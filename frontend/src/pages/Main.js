import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  OPTIONS_CADENCE,
  getSourceTokenOptions,
  getTargetTokenOptions,
} from "../config/options";
import { ADDRESSES } from "../config/constants";
import { getSignerAndFramework } from "../helpers/sf";

import "../styles/Main.css";
import { getErc20Balance } from "../helpers/balances";

async function createDCAFlow(
  sender,
  amount,
  sourceToken,
  targetToken,
  cadenceInDays
) {
  console.log("Creating the DCA flow");
  const [chainId, signer, sf] = await getSignerAndFramework();

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
      receiver: ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP,
      flowRate: flowRateInWei.toString(),
      superToken: sourceToken,
      userData: userData,
    });
    console.log("created the create flow operation", createFlowOperation);

    const result = await createFlowOperation.exec(signer);
    console.log("stream created!", result);

    return result;
  } catch (error) {
    console.error(error);
  }
}

function estimateRequiredAmount(amount, cadenceInDays) {
  if (amount > 0 && cadenceInDays > 0) {
    const cadenceInHours = cadenceInDays * 24;
    const amountPerHour = amount / cadenceInHours;

    let escrowHours = 4; // TODO: if testnet == 1, else == 4
    const requiredEscrow = amountPerHour * escrowHours;

    return requiredEscrow.toFixed(2);
  } else {
    return 0;
  }
}

function Main({ chainId, account, connectWallet }) {
  const [buyAmount, setBuyAmount] = useState(0);
  const [srcToken] = useState(getSourceTokenOptions(chainId)[0]);
  const [targetToken] = useState(getTargetTokenOptions(chainId)[0]);
  const [buyCadence] = useState(OPTIONS_CADENCE[0]);

  const [requiredAmount, setRequiredAmount] = useState("");
  const [fDaixBalance, setfDaixBalance] = useState(0);

  const renderOptions = (options) => {
    return options.map((opt) => (
      <option key={opt.label} value={opt.value}>
        {opt.label}
      </option>
    ));
  };

  const setupDCAFlow = async () => {
    console.log(
      `setup an agreement to trade ${buyAmount} ${srcToken} for ${targetToken} every ${buyCadence} day(s)`
    );
    // create the superfluid stream, etc
    createDCAFlow(account, buyAmount, srcToken, targetToken, buyCadence).then(
      (r) => {
        console.log("TODO: stuff");
        // TODO:
        // redirect the user somewhere if DCA is set up
        // show an error message if something goes wrong
      }
    );
  };

  useEffect(() => {
    if (account) {
      getErc20Balance(ADDRESSES[chainId].ADDRESS_FDAIX, account).then((v) => {
        setfDaixBalance(v);
      });
    }
  }, [chainId, account]);

  useEffect(() => {
    const req = estimateRequiredAmount(buyAmount, buyCadence.value);
    setRequiredAmount(req);
  }, [buyAmount, buyCadence]);

  return (
    <div>
      {/* logo stuff */}
      <div className="headerWrapper">
        <div>Buy Crypto Assets the Smart Way!</div>
        <div>DCA is the Way.</div>
      </div>

      {/* the dca configuration */}
      <div className="dcaWrapper">
        <span>Buy</span>
        <span>
          <input
            type="number"
            step="10"
            placeholder="10"
            min="0"
            onChange={(e) => {
              if (e.target.value > 0)
                e.target.style.width = e.target.value.length + 1 + "ch";

              setBuyAmount(Math.abs(e.target.value || 0));
            }}
          />
        </span>
        <span>
          <select className="dropdown">
            {renderOptions(getSourceTokenOptions(chainId))}
          </select>
        </span>
        <span>worth of</span>
        <span>
          <select className="dropdown">
            {renderOptions(getTargetTokenOptions(chainId))}
          </select>
        </span>
        <span>every</span>
        <span>
          <select className="dropdown">{renderOptions(OPTIONS_CADENCE)}</select>
        </span>
        <span>.</span>
      </div>

      {/* error / info messages */}
      <div className="alertWrapper">
        {buyAmount > 0 ? (
          buyAmount > requiredAmount ? (
            <div className="alert alert-danger" role="alert">
              <div>
                <span className="emoji">☠️</span>
                <span>
                  You must have at least {requiredAmount} {srcToken.label} to
                  start BTFDCA!
                </span>
              </div>
              <div>
                <a
                  href="https://app.superfluid.finance/dashboard"
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to top-up your wallet.
                </a>
              </div>
            </div>
          ) : (
            <div className="alert alert-secondary" role="alert">
              <span className="emoji">ℹ️</span>
              <span>
                {requiredAmount} {srcToken.label} will be initially reserved for
                the DCA and streamed to us in real-time. Make sure your wallet
                does not run out of {srcToken.label}!
              </span>
            </div>
          )
        ) : (
          <></>
        )}
      </div>

      {/* action buttons */}
      <div className="lfgWrapper">
        {account === "" ? (
          <button
            id="connectWallet"
            type="button"
            className="btn btn-outline-dark"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <button
            id="lfgButton"
            onClick={setupDCAFlow}
            disabled={buyAmount <= 0 || fDaixBalance < buyAmount}
            type="button"
            className="btn btn-outline-success"
          >
            BTFDCA!
          </button>
        )}
      </div>

      <div className="info">
        <div>
          <h5>How does all this work?</h5>
          <p>
            <span>Built using</span>
            <a
              href="https://superfluid.finance/"
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "0.25rem" }}
            >
              Superfluid
            </a>
            <span>
              , which streams your {srcToken.label} to our smart contract.
            </span>
            &nbsp;
            <span>
              Every day, the funds from all investors are pooled together,
              swapped through
            </span>
            <a
              style={{ marginLeft: "0.25rem" }}
              href="https://uniswap.org/"
              target="_blank"
              rel="noreferrer"
            >
              Uniswap
            </a>
            <span>
              , and returned back to the investors through Superfluid again.
            </span>
          </p>
        </div>

        <div>
          <h5>What's {srcToken.label}?</h5>
          <p>
            <span>
              {srcToken.label} is a Superfluid SuperToken (similar to wrapped
              ERC20 tokens). It's what Superfluid uses to receive/send the
              tokens and perform its operations.
            </span>
            <a
              style={{ marginLeft: "0.25rem", marginRight: "0.25rem" }}
              href="/wallet"
            >
              You can upgrade/downgrade (wrap/unwrap) your ERC20 tokens here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Main;
