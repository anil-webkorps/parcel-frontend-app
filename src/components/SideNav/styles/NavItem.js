import styled from "styled-components/macro";

export default styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
    width: 100%;
  }

  .icon {
    text-align: center;
  }

  .name {
    text-decoration: none;
    display: block;
    transition: 0.3s;
    margin: 8px 0;
    font-size: 10px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    text-transform: uppercase;
  }
`;
