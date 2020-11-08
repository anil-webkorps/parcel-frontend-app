import React from "react";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import GlobalStyle, { lightTheme, darkTheme } from "global-styles";
import Header from "components/Header";

import RegisterPage from "pages/Register";
import LoginPage from "pages/Login";
import DashboardPage from "./Dashboard";

export default function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className="app">
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
        <Switch>
          <Route exact path="/" component={RegisterPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/dashboard" component={DashboardPage} />
        </Switch>
        <GlobalStyle />
      </ThemeProvider>
    </div>
  );
}
