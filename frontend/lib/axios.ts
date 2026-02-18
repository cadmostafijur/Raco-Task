import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken,
          });
          if (data.success && data.data.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("refreshToken", data.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
