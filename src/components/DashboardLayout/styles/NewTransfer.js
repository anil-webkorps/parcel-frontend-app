import styled from "styled-components/macro";

export default styled.div`
  min-height: 4em;
  margin-right: 3em;
  padding: 1.2em;
  border-radius: 0.4em;
  box-shadow: 1em 1em 2em 0 rgba(77, 69, 164, 0.1);
  background-color: #7367f0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  .text {
    font-size: 1.4em;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }

  .transfer-dropdown {
    position: absolute;
    top: 5em;
    left: -4em;
    min-width: 20em;
    border-radius: 1em;
    box-shadow: 1em 1em 2em 0 rgba(170, 170, 170, 0.2);
    border: solid 0.1em #dddcdc;
    background-color: #ffffff;
    transition: opacity 0.15s linear;
    opacity: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;

    &.show {
      visibility: visible;
      opacity: 1;
      height: auto;
      z-index: 3;
    }

    .transfer-option {
      padding: 1.5em;
      border-bottom: 0.1em solid #f1f0fd;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        margin-right: 1em;
        font-size: 1.6em;
      }

      .name {
        font-size: 1.2em;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #7367f0;
        padding-top: 0.3em;
      }

      &:hover {
        opacity: 0.85;
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;
