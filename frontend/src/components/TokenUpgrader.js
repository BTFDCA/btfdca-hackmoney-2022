import { Box, ButtonGroup } from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react";

import { erc20abi } from "../abis/erc20";
import { supertokenAbi } from "../abis/supertoken";
import { getUpgradableTokens } from "../config/options";
import { getSignerAndFramework } from "../helpers/sf";
import DcaSelect from "./DcaSelect";
import Button from "./mui/Button";
import TextField from "./mui/TextField";
import Typography from "./mui/Typography";

async function approveUpgrade(token, amount) {
  console.log("approving upgrade", amount, "of", token);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const erc20 = new ethers.Contract(token.address, erc20abi, signer);
  console.log("got erc20 contract", erc20);

  try {
    console.log("approving");
    await erc20
      .approve(token.upgradeTo, ethers.utils.parseEther(amount.toString()))
      .then(function (tx) {
        console.log("approved spend", tx);
      });
  } catch (error) {
    console.error(error);
  }
}

async function upgradeToken(token, amount) {
  console.log("upgrade", amount, "of", token);
  if (!("upgradeTo" in token)) {
    console.log("selected token is not upgradable");
    return;
  }

  const [, signer, sf] = await getSignerAndFramework();

  try {
    if (token.isNative) {
      console.log("native upgrade");
      const supertoken = new ethers.Contract(token.upgradeTo, supertokenAbi);
      const receipt = await supertoken.connect(signer).upgradeByETH({
        value: ethers.utils.parseEther(amount.toString()),
      });
      await receipt.wait().then(function (tx) {
        console.log("upgraded native token");
      });
    } else {
      console.log("erc20 upgrade");
      const supertoken = await sf.loadSuperToken(token.upgradeTo);
      console.log("loaded the supertoken");

      console.log("calling upgrade");
      const upgradeOperation = supertoken.upgrade({
        amount: ethers.utils.parseEther(amount.toString()),
      });
      console.log("executing the upgrade");
      const upgradeTxn = await upgradeOperation.exec(signer);
      await upgradeTxn.wait().then(function (tx) {
        console.log("upgraded erc20");
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function TokenUpgrader({ chainId }) {
  const [amount, setAmount] = useState(0);
  const [selectedOption, setSelectedOption] = useState();

  return (
    <Box>
      <Typography variant="h5">🔼 Upgrade ERC20 to SuperToken</Typography>
      <Box sx={{ my: 4 }}>
        <DcaSelect
          options={getUpgradableTokens(chainId)}
          placeholder="Token to Upgrade"
          setVal={(evt) => setSelectedOption(evt.target.value)}
          sx={{ mr: 1, mt: 2, minWidth: 200, bgcolor: "white" }}
        />

        {/* TODO: validate negative values, etc */}
        {/* TODO: max button with fdai balance */}
        <TextField
          label="Amount"
          InputLabelProps={{ style: { color: "white" } }}
          helperText="How much to upgrade?"
          type="number"
          variant="standard"
          InputProps={{
            inputProps: {
              min: 0,
              step: 10,
              placeholder: "How much to upgrade?",
            },
          }}
          FormHelperTextProps={{ style: { color: "white" } }}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Box>

      {/* TODO: if not approved, etc */}
      {/* TODO: disable if balance == 0 */}
      {/* TODO: on approve finished, on upgrade finished */}
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          variant="outlined"
          size="small"
          component="button"
          color="primary"
          onClick={async () =>
            approveUpgrade(JSON.parse(selectedOption), amount)
          }
        >
          Approve
        </Button>

        <Button
          variant="outlined"
          size="small"
          component="button"
          color="primary"
          onClick={async () => upgradeToken(JSON.parse(selectedOption), amount)}
        >
          Upgrade
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default TokenUpgrader;
