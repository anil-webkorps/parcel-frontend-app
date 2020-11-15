import styled from "styled-components/macro";

export default styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border.color};
  transition: all 0.5s linear;
  height: 8vh;
  min-height: 80px;

  &.dashboard {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
    border-bottom: solid 1px rgba(255, 255, 255, 0.2);
  }
`;
