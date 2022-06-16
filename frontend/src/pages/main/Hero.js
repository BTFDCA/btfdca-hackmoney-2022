import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import DcaConfig from "../../components/DcaConfig";
import Typography from "../../components/mui/Typography";

const ProductHeroLayoutRoot = styled("section")(({ theme }) => ({
  color: theme.palette.common.white,
  position: "relative",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    height: "100vh",
  },
}));

const Background = styled(Box)({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: -2,
});

function Hero({ chainId, account, connectWallet }) {
  const backgroundImage = "./bg.jpg";

  const sxBackground = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: "#7fc7d9", // Average color of the background image.
    backgroundPosition: "center",
  };

  return (
    <ProductHeroLayoutRoot>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* more bg image */}
        <img
          style={{ display: "none" }}
          src={backgroundImage}
          alt="increase priority"
        />

        {/* real content */}
        <>
          {/* secondary header text */}
          <Typography
            color="#212121"
            align="center"
            variant="h4"
            marked="center"
            sx={{ mt: 1, mb: 1 }}
          >
            <Box bgcolor="#b28704" p="0.25rem" mb="0.5rem">
              Buy Crypto Assets the Smart Way!
            </Box>

            <Box bgcolor="#b28704" p="0.25rem" component="span">
              DCA is the Way.
            </Box>
          </Typography>

          {/* dca component */}
          <DcaConfig
            chainId={chainId}
            account={account}
            connectWallet={connectWallet}
          />
        </>

        {/* overlay */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "common.black",
            opacity: 0.3,
            zIndex: -1,
          }}
        />

        {/* bg image */}
        <Background sx={sxBackground} />
      </Container>
    </ProductHeroLayoutRoot>
  );
}

export default Hero;
