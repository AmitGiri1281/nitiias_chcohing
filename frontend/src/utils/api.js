import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { tokenService } from "./tokenService";

// Create axios instance
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        tokenService.setToken(res.data.token);

        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;

        return api(originalRequest);
      } catch (err) {
        tokenService.removeToken();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);