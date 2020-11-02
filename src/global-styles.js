import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#FFF",
  text: "#363537",
  toggleBorder: "#FFF",
  background: "#FFF",
  logo: {
    color: "#7367F0",
  },
  border: {
    color: "#eee",
  },
  card: {
    backgroundColor: "#f2f2f2",
    color: "#363537",
    inner: {
      backgroundColor: "#fff",
      borderColor: "#f2f2f2",
    },
  },
};
export const darkTheme = {
  body: "#363537",
  text: "#FAFAFA",
  toggleBorder: "#6B8096",
  background: "#292C35",
  logo: {
    color: "#7367F0",
  },
  border: {
    color: "#535766",
  },
  card: {
    backgroundColor: "#292C35",
    color: "#fff",
    inner: {
      backgroundColor: "#292C40",
      borderColor: "#333",
    },
  },
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
    margin: 0;
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;

export default GlobalStyle;
