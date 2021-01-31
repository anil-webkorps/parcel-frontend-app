import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 62px;
  margin-bottom: 16px;
  padding: 13px 24px;
  border-radius: 12px;
  background-color: #f2f2f2;
  flex-wrap: wrap;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    align-items: center;
  }

  .icon {
    font-size: 26px;
  }
  .details {
    margin-left: 20px;
    .name {
      font-size: 14px;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      font-weight: bold;
    }
    .address {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }

  .invite-status {
    font-size: 12px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    text-align: right;
    color: ${({ theme }) => theme.primary};
    text-transform: uppercase;
    cursor: pointer;
  }

  .highlighted-status,
  .joined-status {
    font-size: 12px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    text-align: right;
    color: #fff;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #3bd800;
  }

  .awaiting-status {
    font-size: 12px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    text-align: right;
    color: #373737;
    text-transform: uppercase;
  }

  .approved-status {
    font-size: 12px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    text-align: right;
    color: #3bd800;
    text-transform: uppercase;
    cursor: pointer;
  }

  .send-email {
    width: 100%;
    margin-top: 16px;
  }
`;
