import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  height: ${(props) => props.height};
  background: ${({ theme, disabled }) =>
    disabled
      ? theme.card.inner.disabledBackgroundColor
      : theme.card.inner.backgroundColor};
  border: 1px solid ${({ theme }) => theme.card.inner.borderColor};
  transition: all 0.5s linear;
  border-radius: 16px;
  opacity: 1;
  padding: 32px;
  color: ${({ disabled }) => (disabled ? "grey" : "#373737")};

  h2 {
    font-weight: bold;
  }
`;
