import { defineStore } from "pinia";
import axios from '@/utils/axios'; // DÙNG AXIOS đã được cấu hình bổ sung cookie

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
  }),

  actions: {
    async checkAuth() {
      this.loading = true;
      try {
        const res = await axios.get("/nguoidung/check");
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
        await axios.post("/nguoidung/login", credentials);
        await this.checkAuth();
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    async logout() {
      try {
        await axios.post("/nguoidung/logout");
        this.user = null;
        window.location.href = "/";
      } catch (err) {
        console.error(err);
      }
    },

    async fetchUser() {
      try {
        const res = await axios.get("/nguoidung/me");
        this.user = res.data;
      } catch (err) {
        this.user = null;
      }
    },
  },
});