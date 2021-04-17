import React from "react";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import GlobalStyle, { lightTheme, darkTheme } from "global-styles";
import Header from "components/Header";
import NetworkModal from "components/Connect/NetworkModal";
import ConnectToWalletModal from "components/Connect/ConnectModal";

import RegisterPage from "pages/Register";
import LoginPage from "pages/Login";
import DashboardPage from "./Dashboard";
import AcceptInvitePage from "./AcceptInvite";
import DelegateTransfer from "./DelegateTransfer";
import NotFoundPage from "./NotFound";
import SideNavProvider from "context/SideNavContext";
import { useEagerConnect, useInactiveListener } from "hooks";
import { routeTemplates } from "constants/routes/templates";

export default function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);
  // const { onboard } = useActiveWeb3React();

  return (
    <div className="app">
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <SideNavProvider>
          <Header />
          <Switch>
            <Route exact path={routeTemplates.login} component={LoginPage} />
            <Route
              exact
              path={routeTemplates.signup}
              component={RegisterPage}
            />
            <Route
              path={routeTemplates.dashboard.root}
              component={DashboardPage}
            />
            <Route
              path={routeTemplates.acceptInvite}
              component={AcceptInvitePage}
            />
            <Route
              path={routeTemplates.delegateTransfer}
              component={DelegateTransfer}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </SideNavProvider>
        <GlobalStyle />
        <NetworkModal />
        <ConnectToWalletModal triedEager={triedEager} />
      </ThemeProvider>
    </div>
  );
}
