import React from "react";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import GlobalStyle, { lightTheme, darkTheme } from "global-styles";
import Header from "components/Header";

import RegisterPage from "pages/Register";
import LoginPage from "pages/Login";
import DashboardPage from "./Dashboard";
import SideNavProvider from "context/SideNavContext";
import MassPayoutPage from "./MassPayout";

export default function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <div className="app">
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <SideNavProvider>
          <Header />
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/signup" component={RegisterPage} />
            <Route exact path="/dashboard" component={DashboardPage} />
            <Route exact path="/mass" component={MassPayoutPage} />
          </Switch>
        </SideNavProvider>
        <GlobalStyle />
      </ThemeProvider>
    </div>
  );
}
