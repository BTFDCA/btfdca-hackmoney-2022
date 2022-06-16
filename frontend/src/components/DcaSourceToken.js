import { Box } from "@mui/material";

import TextField from "./mui/TextField";
import DcaSelect from "./DcaSelect";

import { getSourceTokenOptions } from "../config/options";

export default function DcaSourceToken({
  chainId,
  srcToken,
  setSrcToken,
  setBuyAmount,
}) {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <TextField
        label="Amount"
        InputLabelProps={{ style: { color: "white" } }}
        helperText="How much will be spent"
        type="number"
        variant="standard"
        InputProps={{ inputProps: { min: 0, step: 10, placeholder: "10" } }}
        FormHelperTextProps={{ style: { color: "white" } }}
        onChange={(evt) => setBuyAmount(Math.abs(evt.target.value || 0))}
      />

      <DcaSelect
        options={getSourceTokenOptions(chainId)}
        placeholder="Source Token"
        val={srcToken}
        setVal={(evt) => setSrcToken(evt.target.value)}
        sx={{ ml: 1, mr: 1, mt: 2, minWidth: 200, bgcolor: "white" }}
      />
    </Box>
  );
}
