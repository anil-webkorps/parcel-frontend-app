import styled from "styled-components/macro";

export default styled.button`
  border-radius: 4px;
  background-color: #7367f0;

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

  ${(props) =>
    props.secondary &&
    `background: white; border: 1px solid #7367f0; color: #7367f0;
      &:hover {
        background-color: #7367f0;
        color: white;
      }
    `}
`;
