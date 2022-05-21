import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { ADDRESSES } from "../config/constants";

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

function BalancesList({ chainId, account }) {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (account) fetchBalances(chainId, account, setBalances);
  }, [chainId, account]);

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

export default BalancesList;