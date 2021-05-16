import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Cookies from "universal-cookie";

import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import WorkHoursChart from "../../charts/plotly/WorkHoursChart";
import CostsChart from "../../charts/plotly/CostsChart";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Default() {
  const cookies = new Cookies();

  const token = useSelector((state) => {
    if (state.auth.user.token !== undefined) {
      cookies.set("token", state.auth.user.token, { path: "/" });
      return state.auth.user.token;
    } else {
      return cookies.get("token");
    }
  });

  return (
    <React.Fragment>
      <Helmet title="ProjectPlan Dashboard" />
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            ProjectPlan Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Welcome back, to ProjectPlan!{" "}
            <span role="img" aria-label="Waving Hand Sign">
              👋
            </span>
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <WorkHoursChart token={token} />
        </Grid>

        <Grid item xs={12} lg={6}>
          <CostsChart token={token} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Default;
