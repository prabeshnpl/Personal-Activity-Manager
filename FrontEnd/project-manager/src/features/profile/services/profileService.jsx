import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";
import { useAuthStore } from "../../../stores/authStore";

export const profileService = {
  
  // Profile
  getProfile: () => {
    const { user: currentUser } = useAuthStore();
    return api.get(`${ENDPOINTS.PROFILE}/${currentUser?.id}`)
  },

  updateProfile: (data) =>
    api.put(`${ENDPOINTS.PROFILE}/`, data),

  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.post(`${ENDPOINTS.PROFILE}/upload-picture/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteProfilePicture: () =>
    api.delete(`${ENDPOINTS.PROFILE}/picture/`),

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