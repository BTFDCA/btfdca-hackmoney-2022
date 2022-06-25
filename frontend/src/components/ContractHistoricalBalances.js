import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { Box } from "@mui/material";
import { Axis, Grid, BarSeries, XYChart } from "@visx/xychart";
import { useEffect, useState } from "react";
import { getContractHistoricalBalances } from "../helpers/covalent";
import Typography from "./mui/Typography";

export default function ContractHistoricalBalances({
  chainId,
  pairName,
  contractAddr,
}) {
  const [chartData, setChartData] = useState();

  const accessors = {
    xAccessor: (d) => {
      let dt = new Date(d["timestamp"]);
      return (
        dt.getDate() + "-" + dt.toLocaleString("default", { month: "long" })
      );
    },
    yAccessor: (d) => {
      let balance = BigNumber.from(d["balance"]);

      return formatEther(balance);
    },
  };

  useEffect(() => {
    getContractHistoricalBalances(chainId, contractAddr, setChartData);
  }, [chainId, contractAddr, setChartData]);

  return (
    <Box>
      {chartData && chartData.length > 0 ? (
        <>
          <Typography variant="h6" align="center">
            Timeline of Contract Balances ({pairName})
          </Typography>

          {chartData.map((tokenData) => (
            <Box sx={{ mb: 4 }} key={tokenData["address"]}>
              <XYChart
                height={300}
                // width={750}
                xScale={{ type: "band", paddingInner: 0.6, paddingOuter: 0.1 }}
                yScale={{ type: "linear", nice: true }}
              >
                <Grid columns={false} numTicks={4} />
                <BarSeries
                  dataKey="Line 1"
                  data={tokenData["historical"]}
                  {...accessors}
                />
                <Axis orientation="bottom" hideTicks />
                <Axis
                  orientation="right"
                  hideAxisLine
                  numTicks={4}
                  // tickFormat={(value) => percent.format(value)}
                />
              </XYChart>
              <Typography align="center">
                {tokenData["name"]} ({tokenData["ticker"]})
              </Typography>
            </Box>
          ))}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
