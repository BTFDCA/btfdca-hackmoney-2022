import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { supertokenAbi } from "./abis/supertoken";
import { erc20abi } from "./abis/erc20";
import {
  OPTIONS_SOURCE_TOKEN,
  OPTIONS_TARGET_TOKEN,
  OPTIONS_TOKEN_WRAPS,
} from "./configs";
import { ADDRESSES, SF_DISTRIBUTION_SUBSCRIPTION_IDX } from "./constants";

import "./Wallet.css";

async function _getSignerAndFramework() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
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
  console.log("[wallet] got the sf object");

  return [signer, sf];
}

async function getFlow(sender, token) {
  console.log("[wallet] getting flow details for", sender, "and", token);
  const [signer, sf] = await _getSignerAndFramework();

  // start streaming the tokens from the user to the dca superapp contract
  try {
    const flow = await sf.cfaV1.getFlow({
      superToken: token,
      sender: sender,
      receiver: ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP,
      providerOrSigner: signer,
    });
    console.log("[wallet] flow", flow);
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
  const [signer, sf] = await _getSignerAndFramework();

  try {
    console.log("getting the subscription");
    const subscription = await sf.idaV1.getSubscription({
      publisher: ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP,
      indexId: 0, // TODO: change
      superToken: targetToken,
      subscriber: sender,
      providerOrSigner: signer,
    });

    console.log("fetched the subscription!", subscription);
  } catch (error) {
    console.error(error);
  }
}

async function claim(sender, targetToken) {
  console.log("claiming rewards!");
  const [signer, sf] = await _getSignerAndFramework();

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

async function approveSubscription(token) {
  console.log("approving subscription to", token);
  const [, sf] = await _getSignerAndFramework();

  try {
    const result = await sf.idaV1.approveSubscription({
      indexId: SF_DISTRIBUTION_SUBSCRIPTION_IDX,
      superToken: token,
      publisher: ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP,
    });
    console.log("subscription approved", result);
  } catch (error) {
    console.error(error);
  }
}

// ----------------------------------------------------------------

async function getNativeBalance(walletAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const balance = await provider.getBalance(walletAddress);

  return ethers.utils.formatEther(balance);
}

async function getErc20Balance(tokenAddress, walletAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const erc20abi = [
    "function balanceOf(address account) external view returns(uint256 balance)",
  ];
  const erc20 = new ethers.Contract(tokenAddress, erc20abi, provider);
  const balance = await erc20.balanceOf(walletAddress);

  return ethers.utils.formatEther(balance);
}

async function upgradeToken(token, amount) {
  console.log("upgrade", amount, "of", token);
  if (!("upgradeTo" in token)) {
    console.log("selected token is not upgradable");
    return;
  }

  const [signer, sf] = await _getSignerAndFramework();

  try {
    if (token.isNative) {
      console.log("native upgrade");
      const supertoken = new ethers.Contract(token.upgradeTo, supertokenAbi);
      const receipt = await supertoken.connect(signer).upgradeByETH({
        value: ethers.utils.parseEther(amount.toString()),
      });
      await receipt.wait().then(function (tx) {
        console.log("upgraded native token");
      });
    } else {
      console.log("erc20 upgrade");
      const supertoken = await sf.loadSuperToken(token.upgradeTo);
      const upgradeOperation = supertoken.upgrade({
        amount: ethers.utils.parseEther(amount.toString()),
      });
      const upgradeTxn = await upgradeOperation.exec(signer);
      await upgradeTxn.wait().then(function (tx) {
        console.log("upgraded erc20");
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function downgradeToken(token, amount) {
  console.log("downgrade", amount, "of", token);
  if (!("downgradeFrom" in token)) {
    console.log("selected token is not downgradable");
    return;
  }

  const [signer, sf] = await _getSignerAndFramework();

  try {
    const supertoken = await sf.loadSuperToken(token.downgradeFrom);
    const downgradeOperation = supertoken.downgrade({
      amount: ethers.utils.parseEther(amount.toString()),
    });
    const downgradeTxn = await downgradeOperation.exec(signer);
    await downgradeTxn.wait().then(function (tx) {
      console.log("downgraded to erc20");
    });
  } catch (error) {
    console.error(error);
  }
}

async function approveUpgrade(token, amount) {
  console.log("approving upgrade", amount, "of", token);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const erc20 = new ethers.Contract(token.address, erc20abi, signer);
  console.log("got erc20 contract", erc20);

  try {
    console.log("approving");
    await erc20
      .approve(token.upgradeTo, ethers.utils.parseEther(amount.toString()))
      .then(function (tx) {
        console.log("approved spend", tx);
      });
  } catch (error) {
    console.error(error);
  }
}

async function fetchBalances(account, onFetchComplete) {
  const balances = [
    {
      unwrappedTokenAddress: "",
      unwrappedToken: "MATIC",
      unwrappedTokenBalance: await getNativeBalance(account),
      wrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_MATICX,
      wrappedToken: "MATICx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES.MUMBAI.ADDRESS_MATICX,
        account
      ),
    },
    {
      unwrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_WETH,
      unwrappedToken: "WETH",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES.MUMBAI.ADDRESS_WETH,
        account
      ),
      wrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_MATICX,
      wrappedToken: "WETHx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES.MUMBAI.ADDRESS_WETHX,
        account
      ),
    },
    // {
    //   unwrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_WBTC,
    //   unwrappedToken: "WBTC",
    //   unwrappedTokenBalance: await getErc20Balance(
    //     ADDRESSES.MUMBAI.ADDRESS_WBTC,
    //     account
    //   ),
    //   wrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_WBTCX,
    //   wrappedToken: "WBTCx",
    //   wrappedTokenBalance: await getErc20Balance(
    //     ADDRESSES.MUMBAI.ADDRESS_WBTCX,
    //     account
    //   ),
    // },
    {
      unwrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_FDAI,
      unwrappedToken: "FDAI",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES.MUMBAI.ADDRESS_FDAI,
        account
      ),
      wrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_MATICX,
      wrappedToken: "FDAIx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES.MUMBAI.ADDRESS_FDAIX,
        account
      ),
    },
    {
      unwrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_FUSDC,
      unwrappedToken: "FUSDC",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES.MUMBAI.ADDRESS_FUSDC,
        account
      ),
      wrappedTokenAddress: ADDRESSES.MUMBAI.ADDRESS_MATICX,
      wrappedToken: "FUSDCx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES.MUMBAI.ADDRESS_FUSDCX,
        account
      ),
    },
  ];

  onFetchComplete(balances);
}

