import styled from "styled-components/macro";

export default styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 13px 12px 11px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #7367f0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 16px;

  svg:focus {
    outline: none;
  }
`;