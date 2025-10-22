import { createRouter, createWebHistory } from "vue-router";
// Import các component bạn muốn điều hướng
import Home from "@/pages/user/home/Home.vue";
import CauthuDetail from "@/pages/user/player/CauthuDetail.vue";
import CauthuList from "@/pages/user/player/CauthuList.vue";
import Sticket from "@/pages/user/sticket/Sticket.vue";
import UserManagement from "@/pages/admin/userManagement/UserManagement.vue";
import { useUserStore } from "@/stores/userStore";
import ProfilePage from '@/pages/user/player/ProfilePage.vue';
import axios from "axios";
const userRouter = [
  {
    path: "/",
    name: "Trang chủ",
    component: Home,
  },
  { path: "/cauthu",
    name: "Cầu Thủ",
    component: CauthuList },
  { path: "/cauthu/:id", 
    component: CauthuDetail },
  {
    path: "/ve",
    name: "Vé",
    component: Sticket,
  },
  {
    path: '/profile',
    // name: 'Thông tin cá nhân',
    component: ProfilePage,
    meta: { requiresAuth: true }, // nếu bạn muốn bảo vệ route này
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
    path: "/admin/users",
    name: "Quản lý người dùng",
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
    if (to.meta?.admin && vaiTro !== "Admin") {
      return "/";
    }
    if (!to.meta?.admin && vaiTro == "Admin") {
      return "/admin";
    }
  } catch (err) {
    console.log("Lỗi fetch user:", err);
    if (to.meta?.admin) return "/";
  }
});

export { userRouter, adminRouter };
export default router;
