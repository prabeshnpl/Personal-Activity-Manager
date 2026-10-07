import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useErrorStore } from "../stores/errorStore";
import { useOrganizationStore } from "../stores/organizationStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const AUTH_EXCLUDED_PATHS = ["/login/", "/register/", "/token/refresh/", "/logout/"];

const normalizePath = (path = "") => path.replace(/^\/+|\/+$/g, "");
const isAuthPath = (url = "") => {
  const normalizedUrl = normalizePath(url);
  return AUTH_EXCLUDED_PATHS.some((path) =>
    normalizedUrl.includes(normalizePath(path))
  );
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

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
    const isAuthEndpoint = isAuthPath(config.url);
    const shouldSkipAuth = config.skipAuth === true;

    if (accessToken && !isAuthEndpoint && !shouldSkipAuth) {
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
    if (status === 401 && !originalRequest._retry && !originalRequest.skipRefreshRetry) {

      const isAuthEndpoint = isAuthPath(originalRequest.url);

      if (!authStore.accessToken || isAuthEndpoint) {
        authStore.logout();
        errorStore.setError({
          message: error.response?.data?.detail || "Access Denied",
          status: 401,
        });
        redirectToLogin();
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
        const res = await api.post("token/refresh/", null, {
          withCredentials: true,
          skipAuth: true,
          skipRefreshRetry: true,
        });
        const newAccessToken = res?.access;

        if (!newAccessToken) {
          throw new Error("Refresh response missing access token");
        }

        authStore.setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.logout();
        redirectToLogin();
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
        break;
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
