import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled, { withTheme } from "styled-components/macro";
import { Card as MuiCard, CardContent, CardHeader } from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Plot from "../../../../node_modules/react-plotly.js/react-plotly";

import { getSkillsAction } from "../../../redux/charts/actions";
import {
  selectSkillsLabels,
  selectSkillsValues,
} from "../../../redux/charts/selectors";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 600px;
  width: 100%;
`;

function SkillsChart({ token }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSkillsAction(token));
  }, []);

  const labels = useSelector(selectSkillsLabels);
  const values = useSelector(selectSkillsValues);

  return (
    <Card mb={3}>
      <CardHeader title="Company resources skills" />
      <CardContent>
        <ChartWrapper>
          <Plot
            data={[
              {
                values: values,
                labels: labels,
                type: "pie",
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
export default withTheme(SkillsChart);
