import styled from "styled-components/macro";

export default styled.div`
  width: 90px;
  height: 90px;
  svg,
  circle {
    width: 90px;
    height: 90px;
  }

  circle {
    position: absolute;
    stroke: #f9f9f9;
    fill: none;
    stroke-width: 5;
    transform: translate(10px, 10px);
    stroke-dasharray: 220;
    stroke-linecap: round;
  }

  circle:nth-child(2) {
    stroke-dashoffset: calc(220 - (${(props) => props.percentage} * 220) / 100);
    stroke: ${({ theme }) => theme.primary};
    animation: percent 1.5s linear;
    animation-delay: 0s;
    transition: all 0.5s linear;
  }

  @keyframes percent {
    0% {
      stroke-dashoffset: 220;
      stroke-width: 5;
    }
  }
`;
