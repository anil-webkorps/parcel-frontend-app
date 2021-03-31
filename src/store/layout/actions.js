import { TOGGLE_DROPDOWN, TOGGLE_NOTIFICATION } from "./action-types";

export function toggleDropdown(dropdownName, show) {
  return {
    type: TOGGLE_DROPDOWN,
    dropdownName,
    show,
  };
}
export function toggleNotification(show) {
  return {
    type: TOGGLE_NOTIFICATION,
    show,
  };
}
