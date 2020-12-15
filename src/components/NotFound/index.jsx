import React from "react";
import Img from "components/common/Img";

import NotFoundPng from "assets/images/not-found.png";

import { Background } from "./styles";

export default function NotFound() {
  return (
    <Background>
      <Img src={NotFoundPng} alt="not found" width="430px" />
      <div className="title">404</div>
      <div className="subtitle">Page Not Found</div>
    </Background>
  );
}
