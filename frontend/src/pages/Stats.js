import { Box, Container, Paper } from "@mui/material";
import Analytics from "../components/main/Analytics";
import { ADDRESSES } from "../config/constants";

export default function Stats({ chainId, account }) {
  return (
    <Box>
      <Analytics chainId={chainId} />

      {/* TODO: this needs to be generalized for multiple contracts */}
      <Container component="section" maxWidth="sm" sx={{ my: 8 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <a
            href={
              "https://console.superfluid.finance/" +
              "mumbai" +
              "/accounts/" +
              ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP
            }
            target="_blank"
            rel="noreferrer"
          >
            Go to the contract's Superfluid console
          </a>

          <p>
            Kinda like etherscan for Superfluid - get the full data on what's
            happening under the hood.
          </p>
        </Paper>
      </Container>
    </Box>
  );
}
