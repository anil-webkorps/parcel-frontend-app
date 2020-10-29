import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import "jest-styled-components";

import { NavBarContent } from "../styles";

describe("<NavBarContent />", () => {
  it("should match snapshot", () => {
    const renderedComponent = renderer.create(<NavBarContent />).toJSON();
    expect(renderedComponent).toMatchSnapshot();
  });

  it("should have a class attribute", () => {
    const { container } = render(<NavBarContent />);
    expect(container.querySelector("div").hasAttribute("class")).toBe(true);
  });
});
