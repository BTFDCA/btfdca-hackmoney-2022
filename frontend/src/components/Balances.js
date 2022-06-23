import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";

import { ADDRESSES } from "../config/constants";
import { getErc20Balance } from "../helpers/balances";
import Typography from "./mui/Typography";

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

function Balances({ chainId, account, sx }) {
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
          <TableRow key={"balance-row-" + i}>
            <TableCell>{bal.unwrappedToken}</TableCell>
            <TableCell>
              {parseFloat(bal.unwrappedTokenBalance).toFixed(2)}
            </TableCell>
            <TableCell>{bal.wrappedToken}</TableCell>
            <TableCell>
              {parseFloat(bal.wrappedTokenBalance).toFixed(2)}
            </TableCell>
          </TableRow>
        );
      }

      return balanceRows;
    } else {
      return (
        <TableRow>
          <TableCell colSpan="4">Loading...</TableCell>
        </TableRow>
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={sx}>
      <Typography variant="h6" sx={{ mb: 4 }}>
        ⚖️ Your Balances
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan="2" align="left">
                Unwrapped Token Balance
              </TableCell>
              <TableCell colSpan="2" align="left">
                Wrapped Token Balance
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>{_renderBalanceRows(balances)}</TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Balances;
