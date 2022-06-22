import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

import Typography from "./mui/Typography";

import { ADDRESSES } from "../config/constants";

const iconStyle = {
  width: 48,
  minHeight: 48,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  mr: 1,
};

function Footer({ chainId }) {
  return (
    <Typography
      component="footer"
      sx={{ display: "flex", bgcolor: "secondary.light" }}
    >
      <Container sx={{ my: 8, display: "flex" }}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              spacing={1}
              sx={{ height: 120 }}
            >
              <Grid item sx={{ display: "flex" }}>
                {/* TODO: twitter account */}
                <Box
                  component="a"
                  href=""
                  sx={iconStyle}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="./twitter.svg"
                    alt="twitter"
                    width="100%"
                    height="100%"
                  />
                </Box>
                {/* TODO: discord group */}
                <Box
                  component="a"
                  href=""
                  sx={iconStyle}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="./discord.png"
                    alt="discord"
                    width="100%"
                    height="100%"
                  />
                </Box>
              </Grid>

              <Grid item>
                <Box component="span" sx={{ fontSize: "12px" }}>
                  Copyright © Since 2022 by BTFDCA
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Legal
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: "none", p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                {/* TODO: implement terms */}
                <Link href="/terms">Terms</Link>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                {/* TODO: implement privacy */}
                <Link href="/privacy">Privacy</Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Don't Trust
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: "none", p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                {/* TODO: get network name from somewhere */}
                <Link
                  href={
                    "https://console.superfluid.finance/" +
                    "mumbai" +
                    "/accounts/" +
                    ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Verify
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Unrelated
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: "none", p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link
                  href="https://banner-nfts.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Mint my NFT!
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}

export default Footer;
