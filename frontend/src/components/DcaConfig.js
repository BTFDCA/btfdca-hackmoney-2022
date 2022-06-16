import { Box } from "@mui/material";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DcaSelect from "./DcaSelect";
import DcaConfigAlerts from "./DcaConfigAlerts";

import Button from "./mui/components/Button";
import Typography from "./mui/components/Typography";

import { getTargetTokenOptions } from "../config/options";
import { ADDRESSES } from "../config/constants";
import { getSignerAndFramework } from "../helpers/sf";
import { getErc20Balance } from "../helpers/balances";
import DcaSourceToken from "./DcaSourceToken";

// TODO: move this to contract helpers
async function createDCAFlow(sender, amount, sourceToken, targetToken) {
  const cadenceInDays = 1;

  console.log("Creating the DCA flow");
  const [chainId, signer, sf] = await getSignerAndFramework();

  // the amount of source token per second to be streamed from the user to the contract
  const monthlyBuyAmount = amount * (30 / cadenceInDays);
  const flowRateInEth = monthlyBuyAmount / 3600 / 24 / 30;
  const flowRateInWei = ethers.utils.parseEther(flowRateInEth.toFixed(18));
  console.log("flow rate:", flowRateInWei.toString());

  const amountInWei = ethers.utils.parseEther(amount.toString());
  console.log("amount per day in wei", amountInWei.toString());

  // start streaming the tokens from the user to the dca superapp contract
  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      // TODO: source/target token pair is used to determine the receiver
      receiver: ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP,
      flowRate: flowRateInWei.toString(),
      superToken: sourceToken,
    });
    console.log("created the create flow operation", createFlowOperation);

    const result = await createFlowOperation.exec(signer);
    console.log("stream created!", result);

    return result;
  } catch (error) {
    console.error(error);
  }
}

// TODO: move this to contract helpers
function estimateRequiredAmount(amount) {
  if (amount > 0) {
    const cadenceInHours = 24; // 24 hours, i.e. every day
    const amountPerHour = amount / cadenceInHours;

    let escrowHours = 4; // if testnet == 1, else == 4
    const requiredEscrow = amountPerHour * escrowHours;

    return parseFloat(requiredEscrow.toFixed(2));
  } else {
    return 0;
  }
}

function DcaConfig({ chainId, account, connectWallet }) {
  const navigate = useNavigate();

  const [buyAmount, setBuyAmount] = useState(0);
  const [srcToken, setSrcToken] = useState("");
  const [targetToken, setTargetToken] = useState("");
  const [dcaError, setDcaError] = useState();

  const [requiredAmount, setRequiredAmount] = useState(0);
  const [fDaixBalance, setfDaixBalance] = useState(0); // TODO: this must be changed to support different balances

  // btn event handler
  const setupDCAFlow = async () => {
    setDcaError(null);
    const sToken = JSON.parse(srcToken);
    const tToken = JSON.parse(targetToken);

    console.log(
      `setup an agreement to trade ${buyAmount} ${sToken.label} for ${tToken.label}`
    );

    // create the superfluid stream, etc
    createDCAFlow(account, buyAmount, sToken.value, tToken.value).then((r) => {
      console.log(r);
      if (r) {
        console.log("success!");
        setDcaError(false);
        navigate("/success");
      } else {
        setDcaError(true);
      }
    });
  };

  // on config change handler
  useEffect(() => {
    const req = estimateRequiredAmount(buyAmount);
    setRequiredAmount(req);
  }, [buyAmount]);

  // TODO: this should probably be moved, and have the balances passed down (or global)
  useEffect(() => {
    if (account) {
      getErc20Balance(ADDRESSES[chainId].ADDRESS_FDAIX, account).then((v) => {
        setfDaixBalance(parseFloat(v));
      });
    }
  }, [chainId, account]);

  return (
    <>
      {/* the dca configuration */}
      <Box
        sx={{ background: "#21c21c", p: 2.5, borderRadius: 1, mt: 2, mb: 2 }}
      >
        <Typography color="#e8f8e8" variant="h2">
          Periodically buy
        </Typography>

        <DcaSourceToken
          chainId={chainId}
          srcToken={srcToken}
          setSrcToken={setSrcToken}
          setBuyAmount={setBuyAmount}
        />

        <Typography
          color="#e8f8e8"
          variant="h2"
          sx={{ display: "inline-block", verticalAlign: "text-top" }}
        >
          worth of
        </Typography>

        <DcaSelect
          options={getTargetTokenOptions(chainId)}
          placeholder="Target Token"
          val={targetToken}
          setVal={(evt) => setTargetToken(evt.target.value)}
          sx={{ m: 1, minWidth: 200, bgcolor: "white" }}
        />
      </Box>

      {/* alerts and errors */}
      {account && srcToken && fDaixBalance && buyAmount ? (
        <DcaConfigAlerts
          srcToken={JSON.parse(srcToken)}
          fDaixBalance={fDaixBalance}
          buyAmount={buyAmount}
          requiredAmount={requiredAmount}
          dcaError={dcaError}
        />
      ) : (
        <></>
      )}

      {/* action buttons */}
      {account === "" ? (
        // TODO: change color
        <Button
          id="connectWallet"
          onClick={connectWallet}
          variant="contained"
          size="large"
          component="button"
          color="secondary"
          sx={{ mt: 2, mb: 2, minWidth: 200 }}
        >
          Connect Wallet
        </Button>
      ) : (
        // {/* TODO: disable if there's already an active BTFDCA */}
        <Button
          id="lfgButton"
          onClick={setupDCAFlow}
          disabled={buyAmount <= 0 || fDaixBalance < requiredAmount}
          variant="contained"
          size="large"
          component="button"
          color="secondary"
          sx={{ mt: 2, mb: 2, minWidth: 200 }}
        >
          BTFDCA!
        </Button>
      )}
    </>
  );
}

export default DcaConfig;
