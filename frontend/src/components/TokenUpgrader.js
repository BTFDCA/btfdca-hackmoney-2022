import { ethers } from "ethers";
import { useState } from "react";

import { erc20abi } from "../abis/erc20";
import { supertokenAbi } from "../abis/supertoken";
import { getWrapTokensOptions } from "../config/options";
import { getSignerAndFramework } from "../helpers/sf";

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

async function upgradeToken(token, amount) {
  console.log("upgrade", amount, "of", token);
  if (!("upgradeTo" in token)) {
    console.log("selected token is not upgradable");
    return;
  }

  const [_, signer, sf] = await getSignerAndFramework();

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

function TokenUpgrader({ chainId }) {
  const [amount, setAmount] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(
    getWrapTokensOptions(chainId)[0].value
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
        {renderOptions(getWrapTokensOptions(chainId))}
      </select>
      <input type="number" onChange={(e) => setAmount(e.target.value)} />
      <button
        onClick={async () =>
          approveUpgrade(
            getWrapTokensOptions(chainId)[selectedOptionIdx],
            amount
          )
        }
      >
        approve upgrade
      </button>
      <button
        onClick={async () =>
          upgradeToken(getWrapTokensOptions(chainId)[selectedOptionIdx], amount)
        }
      >
        upgrade
      </button>
    </div>
  );
}

export default TokenUpgrader;
