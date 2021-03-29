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

export default function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

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
            <Route path="/delegate-transfer" component={DelegateTransfer} />
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
