import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDropdown } from "hooks";
import { AddPeople } from "./styles";

export default function AddPeopleDropdown() {
  const { open, toggleDropdown } = useDropdown();

  return (
    <AddPeople onClick={toggleDropdown}>
      <div className="text">Add People</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#fff" />
      <div className={`add-people-dropdown ${open && "show"}`}>
        <div className="add-people-option">
          <div className="name">Add One</div>
        </div>
        <div className="add-people-option">
          <div className="name">Import Multiple</div>
        </div>
      </div>
    </AddPeople>
  );
}
