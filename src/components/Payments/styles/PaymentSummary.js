import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  height: 75px;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 12px 27px 12px 45px;
  box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .payment-info {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .payment-title {
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.19;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
    .payment-subtitle {
      font-size: 14px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }
  .pay-button {
    width: 380px;
  }
`;
