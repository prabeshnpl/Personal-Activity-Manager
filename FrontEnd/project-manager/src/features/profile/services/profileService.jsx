import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const profileService = {

  updateProfile: (data, userId) =>
    api.patch(`${ENDPOINTS.PROFILE}/${userId}/`, data),

  uploadProfilePicture: (file, userId) => {
    const formData = new FormData();
    // include filename to ensure correct form part metadata
    formData.append('profile_picture', file, file?.name || 'profile.jpg');
    // Let axios set Content-Type and boundary automatically
    return api.patch(`${ENDPOINTS.PROFILE}/${userId}/`, formData);
  },

  deleteProfilePicture: () =>
    api.delete(`${ENDPOINTS.PROFILE}/picture/`),

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