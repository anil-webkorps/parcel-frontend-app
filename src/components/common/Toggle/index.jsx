import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import { Input, Label, Ball } from "./styles";

export default function Toggle({
  children,
  id,
  onChange,
  toggled,
  className = "",
}) {
  return (
    <div className={className}>
      <Input type="checkbox" id={id || "checkbox"} onChange={onChange} />
      <Label htmlFor={id || "checkbox"}>
        <FontAwesomeIcon icon={faMoon} color="#f1c40f" />
        <FontAwesomeIcon icon={faSun} color="#f39c12" />
        <Ball toggled={toggled}></Ball>
      </Label>
    </div>
  );
}
