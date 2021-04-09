import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDropdown } from "hooks";
import { SearchByTeam } from "./styles";

export default function SearchByTeamDropdown() {
  const { open, toggleDropdown } = useDropdown();

  return (
    <SearchByTeam onClick={toggleDropdown} className={`${open && "highlight"}`}>
      <div className="text">Search By Team</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#373737" />
      <div className={`search-team-dropdown ${open && "show"}`}>
        <div className="search-team-option">
          <div className="name">Engineering</div>
        </div>
        <div className="search-team-option">
          <div className="name">HR</div>
        </div>
        <div className="search-team-option">
          <div className="name">Engineering</div>
        </div>
        <div className="search-team-option">
          <div className="name">HR</div>
        </div>
        <div className="search-team-option">
          <div className="name">Engineering</div>
        </div>
        <div className="search-team-option">
          <div className="name">HR</div>
        </div>
      </div>
    </SearchByTeam>
  );
}
