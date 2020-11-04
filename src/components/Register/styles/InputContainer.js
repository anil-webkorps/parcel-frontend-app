import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: ${({ dividerBottom }) =>
    dividerBottom ? "solid 0.5px #aaaaaa" : "none"};
  border-right: ${({ dividerRight }) =>
    dividerRight ? "solid 0.5px #aaaaaa" : "none"};
  padding: 15px 34px;

  label {
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #aaaaaa;
  }

  input {
    border: none;
    font-weight: normal;

    &::placeholder {
      color: #888;
    }
    &:focus {
      outline: none;
    }
  }
`;
