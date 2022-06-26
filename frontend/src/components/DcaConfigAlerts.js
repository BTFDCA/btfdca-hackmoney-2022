import { Alert, AlertTitle } from "@mui/material";

const alertStyle = {
  mt: 1,
  mb: 1,
  maxWidth: 500,
};

function DcaConfigAlerts({
  buyAmount,
  requiredAmount,
  stablexBalance,
  srcToken,
  dcaError,
}) {
  return (
    <>
      {/* unexpected error */}
      {dcaError ? (
        <Alert variant="filled" severity="error" sx={alertStyle}>
          <AlertTitle>Something's wrong and we couldn't BTFDCA 😭</AlertTitle>
          <div>
            <a
              href="https://app.superfluid.finance/dashboard"
              target="_blank"
              rel="noreferrer"
            >
              Make sure everything is good with your wallet.
            </a>

            <div>
              Note: you cannot have more than 1 active BTFDCA for the same
              source/target token pair.
            </div>
          </div>
        </Alert>
      ) : srcToken && buyAmount > 0 ? (
        // not enough balance
        requiredAmount > stablexBalance ? (
          <Alert variant="filled" severity="error" sx={alertStyle}>
            <AlertTitle>You don't have enough moneyz.</AlertTitle>
            <div>
              You need at least {requiredAmount} {srcToken.label} to BTFDCA!
              <span className="emoji">☠️</span>
            </div>
            <div>
              <a
                href="https://app.superfluid.finance/dashboard"
                target="_blank"
                rel="noreferrer"
              >
                Click here to top-up your wallet.
              </a>
            </div>
          </Alert>
        ) : (
          // info alert
          <Alert variant="filled" severity="info" sx={alertStyle}>
            <div>
              {requiredAmount} {srcToken.label} will be retained for DCA.
            </div>
            <div>Don't let your wallet run out of {srcToken.label}!</div>
            <a href="/#info" target="_blank">
              Click here to learn about how BTFDCA works.
            </a>
          </Alert>
        )
      ) : (
        <></>
      )}
    </>
  );
}

export default DcaConfigAlerts;
