// // src/router/index.js
// import { createRouter, createWebHistory } from "vue-router";

// // Import các component bạn muốn điều hướng
// import Home from "@/pages/user/home/Home.vue";
// import CauthuDetail from "@/pages/user/player/CauthuDetail.vue";
// import CauthuList from "@/pages/user/player/CauthuList.vue";
// import HuanLuyenVien from "@/pages/user/player/HuanLuyenVien.vue";

// import TicketPurchase from "@/pages/user/ticketPurchase/TicketPurchase.vue";

// import UserManagement from "@/pages/admin/userManagement/UserManagement.vue";
// import { useUserStore } from "@/stores/userStore";
// import ProfilePage from "@/pages/user/player/ProfilePage.vue";

// import Shop from "@/pages/user/player/Shop.vue";
// import ProductDetail from "@/pages/user/player/SanPhamDetail.vue";
// import Cart from "@/pages/user/player/GioHang.vue";
// import checkout from "@/pages/user/player/ThanhToan.vue";
// import orders from "@/pages/user/player/Donhang.vue";

// import qualuuniem from "@/pages/admin/component/QuaLuuNiemPage.vue";
// import donhang from "@/pages/admin/component/DonHangPage.vue";
// import HopDongManage from "@/pages/admin/component/HopDongManage.vue";
// import ThongKe from "@/pages/admin/component/ThongKe.vue";
// import TinTucManage from "@/pages/admin/component/TinTucManage.vue";

// import axios from "axios";
// import UserProfile from "@/pages/common/userProfile/UserProfile.vue";
// import ClubManagement from "@/pages/admin/clubManagement/ClubManagement.vue";
// import CompeteManagement from "@/pages/admin/competeManagement/CompeteManagement.vue";
// import SeasonDetail from "@/pages/admin/seasonDetail/SeasonDetail.vue";
// import TournamentDetail from "@/pages/admin/tournamentDetail/TournamentDetail.vue";
// import Dashboard from "@/pages/admin/dashboard/Dashboard.vue";
// import SquadManagement from "@/pages/admin/squadManagement/SquadManagement.vue";
// import SquadDetail from "@/pages/admin/squadDetail/SquadDetail.vue";
// import Notifivation from "@/pages/user/notification/Notifivation.vue";
// import ClubTeamManagement from "@/pages/admin/clubTeamManagement/ClubTeamManagement.vue";
// import ClubTeamDetail from "@/pages/admin/clubTeamDetail/ClubTeamDetail.vue";

// const TicketRevenueStats = () =>
//   import("@/pages/admin/ticketRevenue/TicketRevenueStats.vue");
// const TicketManagement = () =>
//   import("@/pages/admin/ticketManagement/TicketManagement.vue");
// const TraingManagement = () =>
//   import("@/pages/user/trainingManagement/TrainingManagement.vue");
// const MyTickets = () => import("@/pages/user/ticketPurchase/MyTickets.vue");

// const commonRouter = [
//   {
//     path: "/profile",
//     name: "Thông tin cá nhân",
//     component: UserProfile,
//     meta: { requiresAuth: true, common: true, user: false },
//   },
// ];

// const userRouter = [
//   {
//     path: "/",
//     name: "Trang chủ",
//     component: Home,
//     meta: { requiresAuth: false, user: true },
//   },
//   {
//     path: "/cauthu",
//     name: "Cầu Thủ",
//     component: CauthuList,
//     meta: { requiresAuth: false, user: true },
//   },
//   { path: "/cauthu/:id", component: CauthuDetail },
//   { path: "/huanluyenvien/:id", component: HuanLuyenVien },
//   {
//     path: "/training",
//     name: "Lịch Tập Luyện",
//     component: TraingManagement,
//     meta: { requiresAuth: true, user: true },
//   },

//   {
//     path: "/ve",
//     name: "Mua Vé",
//     component: TicketPurchase,
//     meta: { requiresAuth: true, user: true, role: "nguoihammo" },
//   },

//   {
//     path: "/ve-cua-toi",
//     name: "Vé Của Tôi",
//     component: MyTickets,
//     meta: { requiresAuth: true, user: true, role: "nguoihammo" },
//   },

//   {
//     path: "/shop",
//     component: Shop,
//     name: "Shop",
//     meta: { requiresAuth: true, user: true },
//   },
//   { path: "/shop/:id", component: ProductDetail },
//   { path: "/cart", component: Cart },
//   { path: "/checkout", component: checkout },
//   { path: "/orders", component: orders },
//   {
//     path: "/notifications",
//     component: Notifivation,
//     name: "Thông báo",
//     meta: { requiresAuth: true, user: true },
//   },
// ];

