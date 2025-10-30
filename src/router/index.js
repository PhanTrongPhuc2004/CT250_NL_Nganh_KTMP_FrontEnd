import { createRouter, createWebHistory } from "vue-router";
// Import các component bạn muốn điều hướng
import Home from "@/pages/user/home/Home.vue";
import CauthuDetail from "@/pages/user/player/CauthuDetail.vue";
import CauthuList from "@/pages/user/player/CauthuList.vue";
import Sticket from "@/pages/user/sticket/Sticket.vue";
import UserManagement from "@/pages/admin/userManagement/UserManagement.vue";
import { useUserStore } from "@/stores/userStore";
import ProfilePage from "@/pages/user/player/ProfilePage.vue";

import Shop from "@/pages/user/player/Shop.vue";
import ProductDetail from "@/pages/user/player/SanPhamDetail.vue";
import Cart from "@/pages/user/player/GioHang.vue";
import checkout from "@/pages/user/player/ThanhToan.vue";
import orders from "@/pages/user/player/Donhang.vue";

import qualuuniem from "@/pages/admin/component/QuaLuuNiemPage.vue";
import donhang from "@/pages/admin/component/DonHangPage.vue";

import axios from "axios";
import UserProfile from "@/pages/common/userProfile/UserProfile.vue";
import ClubManagement from "@/pages/admin/clubManagement/ClubManagement.vue";
import CompeteManagement from "@/pages/admin/competeManagement/CompeteManagement.vue";
import SeasonDetail from "@/pages/admin/seasonDetail/SeasonDetail.vue";
import TournamentCard from "@/components/common/cards/tournamentCard/TournamentCard.vue";
import TournamentDetail from "@/pages/admin/tournamentDetail/TournamentDetail.vue";
const commonRouter = [
  {
    path: "/profile",
    name: "Thông tin cá nhân",
    component: UserProfile,
    meta: { requiresAuth: true, common: true, user: false }, // ✅ route dùng chung cho mọi vai trò
  },
];

const userRouter = [
  {
    path: "/",
    name: "Trang chủ",
    component: Home,
    meta: { requiresAuth: false, user: true }, // 🚫 route không yêu cầu đăng nhập
  },
  {
    path: "/cauthu",
    name: "Cầu Thủ",
    component: CauthuList,
    meta: { requiresAuth: false, user: true },
  },
  { path: "/cauthu/:id", component: CauthuDetail },
  {
    path: "/ve",
    name: "Vé",
    component: Sticket,
    meta: { requiresAuth: false, user: true },
  },
  {
    path: "/shop",
    component: Shop,
    name: "Shop",
    meta: { requiresAuth: true, user: true },
  },
  { path: "/shop/:id", component: ProductDetail },
  { path: "/cart", component: Cart },
  { path: "/checkout", component: checkout },
  { path: "/orders", component: orders },
];
const adminRouter = [
  {
    path: "/admin/clubs",
    name: "Quản lý thông tin câu lạc bộ",
    component: ClubManagement,
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
    meta: { admin: true, hidden: true },
  },
  {
    path: "/admin/compete",
    name: "Quản lý thi đấu",
    component: CompeteManagement,
    meta: { admin: true },
  },
  {
    path: "/admin/compete/seasons/:id",
    name: "Quản lý mùa giải",
    component: SeasonDetail,
    meta: { admin: true, hidden: true },
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
  {
    path: "/admin/compete/seasons/:id/tournaments/:tournamentId",
    name: "Quản lý giải đấu",
    component: TournamentDetail,
    meta: { admin: true, hidden: true },
  },
];
const routes = [...userRouter, ...adminRouter, ...commonRouter];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  try {
    const res = await axios.get("http://localhost:5000/nguoidung/me", {
      withCredentials: true,
    });
    const user = res.data;
    const vaiTro = user.vaiTro;

    // Nếu route chỉ dành cho admin
    if (to.meta?.admin && vaiTro !== "admin") {
      return { path: "/" };
    }

    // Nếu admin cố vào trang user, trừ khi đó là route chung
    if (!to.meta?.admin && !to.meta?.common && vaiTro === "admin") {
      return { path: "/admin" };
    }
  } catch (err) {
    console.log("Lỗi fetch user:", err);
    if (to.meta?.requiresAuth) {
      return { path: "/" };
    }
  }
});

export { userRouter, adminRouter, commonRouter };
export default router;
