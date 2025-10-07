<script setup>
import classNames from "classnames/bind";
import styles from "./adminHeader.module.scss";
import { useRouter } from "vue-router";
import Form from "@/components/form/Form.vue";
import { useUserStore } from "@/stores/userStore";
import { watchEffect } from "vue";
const userStore = useUserStore();
watchEffect(() => {
  const user = useUserStore().user;
});
const router = useRouter();
const routes = router.getRoutes();

const cx = classNames.bind(styles);
</script>

<template>
  <div :class="cx('header-wrapper')" v-if="!userStore.user"></div>
  <div :class="cx('header-wrapper')" v-else class="col-md-12">
    <nav :class="cx('nav-wrapper')" class="col-md-12">
      <div class="col-md-2" :class="cx('nav-logo')">
        <img src="https://media.api-sports.io/football/teams/33.png" alt="" />
        <p
          style="color: white; padding-left: 10px; margin-bottom: 0"
          class="col-md-8"
        >
          Manchester United
        </p>
      </div>
      <div :class="cx('nav-action')">
        <p style="margin: 0; color: white; font-weight: 500">
          {{ userStore.user.hoVaTen }}
        </p>
        <button
          :class="cx('register-btn', 'btn', 'btn-primary')"
          @click="userStore.logout()"
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  </div>
</template>
