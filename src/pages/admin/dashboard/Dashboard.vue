<script setup>
import Sidebar from "@/components/layout/sidebar/Sidebar.vue";

import classNames from "classnames/bind";
import styles from "./dashboard.module.scss";
const cx = classNames.bind(styles);
const adminMenuItems = [
  { label: "Quản lý người dùng", to: "/admin/users" },
  { label: "Quản lý thông tin câu lạc bộ", to: "/admin/clubs" },
  { label: "Quản lý lịch tập luyện và thi đấu", to: "/admin/schedules" },
  { label: "Thống kê giải đấu / mùa giải", to: "/admin/statistics" },
  { label: "Quản lý bài viết", to: "/admin/posts" },
  { label: "Quản lý vé thi đấu", to: "/admin/tickets" },
  { label: "Quản lý quà lưu niệm", to: "/admin/qualuuniem" },
  { label: "Quản lý giải đấu", to: "/admin/tournaments" },
];
</script>

<template>
  <div :class="cx('dashboard-wrapper')">
    <Sidebar :items="adminMenuItems" />
    <div class="col-md-10" :class="cx('main')">
      <RouterView class="col-md-12" />
    </div>
  </div>
</template>
