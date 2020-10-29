import styled from "styled-components/macro";

export default styled.div`
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  height: 22px;
  width: 22px;
  // transform: translateX(0px);
  transition: transform 0.2s linear;

  ${(props) =>
    props.toggled
      ? "transform: translateX(24px);"
      : "transform: translateX(0px)"}
`;