// const adminRouter = [
//   {
//     path: "/admin",
//     name: "Admin",
//     component: Dashboard,
//     meta: { admin: true, hidden: true },
//     icon: ["fas", "gauge"],
//   },
//   // {
//   //   path: "/admin/dashboard",
//   //   name: "Dashboard",
//   //   component: Dashboard,
//   //   meta: { admin: true },
//   //   icon: ["fas", "gauge"],
//   // },
//   {
//     path: "/admin/clubs",
//     name: "Quản lý thông tin câu lạc bộ",
//     component: ClubManagement,
//     meta: { admin: true },
//     icon: ["fas", "shield-alt"],
//   },
//   {
//     path: "/admin/users",
//     name: "Quản lý người dùng",
//     component: UserManagement,
//     meta: { admin: true },
//     icon: ["far", "user"],
//   },
//   {
//     path: "/admin/compete",
//     name: "Quản lý thi đấu",
//     component: CompeteManagement,
//     meta: { admin: true },
//     icon: ["fas", "trophy"],
//   },
//   {
//     path: "/admin/clubteam",
//     name: "Quản lý đào tạo",
//     component: ClubTeamManagement,
//     meta: { admin: true },
//     icon: ["fas", "users"],
//   },
//   {
//     path: "/admin/clubteam/:clubTeamId",
//     name: "Quản lý chi tiết đội",
//     component: ClubTeamDetail,
//     meta: { admin: true, hidden: true },
//     icon: ["fas", "users"], // faUsers
//   },
//   {
//     path: "/admin/clubteam/:clubTeamId/squad/:squadId",
//     name: "Quản lý chi tiết đội hình",
//     component: SquadDetail,
//     meta: { admin: true, hidden: true },
//     icon: ["fas", "user-group"],
//   },
//   {
//     path: "/admin/compete/tournament/:tournamentId",
//     name: "Quản lý giải đấu",
//     component: TournamentDetail,
//     meta: { admin: true, hidden: true },
//     icon: ["fas", "calendar-alt"], // faCalendarAlt
//   },
//   {
//     path: "/admin/compete/tournament/:tournamentId/season/:seasonId",
//     name: "Quản lý mùa giải",
//     component: SeasonDetail,
//     meta: { admin: true, hidden: true },
//     icon: ["fas", "calendar-alt"],
//   },
//   {
//     path: "/admin/posts",
//     name: "Quản lý tin tức",
//     component: TinTucManage,
//     meta: { admin: true },
//     icon: ["fas", "newspaper"],
//   },
//   {
//     path: "/admin/qualuuniem",
//     name: "Quản lý hàng lưu niệm",
//     component: qualuuniem,
//     meta: { admin: true },
//     icon: ["fas", "gift"],
//   },
//   {
//     path: "/admin/qualuuniem/donhang",
//     component: donhang,
//     name: "Quản lý đơn hàng",
//     meta: { admin: true },
//     icon: ["fas", "box-open"],
//   },
//   {
//     path: "/admin/tickets",
//     name: "Quản lý vé",
//     component: TicketManagement,
//     meta: { admin: true },
//     icon: ["fas", "ticket-alt"],
//   },
//   {
//     path: "/admin/thongke",
//     name: "Thống kê doanh thu quà lưu niệm",
//     component: ThongKe,
//     meta: { admin: true },
//     icon: ["fas", "chart-bar"],
//   },
//   {
//     path: "/admin/ticket-revenue",
//     name: "Thống kê Doanh thu Vé",
//     component: TicketRevenueStats,
//     meta: { admin: true },
//     icon: ["fas", "chart-bar"],
//   },
//   {
//     path: "/admin/hopdong",
//     name: "Quản lý hợp đồng",
//     component: HopDongManage,
//     meta: { admin: true },
//     icon: ["fas", "file-contract"],
//   },
// ];

// // === TỔNG HỢP ROUTES ===
// const routes = [...userRouter, ...adminRouter, ...commonRouter];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// // === GUARD ===
// router.beforeEach(async (to, from) => {
//   try {
//     const res = await axios.get(
//       `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/me`,
//       { withCredentials: true }
//     );
//     const user = res.data;
//     const vaiTro = user.vaiTro;

//     if (to.meta?.admin && vaiTro !== "admin") {
//       return { path: "/" };
//     }

//     if (to.meta?.role && vaiTro !== to.meta.role) {
//       return { path: "/" };
//     }

