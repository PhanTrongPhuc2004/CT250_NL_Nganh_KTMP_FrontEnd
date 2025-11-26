// src/stores/authStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import instance from "@/utils/axios";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref(localStorage.getItem("accessToken") || "");
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const isAuthenticated = computed(() => !!accessToken.value);

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      if (accessToken.value) {
        config.headers.Authorization = `Bearer ${accessToken.value}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - FIXED
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Chỉ xử lý lỗi 401 và chưa thử refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log("🔄 Token hết hạn, đang refresh...");
          const newToken = await refreshAccessToken();

          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("❌ Refresh token thất bại:", refreshError);
          // Clear auth data nhưng không redirect ngay
          clearAuthData();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Hàm refresh token - FIXED
  const refreshAccessToken = async () => {
    try {
      console.log("🔄 Đang gọi refresh token...");

      const response = await instance.post(
        "/nguoidung/refresh-token",
        {},
        { withCredentials: true }
      );

      if (!response.data.accessToken) {
        throw new Error("Không nhận được access token mới");
      }

      // Lưu token mới
      accessToken.value = response.data.accessToken;
      localStorage.setItem("accessToken", response.data.accessToken);

      console.log("✅ Refresh token thành công");
      return response.data.accessToken;
    } catch (error) {
      console.error("❌ Lỗi refresh token:", error);

      // Nếu refresh thất bại, clear all data
      clearAuthData();
      throw error;
    }
  };

  // Hàm clear auth data
  const clearAuthData = () => {
    accessToken.value = "";
    user.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // Hàm login - FIXED
  const login = async (credentials) => {
    try {
      const response = await instance.post("/nguoidung/login", credentials, {
        withCredentials: true,
      });

      // Lưu data
      accessToken.value = response.data.accessToken;
      user.value = response.data.user;
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("✅ Đăng nhập thành công");
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      throw error;
    }
  };

  // Hàm logout - FIXED
  const logout = async () => {
    try {
      await instance.post("/nguoidung/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Lỗi khi logout:", error);
    } finally {
      clearAuthData();
      window.location.href = "/login";
    }
  };

  // Hàm kiểm tra auth status - FIXED
  const checkAuth = async () => {
    try {
      const response = await instance.get("/nguoidung/me");
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));
      return true;
    } catch (error) {
      console.log("❌ Không thể xác thực, token có thể đã hết hạn");

      // Không clear data ngay, để interceptor xử lý
      if (error.response?.status === 401) {
        console.log("⚠️ Token không hợp lệ");
      }
      return false;
    }
  };

  return {
    accessToken,
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    refreshAccessToken,
    clearAuthData,
  };
});
