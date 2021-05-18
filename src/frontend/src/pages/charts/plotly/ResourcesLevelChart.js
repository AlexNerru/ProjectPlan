import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled, { withTheme } from "styled-components/macro";
import { Card as MuiCard, CardContent, CardHeader } from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Plot from "../../../../node_modules/react-plotly.js/react-plotly";

import { getSkillsLevelAction } from "../../../redux/charts/actions";
import {
  selectResourcesLevelLabels,
  selectResourcesLevelValues,
} from "../../../redux/charts/selectors";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 600px;
  width: 100%;
`;

function ResourcesLevelChart({ token }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSkillsLevelAction(token));
  }, []);

  const labels = useSelector(selectResourcesLevelLabels);
  const values = useSelector(selectResourcesLevelValues);

  return (
    <Card mb={3}>
      <CardHeader title="Company resources levels" />
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
export default withTheme(ResourcesLevelChart);
