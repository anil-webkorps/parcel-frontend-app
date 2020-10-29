import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

import GlobalStyle, { lightTheme, darkTheme } from "global-styles";
import Header from "components/Header";
import Button from "components/common/Button";
import Container from "react-bootstrap/Container";
import { useActiveWeb3React } from "hooks";
import ConnectButton from "components/Connect";

export default function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [isConnected, setIsConnected] = useState(false);

  const { active } = useActiveWeb3React();

  useEffect(() => {
    setIsConnected(active);
  }, [active]);

  return (
    <div className="app">
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
        <Container style={{ marginTop: "5em" }}>
          {isConnected ? (
            <div>
              <div className="mb-4">
                Please Sign the terms and conditions before continuing...
              </div>
              <Button>Sign and Accept Terms</Button>
              <div className="mt-5 mb-4">You need to create a Gnosis safe:</div>
              <Button>Create Gnosis Safe</Button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                Please connect your Ethereum wallet before continuing...
              </div>
              <ConnectButton></ConnectButton>
            </div>
          )}
        </Container>
        <GlobalStyle />
      </ThemeProvider>
    </div>
  );
}
