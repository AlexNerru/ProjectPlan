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
  getWorkHoursAction,
  getWorkHoursAllAction,
} from "../../../redux/charts/actions";
import {
  selectWorkHoursFact,
  selectWorkHoursLabels,
  selectWorkHoursPlan,
} from "../../../redux/charts/selectors";
import { getParams } from "../../../routes/Routes";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 600px;
  width: 100%;
`;

function WorkHoursChart({ token }) {
  const dispatch = useDispatch();

  const [projectID, setProjectID] = useState();

  useEffect(() => {
    const currentParams = getParams(window.location.href.slice(21));
    if (currentParams["projectID"] !== undefined) {
      dispatch(getWorkHoursAction(token, currentParams["projectID"]));
    } else {
      dispatch(getWorkHoursAllAction(token));
    }
  }, []);

  const labels = useSelector(selectWorkHoursLabels);
  const plan = useSelector(selectWorkHoursPlan);
  const fact = useSelector(selectWorkHoursFact);

  return (
    <Card mb={3}>
      <CardHeader title="Project work hours plan and fact" />
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
