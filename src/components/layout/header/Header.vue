<script setup>
import classNames from "classnames/bind";
import styles from "./header.module.scss";
import { useRouter } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { useUserStore } from "@/stores/userStore";
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useDropdownManager } from "@/composables/useDropdownManager";
import { ref, onMounted, computed } from "vue";
import { useFormStore } from "@/stores/formStore";
import { getMe } from "@/utils";
import { fanRoutes, adminRoutes, coachRoutes, playerRoutes } from "@/router";
import Notification from "@/pages/user/notification/Notification.vue";

const API_BASE_URL = import.meta.env.VITE_API_BE_BASE_URL;
const registerApiUrl = `${API_BASE_URL}/nguoidung`;
const loginApiUrl = `${API_BASE_URL}/nguoidung/login`;

const userStore = useUserStore();
const formStore = useFormStore();
const router = useRouter();
const cx = classNames.bind(styles);

const userInfor = ref({});
const notificationState = ref(false);
const mobileMenuOpen = ref(false);

const { activeMenuId, toggleMenu } = useDropdownManager();

onMounted(async () => {
  try {
    userInfor.value = await getMe();
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
  }
});

const registerFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
];

const loginFields = [
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
];

const routesMap = {
  nguoihammo: fanRoutes,
  admin: adminRoutes,
  huanluyenvien: coachRoutes,
  cauthu: playerRoutes,
};

const currentRoutes = computed(() => {
  if (!userStore.user) {
    return [
      { path: "/", name: "Trang chủ" },
      { path: "/cauthu", name: "Cầu Thủ" },
      { path: "/shop", name: "Cửa hàng" },
    ];
  }

  const userRole = userStore.user.vaiTro;
  const routes = routesMap[userRole] || [];
  return routes.filter((route) => !route.meta?.hidden && route.name);
});

const userMenuItems = computed(() => {
  return [
    { label: "Trang cá nhân", link: "/profile" },
    { label: "Đăng xuất", action: () => userStore.logout() },
  ];
});

const displayUserName = computed(() => {
  if (!userStore.user) return "";
  return `${userStore.user.hoVaTen}`;
});

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<template>
  <div :class="cx('header-wrapper position-relative d-flex align-items-center justify-content-between')" style="height: var(--header-height); background-color: var(--header-color);">
    <nav class="navbar navbar-expand-lg " :class="cx('nav-wrapper')" style="line-height: var(--header-height);">
      <div class="container-fluid d-flex align-items-center justify-content-between" >
        <!-- Mobile Menu Toggle Button -->
        <button
          class="navbar-toggler text-white d-lg-none border "
          type="button"
          @click="toggleMobileMenu"
          style="background-color: transparent;border-radius: 0;"
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon :icon="['fas', 'bars']" size="lg" />
        </button>

        <!-- Navigation Items -->
        <div
          class="collapse navbar-collapse"
          :class="{ show: mobileMenuOpen }"
          style="z-index: 10000; "
        >
          <!-- Nav Links -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item " v-for="item in currentRoutes" :key="item.path">
              <router-link
                :to="item.path"
                :class="cx('nav-item')"
                class="nav-link text-white"
                @click="closeMobileMenu"
              >
                {{ item.name }}
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.user?.vaiTro === 'admin'">
              <router-link
                to="/admin"
                :class="cx('nav-item', 'admin-item')"
                class="nav-link"
                @click="closeMobileMenu"
              >
                Admin
              </router-link>
            </li>
          </ul>

          <!-- Auth Actions -->
          <div :class="cx('nav-action')" v-if="!userStore.user">
            <button
              class="btn text-white fw-bold"
              type="button"
              @click="formStore.openForm('Đăng nhập', {}); closeMobileMenu();"
            >
              Đăng nhập
            </button>
            <p class="mb-0 mx-2 text-white d-none d-lg-block">|</p>
            <button
              class="btn text-white fw-bold"
              type="button"
              @click="formStore.openForm('Đăng ký', {}); closeMobileMenu();"
            >
              Đăng ký
            </button>
          </div>
          <!-- User Menu (for logged in users) -->
        </div>
        <div :class="cx('nav-action justify-content-end')" >
          <div class="dropdown-trigger d-flex align-items-center gap-2 position-relative">
            <span class="text-white">{{ displayUserName }}</span>
            <FontAwesomeIcon
              :icon="['fas', 'fa-angle-down']"
              class="text-white"
              @click.stop="toggleMenu('user-menu')"
              style="cursor: pointer"
            />
            <FontAwesomeIcon
              :icon="['far', 'bell']"
              class="text-white ms-2"
              @click="notificationState = !notificationState"
              style="cursor: pointer"
            />
            <Menu
              v-if="activeMenuId == 'user-menu'"
              :menu-items="userMenuItems"
              top="60px"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Notification Panel -->
    <div
      v-if="notificationState"
      class="position-fixed end-0 vh-75 overflow-y-auto bg-white shadow"
      style="width: 80%; max-width: 400px; height: 100vh; top: var(--header-height); z-index: 1050"
    >
      <Notification />
    </div>
  </div>

  <!-- Modal Đăng ký -->
  <Form
    v-if="formStore.isCurrent('Đăng ký')"
    :inputFields="registerFields"
    method="POST"
    :api="registerApiUrl"
    :form-name="'Đăng ký'"
    :orther-data="{ vaiTro: 'nguoihammo' }"
    @closed="formStore.closeForm"
    @submitted="formStore.closeForm"
  />

  <!-- Modal Đăng nhập -->
  <Form
    v-if="formStore.isCurrent('Đăng nhập')"
    :inputFields="loginFields"
    method="POST"
    :api="loginApiUrl"
    :form-name="'Đăng nhập'"
    @closed="formStore.closeForm"
    @submitted="userStore.login"
  />
</template>

<style scoped>
.navbar-toggler {
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.navbar-toggler:focus {
  box-shadow: none;
  border-color: rgba(255, 255, 255, 0.8);
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 500;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 8px 14px;
  border-radius: 50px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.profile-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  text-decoration: none;
  color: #fff;
}

.admin-item {
  background: linear-gradient(45deg, #ff6b6b, #ffa726);
  font-weight: bold;
  border-radius: 4px;
  padding: 0.5rem 1rem;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    position: absolute;
    background-color: var(--header-color);
    top: var(--header-height);
    width: 80%;
    left: 0;
    padding: 1rem;
  }

  .nav-item {
    margin: 0.5rem 0;
  }

  .profile-link span {
    display: inline;
  }
}
</style>