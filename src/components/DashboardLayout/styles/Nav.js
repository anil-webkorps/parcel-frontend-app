import styled from "styled-components/macro";

export default styled.nav`
  grid-area: nav;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  position: relative;
  display: grid;
  grid-template-areas: "empty content content content";
  grid-template-columns: 2fr 1fr 1fr 1fr;
  height: 10vh;

  .nav-icon {
    display: none;
  }

  .nav-container {
    grid-area: content;
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  @media (max-width: 978px) {
    grid-template-areas: "icon content content content";
    grid-template-columns: 0.2fr 1fr 1fr 1fr;
    .nav-icon {
      grid-area: icon;
      display: inline;
      padding: 0 1em;
      cursor: pointer;
    }
  }

  @media (max-width: 600px) {
    display: flex;
    .nav-icon {
      grid-area: icon;
      display: inline;
      padding: 0 1em;
      cursor: pointer;
    }
  }
`;
