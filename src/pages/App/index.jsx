import React from "react";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

import GlobalStyle, { lightTheme, darkTheme } from "global-styles";
import Header from "components/Header";
import Register from "components/Register";

export default function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className="app">
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
        <Register />
        <GlobalStyle />
      </ThemeProvider>
    </div>
  );
}