//     if (!to.meta?.admin && !to.meta?.common && vaiTro === "admin") {
//       return { path: "/admin" };
//     }
//   } catch (err) {
//     console.log("Lỗi fetch user:", err);
//     if (to.meta?.requiresAuth) {
//       return { path: "/" };
//     }
//   }
// });

// export { userRouter, adminRouter, commonRouter };
// export default router;
//********************************************************************* */
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";

// Import tất cả routes
import { commonRoutes } from "./commonRoutes.js";
import { adminRoutes } from "./adminRoutes.js";
import { playerRoutes } from "./playerRoutes.js";
import { coachRoutes } from "./coachRoutes.js";
import { fanRoutes } from "./fanRoutes.js";

// Kết hợp tất cả routes
const routes = [
  ...commonRoutes,
  ...adminRoutes,
  ...playerRoutes,
  ...coachRoutes,
  ...fanRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Biến toàn cục để lưu user info sau khi refresh - PHẢI KHAI BÁO TRƯỚC
let currentUserAfterRefresh = null;

router.beforeEach(async (to, from, next) => {
  // THÊM next PARAMETER
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/me`,
      { withCredentials: true }
    );
    const user = res.data;
    const vaiTro = user.vaiTro;

    // Lưu user info
    currentUserAfterRefresh = user;

    console.log("vai tro cua user", vaiTro);

    if (to.meta?.admin && vaiTro !== "admin") {
      return next({ path: "/" });
    }

    if (to.meta?.role && vaiTro !== to.meta.role) {
      return next({ path: "/" });
    }

    if (!to.meta?.admin && !to.meta?.common && vaiTro === "admin") {
      return next({ path: "/admin" });
    }

    if (to.path === "/" && vaiTro === "admin") {
      return next({ path: "/admin" });
    }

    // THÊM next() CHO TRƯỜNG HỢP THÀNH CÔNG
    next();
  } catch (err) {
    console.log(
      "❌ Router: Lỗi fetch user:",
      err.response?.status,
      err.message
    );

    if (err.response?.status === 401) {
      try {
        console.log("🔄 Router: Phát hiện 401, thử refresh token...");

        // Gọi refresh token
        await axios.post(
          `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/refresh-token`,
          {},
          {
            withCredentials: true,
            _skipRetry: true,
          }
        );

        console.log("✅ Router: Refresh token thành công");

        // QUAN TRỌNG: Đợi một chút để browser xử lý cookie mới
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Sau khi refresh thành công, thử lấy user info lại
        console.log("🔄 Router: Lấy lại user info sau refresh...");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/me`,
          { withCredentials: true }
        );

        const user = res.data;
        const vaiTro = user.vaiTro;

        // Lưu user info
        currentUserAfterRefresh = user;

        console.log("✅ Router: User role sau refresh:", vaiTro);

        // QUAN TRỌNG: Nếu là admin, CHUYỂN HƯỚNG NGAY LẬP TỨC
        if (vaiTro === "admin") {
          console.log("🔄 Router: Redirect admin về /admin sau refresh");

          // Nếu đang ở route không phải admin, redirect ngay
          if (to.path !== "/admin" && !to.meta?.admin) {
            return next({ path: "/admin", replace: true });
          }
        }

        // Cho phép tiếp tục đến route hiện tại
        console.log("✅ Router: Cho phép tiếp tục sau refresh");
        next();
      } catch (refreshError) {
        console.error(
          "❌ Router: Refresh token thất bại:",
          refreshError?.response?.status
        );

        // Nếu refresh thất bại và route yêu cầu auth, redirect về login
        if (to.meta?.requiresAuth) {
          return next({ path: "/login" });
        }

        // Cho phép tiếp tục nếu route public
        next();
      }
    } else {
      // Lỗi khác 401
      if (to.meta?.requiresAuth) {
        return next({ path: "/login" });
      }
      next();
    }
  }
});

// Thêm navigation guard để xử lý trường hợp đã có user info
router.beforeResolve((to, from, next) => {
  // Nếu có user info sau refresh và là admin, đảm bảo ở đúng route
  if (currentUserAfterRefresh && currentUserAfterRefresh.vaiTro === "admin") {
    if (to.path !== "/admin" && !to.meta?.admin) {
      console.log("🔄 beforeResolve: Redirect admin về /admin");
      return next({ path: "/admin", replace: true });
    }
  }
  next();
});

// Export để có thể reset currentUser nếu cần
export const resetCurrentUser = () => {
  currentUserAfterRefresh = null;
};

// Export tất cả routes để sử dụng ở nơi khác
export { commonRoutes, adminRoutes, playerRoutes, coachRoutes, fanRoutes };
export default router;
