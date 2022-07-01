import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Main from "./pages/Main";
import Wallet from "./pages/Wallet";
import Success from "./pages/Success";

import Header from "./components/Header";
import Footer from "./components/Footer";

import theme from "./styles/theme";
import "./styles/index.css";
import Stats from "./pages/Stats";
import { Box } from "@mui/material";
import Typography from "./components/mui/Typography";

const container = document.getElementById("root");
const root = createRoot(container);

function App() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState();

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
    } else {
      console.log("[init] no authorized account found");
    }
    setChainId(chainId);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Header chainId={chainId} account={account} />

      <div>
        {chainId === 80001 ? (
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
                path="/stats"
                element={<Stats chainId={chainId} account={account} />}
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
        ) : (
          <Box
            component="section"
            sx={{
              minHeight: "100vh",
              bgcolor: "#7fc7d9", // Average color of the background image.
              alignItems: "center",
              margin: "auto",
              textAlign: "center",
              p: 5,
            }}
          >
            <Typography variant="h2">
              Please connect to Polygon mumbai
            </Typography>
          </Box>
        )}
      </div>

      <Footer chainId={chainId} />
    </ThemeProvider>
  );
}

root.render(<App />);
