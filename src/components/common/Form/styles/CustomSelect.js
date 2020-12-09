import styled from "styled-components/macro";

export default styled.div`
  position: relative;
  select {
    -webkit-appearance: none;
    width: 100%;
    min-height: 52px;
    border-radius: 8px;
    background-color: #f2f2f2;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    padding: 0 1em;
    border: solid 0.5px #aaaaaa;

    &:focus {
      outline: 0;
    }
  }

  option {
    padding: 3em;
    height: 30px;
    background: #ffffff;
  }

  .custom-arrow {
    background: #f2f2f2;
    border: solid 0.5px #aaaaaa;
    position: absolute;
    top: 0;
    right: 0;
    width: 3em;
    height: 100%;
    border-radius: 0 8px 8px 0;
    pointer-events: none;

    .arrow {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      top: 50%;
    }
    // &::before,
    // &::after {
    //   content: "";
    //   position: absolute;
    //   width: 0;
    //   height: 0;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    //   top: 50%;
    // }

    // &::before {
    //   border-left: 0.55em solid transparent;
    //   border-right: 0.55em solid transparent;
    //   border-top: 0.55em solid #373737;
    // }
  }
`;
