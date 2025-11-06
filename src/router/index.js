import { createRouter, createWebHistory } from "vue-router";
// Import các component bạn muốn điều hướng
import Home from "@/pages/user/home/Home.vue";
import CauthuDetail from "@/pages/user/player/CauthuDetail.vue";
import CauthuList from "@/pages/user/player/CauthuList.vue";
import HuanLuyenVien from "@/pages/user/player/HuanLuyenVien.vue";
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
import HopDongManage from "@/pages/admin/component/HopDongManage.vue";

import axios from "axios";
import UserProfile from "@/pages/common/userProfile/UserProfile.vue";
import ClubManagement from "@/pages/admin/clubManagement/ClubManagement.vue";
import CompeteManagement from "@/pages/admin/competeManagement/CompeteManagement.vue";
import SeasonDetail from "@/pages/admin/seasonDetail/SeasonDetail.vue";
import TournamentDetail from "@/pages/admin/tournamentDetail/TournamentDetail.vue";
import Dashboard from "@/pages/admin/dashboard/Dashboard.vue";
import SquadManagement from "@/pages/admin/squadManagement/SquadManagement.vue";
import SquadDetail from "@/pages/admin/squadDetail/SquadDetail.vue";
import Notifivation from "@/pages/user/notification/Notifivation.vue";
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
  { path: "/huanluyenvien/:id", component: HuanLuyenVien },
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
  {
    path: "/notifications",
    component: Notifivation,
    name: "Thông báo",
    meta: { requiresAuth: true, user: true },
  },
];
const adminRouter = [
  {
    path: "/admin",
    name: "Admin",
    component: Dashboard,
    meta: { admin: true, hidden: true },
    icon: ["fas", "gauge"], // faGauge (bảng điều khiển)
  },
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { admin: true },
    icon: ["fas", "gauge"],
  },
  {
    path: "/admin/clubs",
    name: "Quản lý thông tin câu lạc bộ",
    component: ClubManagement,
    meta: { admin: true },
    icon: ["fas", "shield-alt"], // faShieldAlt
  },
  {
    path: "/admin/users",
    name: "Quản lý người dùng",
    component: UserManagement,
    meta: { admin: true },
    icon: ["far", "user"], // faUser (regular)
  },
  {
    path: "/admin/tournaments",
    name: "Quản lý giải đấu",
    component: UserManagement,
    meta: { admin: true, hidden: true },
    icon: ["fas", "medal"], // faMedal
  },
  {
    path: "/admin/compete",
    name: "Quản lý thi đấu",
    component: CompeteManagement,
    meta: { admin: true },
    icon: ["fas", "trophy"], // faTrophy
  },
  {
    path: "/admin/squad",
    name: "Quản lý đội hình",
    component: SquadManagement,
    meta: { admin: true },
    icon: ["fas", "users"], // faUsers
  },
  {
    path: "/admin/squad/:squadId",
    name: "Quản lý chi tiết đội hình",
    component: SquadDetail,
    meta: { admin: true, hidden: true },
    icon: ["fas", "user-group"],
  },
  {
    path: "/admin/compete/seasons/:seasonId",
    name: "Quản lý mùa giải",
    component: SeasonDetail,
    meta: { admin: true, hidden: true },
    icon: ["fas", "calendar-alt"], // faCalendarAlt
  },
  {
    path: "/admin/posts",
    name: "Quản lý bài viết",
    component: UserManagement,
    meta: { admin: true },
    icon: ["fas", "newspaper"], // faNewspaper
  },
  {
    path: "/admin/qualuuniem",
    name: "Quản lý hàng lưu niệm",
    component: qualuuniem,
    meta: { admin: true },
    icon: ["fas", "gift"], // faGift
  },
  {
    path: "/admin/qualuuniem/donhang",
    component: donhang,
    name: "Quản lý đơn hàng",
    meta: { admin: true },
    icon: ["fas", "box-open"], // faBoxOpen
  },
  {
    path: "/admin/tickets",
    name: "Quản lý vé",
    component: UserManagement,
    meta: { admin: true },
    icon: ["fas", "ticket-alt"], // faTicketAlt
  },
  {
    path: "/admin/statistics",
    name: "Thống kê",
    component: UserManagement,
    meta: { admin: true },
    icon: ["fas", "chart-bar"], // faChartBar
  },
  {
    path: "/admin/compete/seasons/:id/tournaments/:tournamentId",
    name: "Quản lý giải đấu",
    component: TournamentDetail,
    meta: { admin: true, hidden: true },
    icon: ["fas", "medal"],
  },
  {
    path: "/admin/hopdong",
    name: "Quản lý hợp đồng",
    component: HopDongManage,
    meta: { admin: true },
    icon: ["fas", "file-contract"], // faFileContract
  },
  {
    path: "/admin/tickets",
    name: "Quản lý vé",
    component: () =>
      import("@/pages/admin/ticketManagement/TicketManagement.vue"),
    meta: { admin: true },
    icon: ["fas", "ticket-alt"],
  },
];

const routes = [...userRouter, ...adminRouter, ...commonRouter];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/me`,
      {
        withCredentials: true,
      }
    );
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
