import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: 1fr;
  position: absolute;
  left: 0;
  right: 0;
  top: 100px;
  .new-user {
    grid-row: 1/5;
  }

  .invite-owners {
    width: 680px;
    min-height: 656px;
    margin: 0 auto;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    padding: 30px 36px;
  }
`;
