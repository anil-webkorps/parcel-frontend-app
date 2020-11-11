import styled from "styled-components/macro";

export default styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: center;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
`;
