import { Link } from "react-router-dom";
import styled from "styled-components/macro";

export default styled(Link)`
  display: inline-flex;
  padding: 0.25em 0;
  margin: 1em 0;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: ${({ theme }) => theme.logo.color};

  &:active {
    background: #41addd;
    color: #fff;
  }
`;
