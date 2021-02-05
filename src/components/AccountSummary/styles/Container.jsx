import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  max-width: 1200px;
  min-height: 90vh;
  margin: 0 auto;
  grid-template-columns: 1fr;
  position: absolute;
  left: 0;
  right: 0;
  top: 180px;

  .balance-card {
    margin: 0 auto;
    // max-width: 1000px;
    width: fit-content;
    min-width: 683px;
    min-height: 0px;
    padding: 17px 36px;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    position: absolute;
    top: -70px;
    left: 0;
    right: 0;

    .balance-title {
      font-size: 18px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .balance-subtitle {
      font-size: 18px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #373737;

      span {
        font-weight: bold;
      }
    }
  }

  .add-custom-card {
    margin: 0 auto;
    width: 683px;
    min-height: 0px;
    padding: 17px 36px;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    position: absolute;
    top: 450px;
    left: 0;
    right: 0;
  }
`;
