import { Box, Container, Grid, Paper } from "@mui/material";
import Analytics from "../components/main/Analytics";
import { getDcaPoolContracts } from "../config/options";

export default function Stats({ chainId, account }) {
  return (
    <Box>
      <Analytics chainId={chainId} />

      <Container component="section" maxWidth="sm" sx={{ my: 8 }}>
        <Grid container spacing={2}>
          {Object.entries(getDcaPoolContracts(chainId)).map(
            ([pairName, dcaPoolContractAddr]) => {
              return (
                <Grid item>
                  <Paper elevation={4} sx={{ p: 4 }}>
                    <a
                      href={
                        "https://console.superfluid.finance/" +
                        "mumbai" +
                        "/accounts/" +
                        dcaPoolContractAddr
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Go to {pairName} contract's Superfluid console
                    </a>

                    <p>
                      Kinda like etherscan for Superfluid - get the full data on
                      what's happening under the hood.
                    </p>
                  </Paper>
                </Grid>
              );
            }
          )}
        </Grid>
      </Container>

      {/* <Container component="section" maxWidth="sm" sx={{ my: 8 }}>
        {Object.values(getDcaPoolContracts(chainId)).map((dcaPoolContract) => {
          return (
            <Paper elevation={4} sx={{ p: 4 }}>
              <a
                href={
                  "https://console.superfluid.finance/" +
                  "mumbai" +
                  "/accounts/" +
                  dcaPoolContract
                }
                target="_blank"
                rel="noreferrer"
              >
                Go to the contract's Superfluid console
              </a>

              <p>
                Kinda like etherscan for Superfluid - get the full data on
                what's happening under the hood.
              </p>
            </Paper>
          );
        })}
      </Container> */}
    </Box>
  );
}
