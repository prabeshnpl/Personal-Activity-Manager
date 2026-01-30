import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useErrorStore } from "../stores/errorStore";
import { useOrganizationStore } from "../stores/organizationStore";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

/* ---------------------------------------
   Axios Instance
--------------------------------------- */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // "X-ORG-ID": useAuthStore.getState().active_org,
  },
});

/* ---------------------------------------
   Request Interceptor
--------------------------------------- */
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    const orgId = useOrganizationStore.getState().activeOrganization?.id 

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (orgId) {
      config.headers["X-ORG-ID"] = orgId ;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------------------------------
   Refresh Token Queue
--------------------------------------- */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
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

    /* Network Error */
    if (!error.response) {
      errorStore.setError({
        message: "Network error. Please check your connection.",
        status: null,
      });
      return Promise.reject(error);
    }

    /* ---------------------------------------
       401 → Try Refresh Token
    --------------------------------------- */
    if (
      status === 401 &&
      !originalRequest._retry &&
      authStore.refreshToken
    ) {
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
        console.log("trying refetching of access token")
        const res = await axios.post(
          `${BASE_URL}token/refresh/`,
          { refresh: authStore.refreshToken }
        );

        const newAccessToken = res.data.access;

        authStore.login({
          access: newAccessToken,
          refresh: authStore.refreshToken,
          user: authStore.user,
        });

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
