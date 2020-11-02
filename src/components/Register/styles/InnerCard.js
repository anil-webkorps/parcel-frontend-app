import styled from "styled-components/macro";

export default styled.div`
  width: 668px;
  height: 257px;
  background: ${({ theme }) => theme.card.inner.backgroundColor};
  border: 1px solid ${({ theme }) => theme.card.inner.borderColor};
  transition: all 0.5s linear;
  border-radius: 16px;
  opacity: 1;
  padding: 32px;
`;
