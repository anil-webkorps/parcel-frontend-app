import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  max-width: 1280px;
  margin: 0 auto;
  grid-template-columns: 1fr;
  position: absolute;
  left: 0;
  right: 0;
  top: 180px;
  .new-user {
    grid-row: 1/5;
  }

  .card-title {
    max-width: 240px;
    margin: 225px auto 20px;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #373737;
  }

  .card-subtitle {
    max-width: 408px;
    margin: 0 auto;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: center;
    color: #373737;
  }

  .add-teammate {
    width: 488px;
    min-height: 656px;
    margin: 0 auto;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    padding: 30px 36px;
  }

  .add-department {
    width: 488px;
    min-height: 656px;
    margin: 0 auto;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    padding: 30px 36px;
  }

  .choose-department {
    width: 488px;
    min-height: 550px;
    margin: 0 auto;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    padding: 30px 36px;
  }

  .paydate {
    min-height: 449px;
    width: 488px;
    margin: 0 auto;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    padding: 30px 36px;
  }

  .add-now {
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    color: ${({ theme }) => theme.primary};
  }

  .circle {
    width: 48px;
    height: 48px;
    padding: 12px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    background-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 16px auto;
  }
`;
