<script setup>
const msg = "Hello";
import classNames from "classnames/bind";
import styles from "./header.module.scss";
import { useRouter } from "vue-router";
const router = useRouter();
const routes = router.getRoutes();
console.log(routes);
const cx = classNames.bind(styles);
</script>

<template>
  <div :class="cx('header-wrapper')">
    <nav :class="cx('nav-wrapper')">
      <div :class="cx('nav-list')">
        <router-link
          v-for="item in routes"
          :key="item.path"
          :to="item.path"
          :class="cx('nav-item')"
        >
          {{ item.name }}
        </router-link>
      </div>
      <div :class="cx('nav-action')">
        <button :class="cx('login-btn')">Đăng nhập</button>
        <p style="margin: 0">|</p>
        <button :class="cx('register-btn')">Đăng ký</button>
      </div>
    </nav>
  </div>
</template>
