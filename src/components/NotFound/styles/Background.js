import styled from "styled-components/macro";

export default styled.div`
  min-height: 92vh;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title,
  .subtitle {
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.5);
  }

  .title {
    margin-top: 100px;
  }

  .subtitle {
    font-weight: normal;
  }
`;
