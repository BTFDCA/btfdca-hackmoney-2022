import Box from "@mui/material/Box";
import Typography from "../../components/mui/Typography";
import ContractBalances from "../../components/ContractBalances";
import ContractHistoricalBalances from "../../components/ContractHistoricalBalances";
import { getDcaPoolContracts } from "../../config/options";

export default function Analytics({ chainId }) {
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

      {Object.entries(getDcaPoolContracts(chainId)).map(
        ([pairName, dcaPoolContractAddr]) => {
          console.log(
            "[analytics] pair name / contract addr",
            pairName,
            dcaPoolContractAddr
          );

          return (
            <Box key={dcaPoolContractAddr}>
              <Box sx={{ mt: 5, mb: 2.5 }}>
                <ContractBalances
                  chainId={chainId}
                  pairName={pairName}
                  contractAddr={dcaPoolContractAddr}
                />
              </Box>

              <Box sx={{ mt: 5, mb: 2.5 }}>
                <ContractHistoricalBalances
                  chainId={chainId}
                  pairName={pairName}
                  contractAddr={dcaPoolContractAddr}
                />
              </Box>
            </Box>
          );
        }
      )}

      {/* TODO: links to superfluid dashboard and console */}
    </Box>
  );
}
