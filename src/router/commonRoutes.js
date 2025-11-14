// src/router/commonRoutes.js
import UserProfile from "@/pages/common/userProfile/UserProfile.vue";

export const commonRoutes = [
  {
    path: "/profile",
    name: "Thông tin cá nhân",
    component: UserProfile,
    meta: {
      requiresAuth: true,
      common: true,
      roles: ["player", "coach", "fan", "admin"],
    },
  },
];
