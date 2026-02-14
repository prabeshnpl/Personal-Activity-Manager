// src/features/auth/services/authService.js
import api from "../../../api/apiClient";

export const authService = {
  login: (data) =>
    api.post("login/", data),

  register: (data) =>
    api.post("register/", data),

  logout: () =>
    api.post("logout/"),
    
};
