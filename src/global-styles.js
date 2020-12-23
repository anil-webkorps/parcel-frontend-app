import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  primary: "#7367f0",
  secondary: "#373737",
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
    backgroundColor: "#fff",
    color: "#363537",
    inner: {
      backgroundColor: "#fff",
      borderColor: "#f2f2f2",
      disabledBackgroundColor: "f2f2f2",
    },
  },
};
export const darkTheme = {
  primary: "#7367f0",
  secondary: "#373737",
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
      backgroundColor: "#f1f1f1",
      borderColor: "#333",
      disabledBackgroundColor: "f2f2f2",
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

  p, h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0;
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  a {
    &:hover, &:focus {
      text-decoration: none;
      color: inherit;
      background: none;
    }
    &:active{
      background : none;
    }

  }

  .modal {
    color: #373737;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  // Scaling/zooming depending on screen width
  @media (max-width: 1500px) {
    #root, .modal-dialog {
     zoom: 85%;
   }
  }
`;

export default GlobalStyle;
