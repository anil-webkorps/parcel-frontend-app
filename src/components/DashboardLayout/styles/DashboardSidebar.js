import styled from "styled-components/macro";

export default styled.div`
  grid-area: sidebar;
  max-width: 250px;
  background-color: #f7f7f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #dddcdc;
  position: relative;

  &.sidebar-responsive {
    position: absolute;
    display: block;
    z-index: 2;
    left: 0;
    height: 100vh;
  }

  .close-btn {
    display: none;
    position: absolute;
    right: 0.5em;
    top: 0.5em;
    cursor: pointer;
  }

  .parcel-logo {
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
  }

  .settings-container {
    padding: 0 10px;
    width: 100%;
  }

  .settings {
    min-height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0 25px;
    padding: 7px 15px;
    border-radius: 10px;
    border: solid 1px #dddcdc;
    background-color: #ffffff;
    cursor: pointer;
    position: relative;

    .company-title {
      margin-bottom: 5px;
      font-size: 14px;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: 0.7px;
      text-align: left;
      color: #373737;
    }

    .company-subtitle {
      font-size: 12px;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: 0.6px;
      text-align: left;
      color: #aaaaaa;
    }

    .settings-dropdown {
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;
      max-width: 230px;
      min-height: 152px;
      border-radius: 10px;
      box-shadow: 10px 10px 20px 0 rgba(170, 170, 170, 0.2);
      border: solid 1px #dddcdc;
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
      }

      .settings-option {
        padding: 15px;
        border-bottom: 1px solid #f1f0fd;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 1em;
        }

        .name {
          font-size: 14px;
          font-weight: 900;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: #373737;
          padding-top: 5px;
        }

        &:hover {
          opacity: 0.75;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .menu-items {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    grid-gap: 10px;
    padding: 0 10px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 15px;
    width: 100%;
    color: #373737;

    &.menu-item-highlighted {
      width: 100%;
      padding: 15px;
      border-radius: 10px;
      background-color: #e3e1fc;
      color: #7367f0;
    }

    .icon {
      margin-right: 1em;
    }

    .name {
      font-size: 16px;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: 0.8px;
      text-align: left;
      padding-top: 5px;
    }

    &:hover {
      cursor: pointer;
      border-radius: 10px;
      // background-color: #e3e1fc;
      opacity: 0.75;
    }
  }

  .invite-owners {
    min-height: 50px;
    padding: 15px;
    background-color: #7367f0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      margin-right: 1em;
    }

    .name {
      padding-top: 5px;
      font-size: 16px;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #ffffff;
    }

    &:hover {
      cursor: pointer;
      opacity: 0.9;
    }
  }

  @media (max-width: 978px) {
    display: none;

    .close-btn {
      display: block;
    }
  }
`;
