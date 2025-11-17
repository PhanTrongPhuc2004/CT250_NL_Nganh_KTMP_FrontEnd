// src/router/commonRoutes.js
import UserProfile from "@/pages/common/userProfile/UserProfile.vue";
import CauthuDetail from "@/pages/user/player/CauthuDetail.vue";

export const commonRoutes = [
  {
    path: "/profile",
    name: "Thông tin cá nhân",
    component: UserProfile,
    meta: {
      requiresAuth: true,
      common: true,
    },
  },
  {
      path: "/cauthu/:id",
      name: "Chi tiết cầu thủ",
      component: CauthuDetail,
      meta: {
        common: true,
        hidden: true,
      },
      icon: ["fas", "calendar-alt"],
    },
];
