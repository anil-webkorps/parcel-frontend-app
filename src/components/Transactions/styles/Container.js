import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: 1fr;
  position: absolute;
  left: 0;
  right: 0;
  top: 180px;
  .new-user {
    grid-row: 1/5;
  }

  .details-card {
    margin: 0 auto;
    width: 683px;
    min-height: 351px;
    padding: 17px 36px 27px 30px;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    position: absolute;
    top: 200px;
    left: 0;
    right: 0;

    .details-title {
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px 10px;
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

    &.circle-grey {
      width: 44px;
      height: 44px;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }
  }
`;
