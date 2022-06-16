import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import Button from "../../components/mui/components/Button";
import Typography from "../../components/mui/components/Typography";

export default function KeepInTouch() {
  return (
    <Container component="section" sx={{ mt: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          bgcolor: "warning.main",
          py: 8,
          px: 3,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <Box component="form">
          <Typography variant="h2" component="h2" gutterBottom>
            What's up!
          </Typography>
          <Typography variant="h5">
            Don't miss the juicy gossip, stay in touch with us.
          </Typography>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            sx={{ width: "100%", mt: 3, mb: 2 }}
            href={
              "mailto:contact@btfdca.com?subject=Hey BTFDCA, I like what I'm seeing&body=Let me know when you got news!"
            }
          >
            Keep me updated
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
