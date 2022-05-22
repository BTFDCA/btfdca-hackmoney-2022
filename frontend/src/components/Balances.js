import { useEffect, useState } from "react";

import { ADDRESSES } from "../config/constants";
import { getErc20Balance } from "../helpers/balances";

async function fetchBalances(chainId, account, onFetchComplete) {
  // TODO: this should be more dynamic, by creating the structure based on getSource/TargetTokens
  const balances = [
    {
      unwrappedTokenAddress: ADDRESSES[chainId].ADDRESS_FDAI,
      unwrappedToken: "FDAI",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_FDAI,
        account
      ),
      wrappedTokenAddress: ADDRESSES[chainId].ADDRESS_FDAIX,
      wrappedToken: "FDAIx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_FDAIX,
        account
      ),
    },
    // {
    //   unwrappedTokenAddress: ADDRESSES[chainId].ADDRESS_ETHG,
    //   unwrappedToken: "ETHG",
    //   unwrappedTokenBalance: await getErc20Balance(
    //     ADDRESSES[chainId].ADDRESS_ETHG,
    //     account
    //   ),
    //   wrappedTokenAddress: ADDRESSES[chainId].ADDRESS_ETHGX,
    //   wrappedToken: "ETHGx",
    //   wrappedTokenBalance: await getErc20Balance(
    //     ADDRESSES[chainId].ADDRESS_ETHGX,
    //     account
    //   ),
    // },
    {
      unwrappedTokenAddress: ADDRESSES[chainId].ADDRESS_ETHGX,
      unwrappedToken: "ETHGx",
      unwrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_ETHGX,
        account
      ),
      wrappedTokenAddress: ADDRESSES[chainId].ADDRESS_ETHGX,
      wrappedToken: "ETHGx",
      wrappedTokenBalance: await getErc20Balance(
        ADDRESSES[chainId].ADDRESS_ETHGX,
        account
      ),
    },
  ];

  onFetchComplete(balances);
}

function Balances({ chainId, account }) {
  const [balances, setBalances] = useState();

  useEffect(() => {
    if (account) fetchBalances(chainId, account, setBalances);
  }, [chainId, account]);

  const _renderBalanceRows = (bals) => {
    if (balances) {
      let balanceRows = [];
      for (let i = 0; i < bals.length; i++) {
        const bal = bals[i];

        balanceRows.push(
          <tr key={"balance-row-" + i}>
            <td>{bal.unwrappedToken}</td>
            <td>{bal.unwrappedTokenBalance}</td>
            <td>{bal.wrappedToken}</td>
            <td>{bal.wrappedTokenBalance}</td>
          </tr>
        );
      }

      return balanceRows;
    } else {
      return (
        <tr>
          <td colSpan="4">Loading...</td>
        </tr>
      );
    }
  };

  return (
    <div className="balances">
      <h4 className="balancesTitle">Your Balances</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Unwrapped</th>
            <th>Balance</th>
            <th>Wrapped</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>{_renderBalanceRows(balances)}</tbody>
      </table>
    </div>
  );
}

export default Balances;
