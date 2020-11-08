import styled from "styled-components";

export default styled.div`
  min-width: 532px;
  min-height: 157px;
  border-radius: 16px;
  border: solid 0.5px #aaaaaa;
  background-color: #ffffff;
  position: relative;
  color: #363537;
  margin: 32px 0;
  cursor: pointer;

  .select-safe {
    display: none;
  }

  .top {
    border-bottom: solid 0.5px #aaaaaa;
    padding: 20px 35px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .bottom {
    padding: 20px 35px;
    display: flex;
    justify-content: flex-start;
  }

  .details {
    min-width: 250px;
    display: flex;
    align-items: center;
  }

  .info {
    margin-left: 1em;

    .desc {
      font-size: 14px;
      font-weight: 500;
      color: #aaaaaa;
      text-transform: uppercase;
    }

    .val {
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      color: #373737;
    }
  }

  &:hover {
    .select-safe {
      background: red;
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      width: 56px;
      height: 100%;
      background-color: #7367f0;
      border-radius: 0 16px 16px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: width 1s linear;
    }
  }
`;
