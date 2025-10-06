import { createRouter, createWebHistory } from "vue-router";

// Import các component bạn muốn điều hướng
import Home from "../pages/home/Home.vue";
import Sticket from "@/pages/sticket/Sticket.vue";
import Player from "@/pages/player/Player.vue";
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

const router = createRouter({
  history: createWebHistory(), // có thể dùng createWebHashHistory()
  routes: userRouter,
});
export { userRouter };
export default router;
