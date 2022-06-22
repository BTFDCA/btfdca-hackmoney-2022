import Box from "@mui/material/Box";

import { useEffect, useState } from "react";
import { getContractCurrentBalances } from "../../helpers/covalent";

import Typography from "../../components/mui/Typography";
import ContractBalances from "../../components/ContractBalances";
import ContractHistoricalBalances from "../../components/ContractHistoricalBalances";

export default function Analytics({ chainId }) {
  const [balances, setBalances] = useState();

  useEffect(() => {
    getContractCurrentBalances(chainId, setBalances);
  }, [chainId, setBalances]);

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        bgcolor: "#7fc7d9", // Average color of the background image.
        alignItems: "center",
        p: 5,
      }}
    >
      <Typography
        color="#212121"
        align="center"
        variant="h4"
        marked="center"
        sx={{ mt: 1, mb: 1 }}
      >
        BTFDCAlytics
      </Typography>
      <Typography align="center">powered by Covalent</Typography>

      {balances ? (
        <>
          <Box sx={{ mt: 5, mb: 2.5 }}>
            <Typography variant="h6" align="center" sx={{ mb: 4 }}>
              Contract Balances
            </Typography>
            <ContractBalances balances={balances} />
          </Box>

          <Box sx={{ mt: 5, mb: 2.5 }}>
            <Typography variant="h6" align="center">
              Timeline of Contract Balances
            </Typography>
            <ContractHistoricalBalances chainId={chainId} />
          </Box>
        </>
      ) : (
        <></>
      )}

      {/* TODO: links to superfluid dashboard and console */}
    </Box>
  );
}
