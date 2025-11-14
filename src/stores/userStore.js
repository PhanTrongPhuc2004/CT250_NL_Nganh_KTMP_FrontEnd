// stores/userStore.js
import { defineStore } from "pinia";
import axios from "@/utils/axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
    authChecked: false,
    initializeError: null,
  }),

  actions: {
    async initialize() {
      console.log("🔄 Store: Bắt đầu initialize...");

      if (this.loading) {
        console.log("⏳ Store: Đang loading, bỏ qua...");
        return;
      }

      this.loading = true;
      this.initializeError = null;

      try {
        await this.checkAuth();
        console.log("✅ Store: Initialize thành công");
      } catch (error) {
        console.error("❌ Store: Initialize thất bại:", error);
        this.initializeError = error;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      console.log("🔄 Store: Đang checkAuth...");

      try {
        const res = await axios.get("/nguoidung/check", {
          withCredentials: true,
        });

        this.user = res.data.user;
        this.authChecked = true;
        console.log(
          "✅ Store: CheckAuth thành công - User:",
          this.user?.tenDangNhap
        );
        return true;
      } catch (err) {
        this.user = null;
        this.authChecked = true;

        if (err.response?.status === 401) {
          console.log(
            "🔐 Store: Token không hợp lệ - Interceptor sẽ xử lý refresh"
          );
        } else {
          console.error("❌ Store: CheckAuth thất bại:", err.message);
        }

        return false;
      }
    },

    async login(credentials) {
      try {
        this.loading = true;
        const response = await axios.post("/nguoidung/login", credentials, {
          withCredentials: true,
        });

        this.user = response.data.user;
        console.log("✅ Đăng nhập thành công:", this.user?.tenDangNhap);

        this.mergeCart();
        return true;
      } catch (error) {
        console.error("Đăng nhập thất bại:", error);
        this.user = null;
        return false;
      } finally {
        this.loading = false;
      }
    },

    mergeCart() {
      if (!this.user) return;

      const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
      const userCartKey = `cart_${this.user.tenDangNhap}`;
      const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

      if (guestCart.length > 0) {
        const mergedCart = [...userCart];

        guestCart.forEach((item) => {
          const index = mergedCart.findIndex(
            (i) => i.maSanPham === item.maSanPham
          );
          if (index > -1) {
            mergedCart[index].quantity += item.quantity;
          } else {
            mergedCart.push(item);
          }
        });

        localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
        localStorage.removeItem("cart_guest");
        console.log("✅ Đã merge giỏ hàng");
      }
    },

    async logout() {
      try {
        await axios.post(
          "/nguoidung/logout",
          {},
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.error("Lỗi logout:", err);
      } finally {
        this.user = null;
        this.authChecked = false;

        // Clear cart
        if (this.user?.tenDangNhap) {
          localStorage.removeItem(`cart_${this.user.tenDangNhap}`);
        }
        localStorage.removeItem("cart_guest");

        window.location.href = "/";
      }
    },

    // ✅ XÓA các hàm không cần thiết
    // refreshToken(), handleAuthFailure() - để interceptor xử lý
  },
});
