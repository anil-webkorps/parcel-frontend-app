import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import "jest-styled-components";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "global-styles";

import { NavBar } from "../styles";

describe("<NavBar />", () => {
  it("should match snapshot", () => {
    const renderedComponent = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <NavBar />
        </ThemeProvider>
      )
      .toJSON();
    expect(renderedComponent).toMatchSnapshot();
  });

  it("should have a class attribute", () => {
    const { container } = render(
      <ThemeProvider theme={lightTheme}>
        <NavBar />
      </ThemeProvider>
    );
    expect(container.querySelector("div").hasAttribute("class")).toBe(true);
  });
});
