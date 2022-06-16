import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Typography from "../../components/mui/components/Typography";

const item = {
  display: "flex",
  flexDirection: "column",
};

function Info() {
  // TODO: rewrite
  return (
    <Box
      component="section"
      sx={{
        height: "100vh",
        bgcolor: "secondary.light",
        alignItems: "center",
        p: 5,
      }}
    >
      <Grid container spacing={5} sx={{ my: "auto" }}>
        <Grid item xs={12} md={4} sx={item}>
          <Paper elevation={3} sx={{ p: 5 }}>
            <Typography align="center" variant="h6" sx={{ mb: 2 }}>
              What is DCA and BTFDCA?
            </Typography>

            <Typography>
              <b>Dollar Cost Averaging (DCA)</b> is an investment strategy that
              consists in periodically buying smaller quantities of a target
              asset (instead of a lump sum buy).
            </Typography>

            <Typography sx={{ mt: 0.25 }}>
              By doing smaller buys in periodic intervals, investors smoothly
              navigate through the storms of volatility
            </Typography>

            <Typography sx={{ mt: 4 }}>
              <b>BTFDCA</b> is a service for long-term investors to buy their
              favorite crypto assets with DCA. Just set up a buy order, and
              ensure that your wallet is topped-up - BTFDCA takes care of the
              rest.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} sx={item}>
          <Paper elevation={3} sx={{ p: 5 }}>
            <Typography align="center" variant="h6" sx={{ mb: 2 }}>
              How does all this work?
            </Typography>

            <Typography>
              Specify&nbsp;
              <i>
                <b>how much you want to spend</b>
              </i>
              &nbsp;(amount), the&nbsp;
              <i>
                <b>token you want to spend</b>
              </i>
              &nbsp;(source token), and the&nbsp;
              <i>
                <b>crypto asset you want to buy</b>
              </i>
              &nbsp;(target token).
            </Typography>

            <Typography sx={{ mt: 1 }}>
              Then click&nbsp;
              <i>
                <b>Buy</b>
              </i>
              , pay the&nbsp;
              <i>
                <b>transaction fee</b>
              </i>
              , and that's it!
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Thanks to the underlying tech (Superfluid), we don't immediately
              credit all your moneyz (just an initial deposit), it&nbsp;
              <i>streams</i> over time into BTFDCA. This allows you to manage
              your moneyz however you want,&nbsp;
              <i>
                <b>just make sure the stream does not run out of it</b>
              </i>
              .
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Note1:</b> Because of the streams, we have to wrap the
              source/target tokens into&nbsp;
              <a
                href="https://medium.com/superfluid-blog/superfluid-101-super-tokens-627ec16277ef"
                target="_blank"
                rel="noreferrer"
              >
                "Supertokens"
              </a>
              . Unfortunately that means a few extra clicks 😔.
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Note2:</b> And you can only have 1 active set-up for the same
              source/target token pair.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} sx={item}>
          <Paper elevation={3} sx={{ p: 5 }}>
            <Typography align="center" variant="h6" sx={{ mb: 2 }}>
              Deep Dive
            </Typography>

            <Typography>
              Behind the scenes, we use&nbsp;
              <a
                href="https://medium.com/superfluid-blog/superfluid-streams-5cc5141dd8a7"
                target="_blank"
                rel="noreferrer"
              >
                Superfluid streams
              </a>
              &nbsp;to move the moneyz around - out your wallet and into
              BTFDCA's asset pools (AKA smart contracts), and vice versa. This
              is done automatically by the Superfluid protocol.
            </Typography>

            <Typography sx={{ mt: 1 }}>
              Periodically, the smart contract is invoked to buy the target
              asset of the pool, and then distributes the tokens back to all the
              investors in their contributed proportion.
            </Typography>

            <Typography sx={{ mt: 1 }}>
              I'm sure you got more questions, so check out the&nbsp;{" "}
              <a href="/faq">FAQ</a>.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* TODO: link to video tutorial */}
      {/* <Box sx={{ my: 5 }}>
        <Card variant="outlined">
          <CardMedia
            component="iframe"
            image="https://www.youtube.com/embed/muuK4SpRR5M"
          />
        </Card>
      </Box> */}
    </Box>
  );
}

export default Info;
