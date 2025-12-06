// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BE_BASE_URL || "http://localhost:5000",
  withCredentials: true, // BẮT BUỘC
});

// Queue xử lý refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Chỉ xử lý 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đang có người khác refresh → chờ
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi refresh token
        await instance.post("/nguoidung/refresh-token", {}, { withCredentials: true });

        // Đợi browser nhận cookie mới
        await new Promise((resolve) => setTimeout(resolve, 300));

        processQueue(null);
        isRefreshing = false;

        // QUAN TRỌNG: Đảm bảo request retry có withCredentials
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token thất bại → Đăng xuất người dùng");
        processQueue(refreshError, null);
        isRefreshing = false;

        // TÙY CHỌN: Xử lý logout (xóa token, redirect login)
        // localStorage.clear();
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;