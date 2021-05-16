import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled, { withTheme } from "styled-components/macro";
import { Card as MuiCard, CardContent, CardHeader } from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Plot from "../../../../node_modules/react-plotly.js/react-plotly";

import {
  getCostsAction,
  getCostsActionAll,
} from "../../../redux/charts/actions";
import {
  selectCostsFact,
  selectCostsLabels,
  selectCostsPlan,
} from "../../../redux/charts/selectors";
import { getParams } from "../../../routes/Routes";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 600px;
  width: 100%;
`;

function WorkHoursChart({ token }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const currentParams = getParams(window.location.href.slice(21));
    console.log(currentParams["projectID"]);
    if (currentParams["projectID"] !== undefined) {
      dispatch(getCostsAction(token, currentParams["projectID"]));
    } else {
      dispatch(getCostsActionAll(token));
    }
  }, []);

  const labels = useSelector(selectCostsLabels);
  const plan = useSelector(selectCostsPlan);
  const fact = useSelector(selectCostsFact);

  return (
    <Card mb={3}>
      <CardHeader title="Project costs plan and fact" />
      <CardContent>
        <ChartWrapper>
          <Plot
            data={[
              {
                x: labels,
                y: plan,
                type: "scatter",
                mode: "lines+markers",
                name: "Plan",
                marker: { color: "blue" },
              },
              {
                x: labels,
                y: fact,
                type: "scatter",
                mode: "lines+markers",
                name: "Fact",
                marker: { color: "red" },
              },
            ]}
            layout={{ autosize: true }}
            style={{ width: "100%", height: "100%" }}
            config={{ responsive: true }}
          />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}
export default withTheme(WorkHoursChart);
