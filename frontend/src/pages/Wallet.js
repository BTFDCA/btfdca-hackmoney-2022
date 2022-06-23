import Box from "@mui/material/Box";
import Balances from "../components/Balances";
import TokenDowngrader from "../components/TokenDowngrader";
import TokenUpgrader from "../components/TokenUpgrader";
import SubscriptionApprover from "../components/SubscriptionApprover";
import { Container, Divider, Grid } from "@mui/material";
import Typography from "../components/mui/Typography";

function Wallet({ chainId, account, connectWallet }) {
  return (
    <Box>
      {/* TODO: only show if not approved */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography variant="h6">
          ☑️ In order to get your moneyz, you have to approve the distribution
          👇🏻.
        </Typography>
        {/* TODO: explain why */}
        <SubscriptionApprover chainId={chainId} />

        <Divider sx={{ my: 8 }} />
      </Container>

      <Balances chainId={chainId} account={account} sx={{ my: 8 }} />

      <Container>
        <Divider />
      </Container>

      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          🌯 Wrap / Unwrap your tokens
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TokenUpgrader chainId={chainId} />
          </Grid>

          <Grid item xs={6}>
            <TokenDowngrader chainId={chainId} />
          </Grid>
        </Grid>
      </Container>

      <Container>
        <Divider />
      </Container>

      {/* link to superfluid's dashboard and console */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        {/* TODO: get network name from somewhere */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          🖥️ Do more things in Superfluid
        </Typography>

        <div>
          <a
            href="https://app.superfluid.finance/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            Do Advanced DeFi magic inside your Superfluid Dashboard.
          </a>
          <p>
            Full management of your BTFDCA operations. Your can approve
            distributions, cancel the streams, check your activity, wrap/unwrap
            tokens, transfer and receive tokens, and much more.
          </p>
        </div>
      </Container>
    </Box>
  );
}

export default Wallet;
