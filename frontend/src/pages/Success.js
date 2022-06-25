import { Box, Container, Divider } from "@mui/material";
import { useEffect, useState } from "react";

import Typography from "../components/mui/Typography";

// import {
//   ADDRESSES,
//   SF_DISTRIBUTION_SUBSCRIPTION_IDX,
// } from "../config/constants";
// import { getSignerAndFramework } from "../helpers/sf";

// async function getClaimDetails(account, targetToken) {
//   console.log(
//     "[success] retrieving details of the IDA subscription",
//     account,
//     targetToken
//   );
//   const [chainId, signer, sf] = await getSignerAndFramework();

//   try {
//     console.log("[success] getting the subscription", ADDRESSES[chainId]);
//     const subscription = await sf.idaV1.getSubscription({
//       publisher: ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP, // TODO: parametrize
//       indexId: SF_DISTRIBUTION_SUBSCRIPTION_IDX,
//       superToken: targetToken,
//       subscriber: account,
//       providerOrSigner: signer,
//     });

//     console.log("[success] fetched the subscription!", subscription);
//     return subscription;
//   } catch (error) {
//     console.error(error);
//   }
// }

function Success({ chainId, account, connectWallet }) {
  const [claimStatus, setClaimStatus] = useState(true);

  // useEffect(() => {
  //   console.log("[success] account", account);
  //   if (account) {
  //     getClaimDetails(account, ADDRESSES[chainId].ADDRESS_ETHGX).then(
  //       (subscription) => {
  //         console.log("[success] subscription in use effect", subscription);
  //         setClaimStatus(true);
  //       }
  //     );
  //   }
  // }, [account, chainId]);

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        alignItems: "center",
        py: 8,
      }}
    >
      <Container>
        {claimStatus == null ? (
          <>...</>
        ) : claimStatus === true ? (
          <>
            <Typography variant="h6">
              Congrats fren 🫂, you've BTFDCA! 🎆🥳
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Every <code>gm!</code> you will receive your cryptoassets.
            </Typography>

            <Typography sx={{ mt: 4 }}>That's all! </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6">
              Are you sure you're in the right place?
            </Typography>

            <p>We can't seem to find any stream created.</p>

            <p>
              <a href="/">Are you sure you've BTFDCA?</a>
            </p>

            <p>
              If you think something's wrong here, please reach out to us (and
              check the Superfluid dashboard 👇🏻 for more details).
            </p>
          </>
        )}
      </Container>

      <Container sx={{ my: 8 }}>
        <Divider />
      </Container>

      {/* link to superfluid's dashboard and console */}
      <Container>
        {/* TODO: get network name from somewhere */}
        <Typography variant="h6">
          🖥️ Wanna verify that things are working? Check Superfluid
        </Typography>

        <Box sx={{ mt: 2 }}>
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
        </Box>

        <Box sx={{ mt: 4 }}>
          <a
            href={
              "https://console.superfluid.finance/" +
              "mumbai" +
              "/accounts/" +
              account
            }
            target="_blank"
            rel="noreferrer"
          >
            Go to your Superfluid console
          </a>
          <p>
            Kinda like etherscan for Superfluid - get the full data on what's
            happening under the hood.
          </p>
        </Box>
      </Container>
    </Box>
  );
}

export default Success;
