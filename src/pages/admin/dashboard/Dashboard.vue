<script setup>
import Sidebar from "@/components/common/sidebar/Sidebar.vue";

import classNames from "classnames/bind";
import styles from "./dashboard.module.scss";
import { adminRouter } from "@/router/index.js";
const cx = classNames.bind(styles);
const adminMenuItems = [
  { label: "Quản lý người dùng", to: "/admin/users" },
  { label: "Quản lý câu lạc bộ", to: "/admin/clubs" },
  { label: "Quản lý trận đấu", to: "/admin/matches" },
  { label: "Quản lý bài viết", to: "/admin/posts" },
  { label: "Quản lý vé thi đấu", to: "/admin/tickets" },
  { label: "Quản lý quà lưu niệm", to: "/admin/merchandise" },
  { label: "Quản lý giải đấu", to: "/admin/tournaments" },
  { label: "Thống kê", to: "/admin/statistics" },
];
</script>

<template>
  <div :class="cx('dashboard-wrapper')">
    <Sidebar :items="adminRouter" />
    <div class="col-md-10" :class="cx('main')">
      <RouterView class="col-md-12" />
    </div>
  </div>
</template>
