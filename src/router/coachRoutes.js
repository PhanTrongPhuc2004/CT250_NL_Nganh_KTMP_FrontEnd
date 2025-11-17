// src/router/coachRoutes.js
import Home from "@/pages/user/home/Home.vue";
import CauthuDetail from "@/pages/user/player/CauthuDetail.vue";
import CauthuList from "@/pages/user/player/CauthuList.vue";
import HuanLuyenVien from "@/pages/user/player/HuanLuyenVien.vue";
import Shop from "@/pages/user/player/Shop.vue";
import ProductDetail from "@/pages/user/player/SanPhamDetail.vue";
import Cart from "@/pages/user/player/GioHang.vue";
import checkout from "@/pages/user/player/ThanhToan.vue";
import orders from "@/pages/user/player/Donhang.vue";
import Notifivation from "@/pages/user/notification/Notification.vue";

const TraingManagement = () =>
  import("@/pages/user/trainingManagement/TrainingManagement.vue");

export const coachRoutes = [
  {
    path: "/",
    name: "Trang chủ",
    component: Home,
    meta: {
      requiresAuth: false,
      roles: ["player", "coach", "fan", "admin"],
    },
  },
  {
    path: "/cauthu",
    name: "Danh sách cầu thủ",
    component: CauthuList,
    meta: {
      requiresAuth: false,
      roles: ["player", "coach", "fan", "admin"],
    },
  },
  {
    path: "/huanluyenvien/:id",
    name: "Chi tiết huấn luyện viên",
    component: HuanLuyenVien,
    meta: {
      requiresAuth: false,
      roles: ["player", "coach", "fan", "admin"],
      hidden: true, // Ẩn trên header vì là dynamic route
    },
  },
  {
    path: "/training",
    name: "Lịch Tập Luyện",
    component: TraingManagement,
    meta: {
      requiresAuth: true,
      roles: ["player", "coach"],
    },
  },
  {
    path: "/match",
    name: "Lịch thi đấu",
    component: TraingManagement,
    meta: {
      requiresAuth: true,
      roles: ["player", "coach"],
    },
  },
  {
    path: "/shop",
    component: Shop,
    name: "Cửa hàng",
    meta: {
      requiresAuth: true,
      roles: ["player", "coach", "fan", "admin"],
    },
  },
  {
    path: "/shop/:id",
    name: "Chi tiết sản phẩm",
    component: ProductDetail,
    meta: {
      requiresAuth: true,
      roles: ["player", "coach", "fan", "admin"],
      hidden: true, // Ẩn trên header vì là dynamic route
    },
  },
  {
    path: "/cart",
    name: "Giỏ hàng",
    component: Cart,
    meta: {
      requiresAuth: true,
      roles: ["player", "coach", "fan", "admin"],
      hidden: true, // Ẩn trên header - thường truy cập qua icon giỏ hàng
    },
  },
  {
    path: "/checkout",
    name: "Thanh toán",
    component: checkout,
    meta: {
      requiresAuth: true,
      roles: ["player", "coach", "fan", "admin"],
      hidden: true, // Ẩn trên header - chỉ truy cập từ giỏ hàng
    },
  },
  {
    path: "/orders",
    name: "Đơn hàng của tôi",
    component: orders,
    meta: {
      requiresAuth: true,
      roles: ["player", "coach", "fan", "admin"],
      hidden: true, // Ẩn trên header - truy cập từ profile/dropdown
    },
  },
  {
    path: "/notifications",
    component: Notifivation,
    name: "Thông báo",
    meta: {
      requiresAuth: true,
      roles: ["player", "coach", "fan", "admin"],
    },
  },
  {
    path: "/coach-profile",
    name: "Hồ sơ huấn luyện viên",
    component: HuanLuyenVien,
    meta: {
      requiresAuth: true,
      roles: ["coach"],
      hidden: true, // Ẩn trên header - truy cập từ dropdown menu
    },
  },
];
