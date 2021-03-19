import styled from "styled-components/macro";

export default styled.nav`
  grid-area: nav;
  display: flex;
  align-items: center;

  .nav-icon {
    display: none;
  }

  @media (max-width: 978px) {
    .nav-icon {
      display: inline;
      padding: 0 1em;
      cursor: pointer;
    }
  }
`;
