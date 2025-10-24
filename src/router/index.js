import { createRouter, createWebHistory } from "vue-router";
// Import các component bạn muốn điều hướng
import Home from "@/pages/user/home/Home.vue";
import Player from "@/pages/user/player/Player.vue";
import Sticket from "@/pages/user/sticket/Sticket.vue";
import UserManagement from "@/pages/admin/userManagement/UserManagement.vue";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
const userRouter = [
  {
    path: "/",
    name: "Trang chủ",
    component: Home,
  },
  {
    path: "/cau-thu",
    name: "Cầu thủ",
    component: Player,
  },
  {
    path: "/ve",
    name: "Vé",
    component: Sticket,
  },
];
const adminRouter = [
  {
    path: "/admin",
    name: "Dashboard",
    component: UserManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/clubs",
    name: "Quản lý thông tin câu lạc bộ",
    component: UserManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/users",
    name: "Quản lý người dùng",
    component: UserManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/tournaments",
    name: "Quản lý giải đấu",
    component: UserManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/matches",
    name: "Quản lý trận đấu",
    component: UserManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/posts",
    name: "Quản lý bài viết",
    component: UserManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/merchandise",
    name: "Quản lý hàng lưu niệm",
    component: UserManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/tickets",
    name: "Quản lý vé",
    component: UserManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/statistics",
    name: "Thống kê",
    component: UserManagement,
    meta: { admin: true },
  },
];
const routes = [...userRouter, ...adminRouter];
const router = createRouter({
  history: createWebHistory(), // có thể dùng createWebHashHistory()
  routes,
});

router.beforeEach(async (to, from) => {
  try {
    const res = await axios.get("http://localhost:5000/nguoidung/me", {
      withCredentials: true,
    });

    const user = res.data;
    const vaiTro = user.vaiTro;
    console.log(vaiTro);
    if (to.meta?.admin && vaiTro !== "admin") {
      return "/";
    }
    if (!to.meta?.admin && vaiTro == "admin") {
      return "/admin";
    }
  } catch (err) {
    console.log("Lỗi fetch user:", err);
    if (to.meta?.admin) return "/";
  }
});

export { userRouter, adminRouter };
export default router;
