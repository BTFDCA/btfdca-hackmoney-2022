import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import AppBar from "./mui/AppBar";
import Toolbar from "./mui/Toolbar";
import Typography from "./mui/Typography";

import { useEffect, useState } from "react";
import { ADDRESSES } from "../config/constants";
import { getErc20Balance } from "../helpers/balances";
import { Avatar } from "@mui/material";

const headerText = {
  fontSize: 15,
  color: "common.white",
  ml: 3,
};

function Header({ chainId, account }) {
  const [fDaixBalance, setfDaixBalance] = useState("");

  useEffect(() => {
    if (account) {
      console.log(
        "fetching erc 20 balance",
        ADDRESSES[chainId].ADDRESS_FDAIX,
        account
      );
      getErc20Balance(ADDRESSES[chainId].ADDRESS_FDAIX, account).then((v) => {
        setfDaixBalance(v);
      });
    }
  }, [chainId, account]);

  return (
    <header>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }}>
            {/* logo */}
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              href="/"
              sx={headerText}
            >
              <Avatar
                src="./logo192.png"
                alt="logo"
                variant="square"
                sx={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  width: "3rem",
                  minHeight: "3rem",
                }}
              />
            </Link>

            {/* main */}
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              href="/"
              sx={headerText}
            >
              🏠&nbsp;Main
            </Link>

            {/* analytics */}
            <Link variant="h6" underline="none" href="/stats" sx={headerText}>
              🧮&nbsp;Analytics
            </Link>

            {/* wallet */}
            <Link variant="h6" underline="none" href="/wallet" sx={headerText}>
              👛&nbsp;Wallet
            </Link>
          </Box>
          <Typography
            variant="h6"
            gutterBottom
            component="span"
            sx={{ fontSize: 30, color: "#fefefe" }}
          >
            #BTFDCA
          </Typography>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            {account ? (
              <>
                {/* account */}
                <Typography
                  variant="h6"
                  gutterBottom
                  component="span"
                  sx={headerText}
                >
                  {"Connected as " +
                    account.substring(0, 5) +
                    "..." +
                    account.substring(account.length - 5, account.length)}
                </Typography>

                {/* separator */}
                <Typography
                  variant="h6"
                  gutterBottom
                  component="span"
                  sx={headerText}
                >
                  ·
                </Typography>

                {/* balance */}
                <Typography
                  variant="h6"
                  gutterBottom
                  component="span"
                  sx={headerText}
                >
                  fDAIx Balance: {fDaixBalance}
                </Typography>
              </>
            ) : (
              <Typography
                variant="h6"
                gutterBottom
                component="span"
                sx={headerText}
              >
                🔌&nbsp;Not connected
                {/* TODO: click to connect */}
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </header>
  );
}

export default Header;
