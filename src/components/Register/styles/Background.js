import styled from "styled-components/macro";

export default styled.div`
  background-color: ${(props) => props.backgroundColor};
  min-height: ${(props) => props.minHeight};
  display: flex;
  justify-content: center;
  align-items: center;
`;
