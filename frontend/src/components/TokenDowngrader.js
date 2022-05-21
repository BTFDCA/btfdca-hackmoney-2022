import { ethers } from "ethers";
import { useState } from "react";

import { getWrapTokensOptions } from "../config/options";
import { getSignerAndFramework } from "../helpers/sf";

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
          downgradeToken(
            getWrapTokensOptions(chainId)[selectedOptionIdx],
            amount
          )
        }
      >
        downgrade
      </button>
    </div>
  );
}

export default TokenDowngrader;
