import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getContractCurrentBalances } from "../helpers/covalent";
import Typography from "./mui/Typography";

export default function ContractBalances({ chainId, pairName, contractAddr }) {
  const [balances, setBalances] = useState();

  useEffect(() => {
    getContractCurrentBalances(chainId, contractAddr, setBalances);
  }, [chainId, contractAddr, setBalances]);

  return (
    <Box>
      {balances ? (
        <>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Contract Balances ({pairName})
          </Typography>

          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Token Name</TableCell>
                  <TableCell align="right">Ticker</TableCell>
                  <TableCell align="right">Current Balance</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {balances.map((balance) => (
                  <TableRow
                    key={balance["address"]}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{balance["name"]}</TableCell>
                    {/* format with link to scan+balance["address"] */}
                    <TableCell align="right">{balance["ticker"]}</TableCell>
                    <TableCell align="right">
                      {parseFloat(
                        formatEther(BigNumber.from(balance["balance"]))
                      ).toFixed(4)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
