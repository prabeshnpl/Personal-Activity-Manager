import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const notificationService = {
  // List notifications
  getNotifications: (params) =>
    api.get(`${ENDPOINTS.NOTIFICATIONS}/`, { params }),

  // Get single notification
  getNotificationById: (id) =>
    api.get(`${ENDPOINTS.NOTIFICATIONS}/${id}/`),

  // Unread count (for badge)
  getUnreadCount: () =>
    api.get(`${ENDPOINTS.NOTIFICATIONS}/unread-count/`),

  // Mark single as read
  markAsRead: (id) =>
    api.post(`${ENDPOINTS.NOTIFICATIONS}/${id}/mark_as_read/`),

  // Mark all as read
  markAllAsRead: () =>
    api.post(`${ENDPOINTS.NOTIFICATIONS}/mark_all_as_read/`),

  // Delete single notification
  deleteNotification: (id) =>
    api.delete(`${ENDPOINTS.NOTIFICATIONS}/${id}/`),

  // Clear all read notifications
  clearReadNotifications: () =>
    api.delete(`${ENDPOINTS.NOTIFICATIONS}/clear-read/`),

  // Notification preferences (future settings page)
  getPreferences: () =>
    api.get(`${ENDPOINTS.NOTIFICATIONS}/preferences/`),

  updatePreferences: (data) =>
    api.put(`${ENDPOINTS.NOTIFICATIONS}/preferences/`, data),
};