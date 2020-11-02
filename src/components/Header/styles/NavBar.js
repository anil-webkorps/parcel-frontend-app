import styled from "styled-components/macro";

export default styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border.color};
  transition: all 0.5s linear;
  height: 8vh;
`;
