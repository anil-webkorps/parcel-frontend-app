import styled from "styled-components/macro";

export default styled.button`
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};

  color: #ffffff;
  text-align: center;
  border: none;
  padding: 10px 20px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;

  ${(props) =>
    props.large &&
    `
    width: 100%;
    min-height: 60px;
    border-radius: 10px;
  `}

  &:hover {
    background-color: #3c3c3c;
  }

  &:focus {
    outline: 0;
  }

  &.secondary {
    background: white;
    border: 1px solid ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    &:hover {
      background-color: ${({ theme }) => theme.primary};
      color: white;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
