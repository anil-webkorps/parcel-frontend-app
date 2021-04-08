import { TOGGLE_NOTIFICATION } from "./action-types";

export function toggleNotification(show) {
  return {
    type: TOGGLE_NOTIFICATION,
    show,
  };
}
