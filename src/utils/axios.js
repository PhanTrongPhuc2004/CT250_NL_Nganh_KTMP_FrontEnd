// utils/axios.js
import axios from "axios";
import { getMe } from ".";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BE_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {

        await instance.post(
          "/nguoidung/refresh-token",
          {},
          {
            withCredentials: true,
            _skipRetry: true,
          }
        );


        // Đợi browser xử lý cookie mới
        await new Promise((resolve) => setTimeout(resolve, 300));

        processQueue(null);
        isRefreshing = false;

        // Retry request gốc
        return instance(originalRequest);
      } catch (refreshError) {
        console.error(
          "❌ Interceptor: Refresh token thất bại:",
          refreshError?.response?.status
        );

        processQueue(refreshError, null);
        isRefreshing = false;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
