import styled from "styled-components/macro";

export default styled.div`
  min-height: 100%;
  background: ${({ theme }) => theme.card.backgroundColor};
  color: ${({ theme }) => theme.card.color};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 16px;
  opacity: 1;
  position: relative;
  transition: all 0.5s linear;
`;
