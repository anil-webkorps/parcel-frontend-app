import styled from "styled-components/macro";

export default styled.div`
  padding: 2px;
  border-radius: 32px;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  background-color: rgba(55, 55, 55, 0.24);
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  min-width: 200px;
  z-index: 2;
  cursor: pointer;

  &:hover {
    border-radius: 32px 32px 0 0;
    padding: 4px;
  }

  .name {
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }

  .info {
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }
`;
