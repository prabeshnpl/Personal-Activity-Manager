import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const profileService = {

  updateProfile: (data, userId) =>
    api.patch(`${ENDPOINTS.PROFILE}/${userId}/`, data),

  uploadProfilePicture: (file, userId) => {
    if (!file) {
      return api.patch(`${ENDPOINTS.PROFILE}/${userId}/`, {
        profile_picture: null,
      });
    }
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.patch(`${ENDPOINTS.PROFILE}/${userId}/`, formData);
  },

  // Fetch current authenticated user
  getMe: () => api.get(`${ENDPOINTS.ME}/`),

  // Password
  changePassword: (data) =>
    api.post(`${ENDPOINTS.CHANGE_PASSWORD}/`, data),

  // Account
  deleteAccount: () =>
    api.delete(`${ENDPOINTS.PROFILE}/`),

  // Sessions
  getActiveSessions: () =>
    api.get(`${ENDPOINTS.PROFILE}/sessions/`),

  revokeSession: (sessionId) =>
    api.delete(`${ENDPOINTS.PROFILE}/sessions/${sessionId}/`),
};
