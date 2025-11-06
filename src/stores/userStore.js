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
          {
            withCredentials: true,
          }
        );
        this.user = res.data.user;
      } catch (err) {
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
          {
            withCredentials: true,
          }
        );
        await this.checkAuth();
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    // async logout() {
    //   try {
    //     await axios.post(
    //       "${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/logout",
    //       {},
    //       { withCredentials: true }
    //     );
    //   } catch {}
    //   this.user = null;
    // },
    // setUser(userData) {
    //   this.user = userData;
    //   localStorage.setItem("vaiTro", JSON.stringify(userData));
    // },
    setUser(userData) {
      this.user = userData;
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ lưu user đúng tên
    },

    async logout() {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/logout`,
          {},
          { withCredentials: true }
        );
        window.location.href = "/";
      } catch {}
      this.user = null;
    },
    setUser(userData) {
      this.user = userData;
      localStorage.setItem("vaiTro", JSON.stringify(userData));
    },
    async fetchUser() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/me`,
          {
            withCredentials: true,
          }
        );
        this.user = res.data;
      } catch (err) {
        this.user = null;
      }
    },
  },
});
