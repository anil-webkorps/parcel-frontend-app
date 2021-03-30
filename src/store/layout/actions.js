import { TOGGLE_DROPDOWN } from "./action-types";

export function toggleDropdown(dropdownName, show) {
  return {
    type: TOGGLE_DROPDOWN,
    dropdownName,
    show,
  };
}
