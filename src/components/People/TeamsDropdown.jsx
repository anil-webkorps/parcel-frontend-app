import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDropdown } from "hooks";
import { Teams } from "./styles";

export default function TeamsDropdown() {
  const { open, toggleDropdown } = useDropdown();

  return (
    <Teams onClick={toggleDropdown}>
      <div className="text">Teams</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#fff" />
      <div className={`teams-dropdown ${open && "show"}`}>
        <div className="teams-option">
          <div className="name">View All</div>
        </div>
        <div className="teams-option">
          <div className="name">Add Team</div>
        </div>
      </div>
    </Teams>
  );
}
