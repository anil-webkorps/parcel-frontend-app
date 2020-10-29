import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { HeaderLink, NavBar, NavBarContent } from "./styles";
import { toggleTheme } from "store/theme/actions";
import Toggle from "components/Toggle";

export default function Header() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);
  return (
    <div>
      <NavBar>
        <NavBarContent>
          <HeaderLink to="/">Parcel</HeaderLink>
          {/* <button onClick={handleToggle}>Toggle</button> */}
          <Toggle onChange={handleToggle} toggled={isDarkMode}></Toggle>
        </NavBarContent>
      </NavBar>
    </div>
  );
}
