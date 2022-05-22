import { ethers } from "ethers";
import { useState } from "react";

import { erc20abi } from "../abis/erc20";
import { supertokenAbi } from "../abis/supertoken";
import { ADDRESSES } from "../config/constants";
import { getSignerAndFramework } from "../helpers/sf";

const getWrapTokensOptions = (chainId) => {
  return [
    {
      label: "FDAI",
      value: 0,
      address: ADDRESSES[chainId].ADDRESS_FDAI,
      upgradeTo: ADDRESSES[chainId].ADDRESS_FDAIX,
    },
    // {
    //   label: "ETHG",
    //   value: 2,
    //   address: ADDRESSES[chainId].ADDRESS_ETHG,
    // },
  ];
};

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

  const [, signer, sf] = await getSignerAndFramework();

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
      console.log("loaded the supertoken");

      console.log("calling upgrade");
      const upgradeOperation = supertoken.upgrade({
        amount: ethers.utils.parseEther(amount.toString()),
      });
      console.log("executing the upgrade");
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
  const [selectedOptionIdx] = useState(getWrapTokensOptions(chainId)[0].value);

  return (
    <div className="tokenUpgrader">
      <h5>🔼 Upgrade ERC20 to SuperToken</h5>
      <div className="input-group mt-5 mb-4">
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          // onClick={(e) => setSelectedOptionIdx(e.target.value)}
        >
          {getWrapTokensOptions(chainId)[0].label}
        </button>
        <ul className="dropdown-menu"></ul>

        {/* TODO: negative values, etc */}
        <input
          className="form-control"
          aria-label="Text input with dropdown button"
          type="number"
          min="0"
          step="10"
          placeholder="How much to upgrade?"
          onChange={(e) => setAmount(e.target.value)}
        />
        {/* TODO: max button with fdai balance */}
      </div>

      {/* TODO: if not approved, etc */}
      {/* TODO: disable if balance == 0 */}
      <div className="hstack gap-3">
        <button
          type="button"
          className="btn btn-outline-primary  ms-auto"
          aria-current="page"
          onClick={async () =>
            approveUpgrade(
              getWrapTokensOptions(chainId)[selectedOptionIdx],
              amount
            )
          }
        >
          Approve
        </button>

        <div className="vr"></div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={async () =>
            upgradeToken(
              getWrapTokensOptions(chainId)[selectedOptionIdx],
              amount
            )
          }
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

export default TokenUpgrader;