function BalancesList({ balances }) {
  const _renderBalanceRows = (bals) => {
    let balanceRows = [];

    for (let i = 0; i < bals.length; i++) {
      const bal = bals[i];

      balanceRows.push(
        <div key={"balance-row-" + i} className="balanceRow">
          <span>{bal.unwrappedToken}</span>
          <span>{bal.unwrappedTokenBalance}</span>
          <span>{bal.wrappedToken}</span>
          <span>{bal.wrappedTokenBalance}</span>
        </div>
      );
    }

    return balanceRows;
  };

  return (
    <div>
      <div>Balances</div>
      <div>
        <div className="balanceRowTitle">
          <span>Unwrapped</span>
          <span>Balance</span>
          <span>Wrapped</span>
          <span>Balance</span>
        </div>
        {_renderBalanceRows(balances)}
      </div>
    </div>
  );
}

function TokenUpDownGrader() {
  const [amount, setAmount] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(
    OPTIONS_TOKEN_WRAPS[0].value
  );

  const renderOptions = (options) => {
    return options.map((opt) => (
      <option key={opt.label} value={opt.value}>
        {opt.label}
      </option>
    ));
  };

  return (
    <div style={{ margin: "5rem 0" }}>
      <select onChange={(e) => setSelectedOptionIdx(e.target.value)}>
        {renderOptions(OPTIONS_TOKEN_WRAPS)}
      </select>
      <input type="number" onChange={(e) => setAmount(e.target.value)} />
      <button
        onClick={async () =>
          approveUpgrade(OPTIONS_TOKEN_WRAPS[selectedOptionIdx], amount)
        }
      >
        approve upgrade
      </button>
      <button
        onClick={async () =>
          upgradeToken(OPTIONS_TOKEN_WRAPS[selectedOptionIdx], amount)
        }
      >
        upgrade
      </button>
      <button
        onClick={async () =>
          downgradeToken(OPTIONS_TOKEN_WRAPS[selectedOptionIdx], amount)
        }
      >
        downgrade
      </button>
    </div>
  );
}

function Wallet({ account, connectWallet }) {
  const [srcToken] = useState(OPTIONS_SOURCE_TOKEN[0].value);
  const [targetToken] = useState(OPTIONS_TARGET_TOKEN[0].value);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (account) fetchBalances(account, setBalances);
  }, [account]);

  return (
    <div>
      <div style={{ margin: "2.5rem 0rem 5rem" }}>
        <a href="/">Go Back!</a>
      </div>

      {/* link to superfluid's console */}
      <div style={{ margin: "5rem 0" }}>
        {/* TODO: get network name from somewhere */}
        <a
          href={
            "https://console.superfluid.finance/" +
            "mumbai" +
            "/accounts/" +
            account
          }
          target="_blank"
          rel="noreferrer"
        >
          Go to your superfluid console
        </a>
      </div>

      <BalancesList balances={balances} />

      <TokenUpDownGrader />

      {/* CFA */}
      {/* <div style={{ margin: "5rem 0" }}>
        <button
          style={{ marginRight: "1rem" }}
          onClick={async () => {
            getFlow(account, srcToken);
          }}
        >
          get flow
        </button>
      </div> */}

      {/* IDA */}
      {/* <div style={{ margin: "5rem 0" }}>
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
        <button
          style={{ marginLeft: "1rem" }}
          onClick={async () => {
            approveSubscription(account, targetToken);
          }}
        >
          approve subscription to weth!
        </button>
      </div> */}

      {/* contract's superfluid dashboard */}
      <div style={{ margin: "5rem 0" }}>
        {/* TODO: get network name from somewhere */}
        <a
          href={
            "https://console.superfluid.finance/" +
            "mumbai" +
            "/accounts/" +
            ADDRESSES.MUMBAI.ADDRESS_DCA_SUPERAPP
          }
          target="_blank"
          rel="noreferrer"
        >
          Go to the contract's superfluid console
        </a>
      </div>
    </div>
  );
}

export default Wallet;
