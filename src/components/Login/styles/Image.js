import styled from "styled-components/macro";

import WelcomeImage from "assets/images/welcome.png";

export default styled.div`
  min-height: ${(props) => props.minHeight};
  background: url(${WelcomeImage});
  opacity: 1;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0 auto;
`;
