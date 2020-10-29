import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
// import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from "react-router-dom";
import { lightTheme } from "global-styles";

import Header from "../index";
import configureStore from "store";

describe("<Header />", () => {
  const store = configureStore({});

  it("should render a div", () => {
    const { container } = render(
      <Provider store={store}>
        <Router>
          <ThemeProvider theme={lightTheme}>
            <Header />
          </ThemeProvider>
        </Router>
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
