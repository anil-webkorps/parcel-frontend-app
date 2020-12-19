import styled from "styled-components/macro";

export default styled.div`
  min-width: 300px;
  min-height: 52px;
  border-radius: 32px;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  background-color: rgba(55, 55, 55, 0.24);
  margin-top: 40px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  cursor: pointer;

  .token-icon {
    margin-left: 4px;
  }

  .balance-info {
    min-width: 150px;
    max-width: 300px;
    margin-left: 10px;
    margin-right: 20px;
  }

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

  .separator {
    width: 1px;
    height: 52px;
    background: rgba(242, 242, 242, 0.15);
    position: absolute;
    right: 6em;
  }

  .change-text {
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    margin-right: 1.5em;
  }
`;
