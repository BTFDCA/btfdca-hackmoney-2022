import { Box, ButtonGroup } from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react";

import { getSignerAndFramework } from "../helpers/sf";
import Button from "./mui/Button";
import Typography from "./mui/Typography";
import TextField from "./mui/TextField";
import DcaSelect from "./DcaSelect";
import { getDowgradableTokens } from "../config/options";

async function downgradeToken(token, amount) {
  console.log("downgrade", amount, "of", token);
  if (!("downgradeFrom" in token)) {
    console.log("selected token is not downgradable");
    return;
  }

  const [, signer, sf] = await getSignerAndFramework();

  try {
    const supertoken = await sf.loadSuperToken(token.downgradeFrom);
    const downgradeOperation = supertoken.downgrade({
      amount: ethers.utils.parseEther(amount.toString()),
    });
    const downgradeTxn = await downgradeOperation.exec(signer);
    await downgradeTxn.wait().then(function (tx) {
      console.log("downgraded to erc20");
    });
  } catch (error) {
    console.error(error);
  }
}

function TokenDowngrader({ chainId }) {
  const [amount, setAmount] = useState(0);
  const [selectedOption, setSelectedOption] = useState();

  return (
    <Box>
      <Typography variant="h5">🔽 Downgrade SuperToken to ERC20</Typography>

      <Box sx={{ my: 4 }}>
        <DcaSelect
          options={getDowgradableTokens(chainId)}
          placeholder="Token to Downgrade"
          setVal={(evt) => setSelectedOption(evt.target.value)}
          sx={{ mr: 1, mt: 2, minWidth: 200, bgcolor: "white" }}
        />

        {/* TODO: validate negative values, etc */}
        {/* TODO: max button with  balance */}
        <TextField
          label="Amount"
          InputLabelProps={{ style: { color: "white" } }}
          helperText="How much to downgrade?"
          type="number"
          variant="standard"
          InputProps={{
            inputProps: {
              min: 0,
              step: 10,
              placeholder: "How much to downgrade?",
            },
          }}
          FormHelperTextProps={{ style: { color: "white" } }}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Box>

      {/* TODO: disable if balance == 0 */}
      {/* TODO: on downgrade finished */}
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          variant="outlined"
          size="small"
          component="button"
          color="primary"
          onClick={async () =>
            downgradeToken(JSON.parse(selectedOption), amount)
          }
        >
          Downgrade
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default TokenDowngrader;
