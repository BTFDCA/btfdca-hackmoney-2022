import Container from "@mui/material/Container";

import Button from "../../components/mui/Button";
import Typography from "../../components/mui/Typography";

export default function Contact() {
  return (
    <Container
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 9,
      }}
    >
      <Typography variant="h4" sx={{ my: 3 }}>
        Got any questions or comments?
      </Typography>

      <Button
        color="secondary"
        sx={{
          border: "3px solid currentColor",
          borderRadius: 0,
          height: "auto",
          py: 2,
          px: 5,
        }}
        href={
          "mailto:contact@btfdca.com?subject=yo BTFDCA&body=<replace this with your message>"
        }
      >
        <Typography variant="h5" component="span">
          Reach out to us!
        </Typography>
      </Button>

      <Typography variant="subtitle1" sx={{ my: 3 }}>
        We're here for you.
      </Typography>
    </Container>
  );
}
