import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import DateFnsUtils from "@date-io/date-fns";

import { ThemeProvider } from "styled-components/macro";
import { create } from "jss";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
  jssPreset,
} from "@material-ui/core/styles";

import createTheme from "./theme";
import Routes from "./routes/Routes";
import { getUserAction } from "./redux/auth/authActions";
import Cookies from "universal-cookie";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

function App() {
  const cookies = new Cookies();

  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme);

  const token = useSelector((state) => {
    if (state.auth.user.token !== undefined) {
      cookies.set("token", state.auth.user.token, { path: "/" });
      return state.auth.user.token;
    } else {
      return cookies.get("token");
    }
  });

  useEffect(() => {
    if (!window.location.href.includes("/auth/")) {
      dispatch(getUserAction(token));
    }
  }, []);

  return (
    <React.Fragment>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s | Project Plan"
          defaultTitle="Project Plan - Best app to manage your project resources"
        />
        <StylesProvider jss={jss}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
              <ThemeProvider theme={createTheme(theme.currentTheme)}>
                <Routes />
              </ThemeProvider>
            </MuiThemeProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </HelmetProvider>
    </React.Fragment>
  );
}

export default App;
