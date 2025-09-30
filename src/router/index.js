import { createRouter, createWebHistory } from "vue-router";

// Import các component bạn muốn điều hướng
import Home from "../pages/home/Home.vue";
const userRouter = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/cau-thu",
    name: "Cầu thủ",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(), // có thể dùng createWebHashHistory()
  routes: userRouter,
});
export { userRouter };
export default router;
