// src/features/auth/services/authService.js
import api from "../../../api/apiClient";
import { useAuthStore } from "../../../stores/authStore";

export const authService = {
  login: (data) =>
    api.post("login/", data),

  register: (data) =>
    api.post("register/", data),

  logout: () => {
    const refresh = useAuthStore.getState().refreshToken;
    api.post("logout/", {
      refresh,
    });
  },
    
};
