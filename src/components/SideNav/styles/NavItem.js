import styled from "styled-components/macro";

export default styled.div`
  padding: 10px 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    opacity: 0.6;
    transition: 0.3s;
  }

  a:focus {
    background: transparent;
  }

  a {
    text-decoration: none;
    display: block;
    transition: 0.3s;
    margin: 8px 0 8px 9px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    text-transform: uppercase;
  }
`;
