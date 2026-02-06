import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useErrorStore } from "../stores/errorStore";
import { useOrganizationStore } from "../stores/organizationStore";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

const AUTH_EXCLUDED_PATHS = [
  "/auth/login/",
  "/auth/token/refresh/",
  "/auth/logout/",
];

/* ---------------------------------------
   Axios Instance
--------------------------------------- */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This automatically sets incoming response cookies and sends them on every requests
});

// Remove default Content-Type for FormData requests
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

/* ---------------------------------------
   Request Interceptor
--------------------------------------- */
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    const orgId =
      useOrganizationStore.getState().activeOrganization?.id;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (orgId) {
      config.headers["X-ORG-ID"] = orgId;
    }

    return config;
  },
  Promise.reject
);

/* ---------------------------------------
   Refresh Queue Logic
--------------------------------------- */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, accessToken = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(accessToken);
  });
  failedQueue = [];
};

/* ---------------------------------------
   Response Interceptor
--------------------------------------- */
api.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const authStore = useAuthStore.getState();
    const errorStore = useErrorStore.getState();

    /* Network error */
    if (!error.response) {
      errorStore.setError({
        message: "Network error. Please check your connection.",
        status: null,
      });
      return Promise.reject(error);
    }

    /* ---------------------------------------
       401 → Refresh Access Token
    --------------------------------------- */
    const AUTH_EXCLUDED_PATHS = [
      "/login/",
      "/token/refresh/",
      "/logout/",
    ];

    if (status === 401 && !originalRequest._retry) {

      const isAuthEndpoint = AUTH_EXCLUDED_PATHS.some((path) =>
        originalRequest.url.includes(path)
      );

      if (!authStore.accessToken || isAuthEndpoint) {
        authStore.logout();
        errorStore.setError({
          message: error.response?.data?.detail || "Access Denied",
          status: 401,
        });
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/token/refresh/");
        const newAccessToken = res.data.access;

        authStore.setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    /* ---------------------------------------
       Other Errors
    --------------------------------------- */
    let message = "An error occurred";

    switch (status) {
      case 400:
        message = error.response?.data?.detail || "Bad request";
        break;
      case 401:
        message = error.response?.data?.detail || "Access Denied";
      case 403:
        message = "You do not have permission to perform this action.";
        break;
      case 404:
        message = "Requested resource not found.";
        break;
      case 500:
        message = "Server error. Please try later.";
        break;
    }

    errorStore.setError({ message, status });

    return Promise.reject({
      message,
      status,
      raw: error,
    });
  }
);

export default api;
