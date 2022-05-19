import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Wallet from "./Wallet";
import Main from "./Main";

import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

function App() {
  const [account, setAccount] = useState("");

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

      console.log("[init] connected", accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.log("[init]", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("[init] metamask not found!");
      return;
    }

    console.log("[init] ethereum object found in window", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    console.log("[init] connected to chain id", Number(chain));

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("[init] found an authorized account", account);
      setAccount(account);
    } else {
      console.log("[init] no authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Main account={account} connectWallet={connectWallet} />}
          />
          <Route
            path="/wallet"
            element={<Wallet account={account} connectWallet={connectWallet} />}
          />
        </Routes>
      </BrowserRouter>

      {/* TODO: footer component */}
      <div className="">
        <a href="https://banner-nfts.com">
          Yo, help a brother out. Go mint my NFT!
        </a>
      </div>
    </div>
  );
}

root.render(<App />);
