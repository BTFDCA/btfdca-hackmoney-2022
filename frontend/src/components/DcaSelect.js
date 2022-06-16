import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function DcaSelect({ options, placeholder, val, setVal, sx }) {
  return (
    <FormControl variant="filled" sx={sx}>
      <InputLabel id={"dca-select-" + placeholder}>{placeholder}</InputLabel>
      <Select
        autoWidth
        labelId={"dca-select" + placeholder}
        value={val}
        onChange={setVal}
        label={placeholder}
      >
        <MenuItem key="placeholder" disabled value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.id} value={JSON.stringify(opt)}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
