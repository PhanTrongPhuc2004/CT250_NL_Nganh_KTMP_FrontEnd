<script setup>
import classNames from "classnames/bind";
import styles from "./adminHeader.module.scss";
import { useRouter } from "vue-router";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Menu from "@/components/common/menu/Menu.vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const router = useRouter();
const cx = classNames.bind(styles);

const showMenu = ref(false);
const menuRef = ref(null);
const triggerRef = ref(null);

const handleShowMenuUser = () => {
  showMenu.value = !showMenu.value;
};

const handleClickOutside = (e) => {
  const menuEl = menuRef.value?.el; // ✅ giờ el là ref của element
  const triggerEl = triggerRef.value;

  if (
    menuEl &&
    !menuEl.contains(e.target) &&
    triggerEl &&
    !triggerEl.contains(e.target)
  ) {
    showMenu.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);
</script>

<template>
  <div :class="cx('header-wrapper')" v-if="!userStore.user"></div>
  <div :class="cx('header-wrapper')" v-else class="col-md-12">
    <nav :class="cx('nav-wrapper')" class="col-md-12">
      <div class="col-md-2" :class="cx('nav-logo')">
        <img src="https://media.api-sports.io/football/teams/33.png" alt="" />
        <p style="color: white; padding-left: 10px; margin-bottom: 0">
          Manchester United
        </p>
      </div>

      <div :class="cx('nav-action')">
        <div
          :class="cx('user-name')"
          @click="handleShowMenuUser"
          ref="triggerRef"
        >
          <p style="margin: 0; color: white; font-weight: 500">
            {{ userStore.user.hoVaTen }}
          </p>
          <FontAwesomeIcon :icon="['fas', 'angle-down']" />
        </div>

        <Menu
          v-show="showMenu"
          ref="menuRef"
          :menu-items="[
            { name: 'Trang cá nhân', link: '/profile' },
            { name: 'Đăng xuất', action: () => userStore.logout() },
          ]"
          top="60px"
        />
      </div>
    </nav>
  </div>
</template>
