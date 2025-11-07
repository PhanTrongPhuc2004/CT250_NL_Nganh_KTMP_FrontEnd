// import { defineStore } from "pinia";
// import axios from "axios";

// export const useUserStore = defineStore("user", {
//   state: () => ({
//     user: null,
//     loading: false,
//   }),

//   actions: {
//     async checkAuth() {
//       this.loading = true;
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/check`,
//           {
//             withCredentials: true,
//           }
//         );
//         this.user = res.data.user;
//       } catch (err) {
//         this.user = null;
//         console.log("Chưa đăng nhập");
//       } finally {
//         this.loading = false;
//       }
//     },

//     async login(credentials) {
//       try {
//         const res = await axios.post(
//           `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/login`,
//           credentials,
//           {
//             withCredentials: true,
//           }
//         );
//         await this.checkAuth();
//         return true;
//       } catch (error) {
//         console.error(error);
//         return false;
//       }
//     },
//     setUser(userData) {
//       this.user = userData;
//       localStorage.setItem("user", JSON.stringify(userData)); // ✅ lưu user đúng tên
//     },

//     async logout() {
//       try {
//         await axios.post(
//           `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/logout`,
//           {},
//           { withCredentials: true }
//         );
//         window.location.href = "/";
//       } catch {}
//       this.user = null;
//     },
//     setUser(userData) {
//       this.user = userData;
//       localStorage.setItem("vaiTro", JSON.stringify(userData));
//     },
//     async fetchUser() {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/me`,
//           {
//             withCredentials: true,
//           }
//         );
//         this.user = res.data;
//       } catch (err) {
//         this.user = null;
//       }
//     },
//   },
// });

import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
  }),

  actions: {
    async checkAuth() {
      this.loading = true;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/check`,
          { withCredentials: true }
        );
        this.user = res.data.user || null;
      } catch {
        this.user = null;
        console.log("Chưa đăng nhập");
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/login`,
          credentials,
          { withCredentials: true }
        );

        // ✅ Cập nhật user từ checkAuth hoặc response
        await this.checkAuth();
        if (!this.user && res.data?.user) this.user = res.data.user;

        if (this.user) {
          this.setUser(this.user);

          // 🔄 Merge giỏ hàng guest sang user
          const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
          const userCartKey = `cart_${this.user.tenDangNhap}`;
          const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

          if (guestCart.length > 0) {
            const mergedCart = [...userCart];

            guestCart.forEach((item) => {
              const index = mergedCart.findIndex((i) => i.maSanPham === item.maSanPham);
              if (index > -1) {
                mergedCart[index].quantity += item.quantity;
              } else {
                mergedCart.push(item);
              }
            });

            localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
            localStorage.removeItem("cart_guest");
          }
        }

        return true;
      } catch (error) {
        console.error("Đăng nhập thất bại:", error);
        return false;
      }
    },

    async logout() {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/logout`,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Lỗi đăng xuất:", err);
      }
      this.user = null;
      localStorage.removeItem("user");
      window.location.href = "/";
    },

    setUser(userData) {
      this.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
    },
  },
});
