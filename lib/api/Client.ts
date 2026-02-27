import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/refresh-token`,
          { refreshToken },
        );

        Cookies.set("accessToken", response.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return api(originalRequest);
      } catch {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
