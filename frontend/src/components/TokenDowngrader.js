import { ethers } from "ethers";
import { useState } from "react";
import { ADDRESSES } from "../config/constants";

import { getSignerAndFramework } from "../helpers/sf";

const getWrapTokensOptions = (chainId) => {
  return [
    {
      label: "FDAIx",
      value: 1,
      downgradeFrom: ADDRESSES[chainId].ADDRESS_FDAIX,
    },
    // {
    //   label: "ETHGx",
    //   value: 3,
    //   address: ADDRESSES[chainId].ADDRESS_ETHGX,
    // },
  ];
};

async function downgradeToken(token, amount) {
  console.log("downgrade", amount, "of", token);
  if (!("downgradeFrom" in token)) {
    console.log("selected token is not downgradable");
    return;
  }

  const [, signer, sf] = await getSignerAndFramework();

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

function TokenDowngrader({ chainId }) {
  const [amount, setAmount] = useState(0);
  // const [selectedOptionIdx] = useState(getWrapTokensOptions(chainId)[0].value);

  return (
    <div className="tokenDowngrader">
      <h5>🔽 Downgrade SuperToken to ERC20</h5>

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
          placeholder="How much to downgrade?"
          onChange={(e) => setAmount(e.target.value)}
        />
        {/* TODO: max button with fdai balance */}
      </div>

      {/* TODO: disable if balance == 0 */}
      <div className="hstack">
        <button
          type="button"
          className="btn btn-outline-primary  ms-auto"
          aria-current="page"
          onClick={async () =>
            downgradeToken(getWrapTokensOptions(chainId)[0], amount)
          }
        >
          Downgrade
        </button>
      </div>
    </div>
  );
}

export default TokenDowngrader;
