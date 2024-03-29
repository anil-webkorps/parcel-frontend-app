import React from "react";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import GlobalStyle, { lightTheme, darkTheme } from "global-styles";
import Header from "components/Header";
import NetworkModal from "components/Connect/NetworkModal";

import RegisterPage from "pages/Register";
import LoginPage from "pages/Login";
import DashboardPage from "./Dashboard";
import AcceptInvitePage from "./AcceptInvite";
import NotFoundPage from "./NotFound";
import SideNavProvider from "context/SideNavContext";

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
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/accept-invite" component={AcceptInvitePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </SideNavProvider>
        <GlobalStyle />
        <NetworkModal />
      </ThemeProvider>
    </div>
  );
}
