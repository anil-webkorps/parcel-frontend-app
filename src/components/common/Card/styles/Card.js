import styled from "styled-components/macro";

export default styled.div`
  max-width: 668px;
  min-height: 580px;
  background: ${({ theme }) => theme.card.backgroundColor};
  color: ${({ theme }) => theme.card.color};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 16px;
  opacity: 1;
  position: relative;
  transition: all 0.5s linear;
`;
