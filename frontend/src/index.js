import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Wallet from "./pages/Wallet";
import Main from "./pages/Main";

import "./styles/index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Success from "./pages/Success";

const container = document.getElementById("root");
const root = createRoot(container);

function App() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(80001);

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
      const chainId = Number(await ethereum.request({ method: "eth_chainId" }));

      console.log("[init] connected", accounts[0]);
      setAccount(accounts[0]);
      setChainId(chainId);
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
    const chainId = Number(await ethereum.request({ method: "eth_chainId" }));
    console.log("[init] connected to chain id", chainId);

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("[init] found an authorized account", account, chainId);
      setAccount(account);
      setChainId(chainId);
    } else {
      console.log("[init] no authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div>
      <Header chainId={chainId} account={account} />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  chainId={chainId}
                  account={account}
                  connectWallet={connectWallet}
                />
              }
            />
            <Route
              path="/wallet"
              element={
                <Wallet
                  chainId={chainId}
                  account={account}
                  connectWallet={connectWallet}
                />
              }
            />
            <Route
              path="/success"
              element={
                <Success
                  chainId={chainId}
                  account={account}
                  connectWallet={connectWallet}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>

      <Footer chainId={chainId} />
    </div>
  );
}

root.render(<App />);
