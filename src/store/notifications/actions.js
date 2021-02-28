import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_ERROR,
  UPDATE_NOTIFICATION_STATUS,
  UPDATE_NOTIFICATION_STATUS_SUCCESS,
  UPDATE_NOTIFICATION_STATUS_ERROR,
} from "./action-types";

export function getNotifications(safeAddress) {
  return {
    type: GET_NOTIFICATIONS,
    safeAddress,
  };
}

export function getNotificationsSuccess(notifications, hasSeen, log) {
  return {
    type: GET_NOTIFICATIONS_SUCCESS,
    notifications,
    hasSeen,
    log,
  };
}

export function getNotificationsError(error) {
  return {
    type: GET_NOTIFICATIONS_ERROR,
    error,
  };
}

export function updateNotificationStatus(safeAddress) {
  return {
    type: UPDATE_NOTIFICATION_STATUS,
    safeAddress,
  };
}

export function updateNotificationStatusSuccess(notifications, hasSeen, log) {
  return {
    type: UPDATE_NOTIFICATION_STATUS_SUCCESS,
    notifications,
    hasSeen,
    log,
  };
}

export function updateNotificationStatusError(error) {
  return {
    type: UPDATE_NOTIFICATION_STATUS_ERROR,
    error,
  };
}
