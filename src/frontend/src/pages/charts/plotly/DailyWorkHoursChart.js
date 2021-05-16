import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components/macro";
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  IconButton,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Plot from "../../../../node_modules/react-plotly.js/react-plotly";
import { useDispatch, useSelector } from "react-redux";
import {
  getDailyWorkHoursAction,
  getDailyWorkHoursAllAction,
} from "../../../redux/charts/actions";
import {
  selectDailyWorkHoursFact,
  selectDailyWorkHoursLabels,
  selectDailyWorkHoursPlan,
} from "../../../redux/charts/selectors";
import { getParams } from "../../../routes/Routes";
import { getResourcesAction } from "../../../redux/resources/resourcesActions";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 600px;
  width: 100%;
`;

function DailyWorkHoursChart({ token }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const currentParams = getParams(window.location.href.slice(21));
    if (currentParams["projectID"] !== undefined) {
      dispatch(getDailyWorkHoursAction(token, currentParams["projectID"]));
    } else {
      dispatch(getDailyWorkHoursAllAction(token));
      dispatch(getResourcesAction(token));
    }
  }, []);

  const labels = useSelector(selectDailyWorkHoursLabels);
  const plan = useSelector(selectDailyWorkHoursPlan);
  const fact = useSelector(selectDailyWorkHoursFact);

  const resourcesLength = useSelector(
    (state) => state.resources.resources.length
  );
  const maxWorkHours = Array.apply(null, Array(labels.length)).map(function (
    x,
    i
  ) {
    return 8 * resourcesLength;
  });

  return (
    <Card mb={3}>
      <CardHeader title="Project daily work hours plan and fact" />
      <CardContent>
        <ChartWrapper>
          <Plot
            data={[
              {
                x: labels,
                y: plan,
                type: "bar",
                mode: "lines+markers",
                name: "Plan",
                marker: { color: "blue" },
              },
              {
                x: labels,
                y: fact,
                type: "bar",
                mode: "lines+markers",
                name: "Fact",
                marker: { color: "red" },
              },
              {
                x: labels,
                y: maxWorkHours,
                type: "scatter",
                mode: "lines+markers",
                name: "Max",
                marker: { color: "green" },
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
export default withTheme(DailyWorkHoursChart);
