// src/router/adminRoutes.js
import UserManagement from "@/pages/admin/userManagement/UserManagement.vue";
import ClubManagement from "@/pages/admin/clubManagement/ClubManagement.vue";
import CompeteManagement from "@/pages/admin/competeManagement/CompeteManagement.vue";
import SeasonDetail from "@/pages/admin/seasonDetail/SeasonDetail.vue";
import TournamentDetail from "@/pages/admin/tournamentDetail/TournamentDetail.vue";
import Dashboard from "@/pages/admin/dashboard/Dashboard.vue";
import SquadDetail from "@/pages/admin/squadDetail/SquadDetail.vue";
import ClubTeamManagement from "@/pages/admin/clubTeamManagement/ClubTeamManagement.vue";
import ClubTeamDetail from "@/pages/admin/clubTeamDetail/ClubTeamDetail.vue";
import qualuuniem from "@/pages/admin/component/QuaLuuNiemPage.vue";
import donhang from "@/pages/admin/component/DonHangPage.vue";
import HopDongManage from "@/pages/admin/component/HopDongManage.vue";
import ThongKe from "@/pages/admin/component/ThongKe.vue";
import TinTucManage from "@/pages/admin/component/TinTucManage.vue";
import CauthuDetail from "@/pages/user/player/CauthuDetail.vue";
import MatchStats from "@/pages/admin/matchStats/MatchStats.vue";

const TicketRevenueStats = () =>
  import("@/pages/admin/ticketRevenue/TicketRevenueStats.vue");
const TicketManagement = () =>
  import("@/pages/admin/ticketManagement/TicketManagement.vue");

export const adminRoutes = [
  {
    path: "/admin",
    name: "Admin",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
      hidden: true,
    },
    icon: ["fas", "gauge"],
  },
  {
    path: "/admin/clubs",
    name: "Quản lý thông tin câu lạc bộ",
    component: ClubManagement,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "shield-alt"],
  },
  {
    path: "/admin/users",
    name: "Quản lý người dùng",
    component: UserManagement,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["far", "user"],
  },
  {
    path: "/admin/compete",
    name: "Quản lý thi đấu",
    component: CompeteManagement,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "trophy"],
  },
  {
    path: "/admin/clubteam",
    name: "Quản lý đào tạo",
    component: ClubTeamManagement,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "users"],
  },
  {
    path: "/admin/clubteam/:clubTeamId",
    name: "Quản lý chi tiết đội",
    component: ClubTeamDetail,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
      hidden: true,
    },
    icon: ["fas", "users"],
  },
  {
    path: "/admin/clubteam/:clubTeamId/squad/:squadId",
    name: "Quản lý chi tiết đội hình",
    component: SquadDetail,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
      hidden: true,
    },
    icon: ["fas", "user-group"],
  },
  {
    path: "/admin/compete/tournament/:tournamentId",
    name: "Quản lý giải đấu",
    component: TournamentDetail,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
      hidden: true,
    },
    icon: ["fas", "calendar-alt"],
  },
  {
    path: "/admin/compete/tournament/:tournamentId/season/:seasonId",
    name: "Quản lý mùa giải",
    component: SeasonDetail,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
      hidden: true,
    },
    icon: ["fas", "calendar-alt"],
  },
  {
    path: "/admin/posts",
    name: "Quản lý tin tức",
    component: TinTucManage,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "newspaper"],
  },
  {
    path: "/admin/qualuuniem",
    name: "Quản lý hàng lưu niệm",
    component: qualuuniem,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "gift"],
  },
  {
    path: "/admin/donhang",
    component: donhang,
    name: "Quản lý đơn hàng",
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "box-open"],
  },
  {
    path: "/admin/tickets",
    name: "Quản lý vé",
    component: TicketManagement,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "ticket-alt"],
  },
  {
    path: "/admin/thongke",
    name: "Thống kê doanh thu quà lưu niệm",
    component: ThongKe,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "chart-bar"],
  },
  {
    path: "/admin/ticket-revenue",
    name: "Thống kê Doanh thu Vé",
    component: TicketRevenueStats,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "chart-bar"],
  },
  {
    path: '/admin/match-stats',
    name: 'Thống kê trận đấu',
    component: MatchStats,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      admin: true,
    },
    icon: ['fas', 'chart-bar'],
  },
  {
    path: "/admin/hopdong",
    name: "Quản lý hợp đồng",
    component: HopDongManage,
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      admin: true,
    },
    icon: ["fas", "file-contract"],
  }
];
