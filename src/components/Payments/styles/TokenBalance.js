import styled from "styled-components/macro";

export default styled.div`
  min-width: 184px;
  min-height: 52px;
  padding: 9px 0;
  border-radius: 32px;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  background-color: rgba(55, 55, 55, 0.24);
  margin-top: 40px;

  .balance-value {
    margin: 0 auto;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }

  .balance-text {
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }
`;
