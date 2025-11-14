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

const API_BASE_URL = import.meta.env.VITE_API_BE_BASE_URL;
const registerApiUrl = `${API_BASE_URL}/nguoidung`;
const loginApiUrl = `${API_BASE_URL}/nguoidung/login`;

const userStore = useUserStore();
const formStore = useFormStore();
const router = useRouter();
const cx = classNames.bind(styles);

// State
const userInfor = ref({});
const { activeMenuId, toggleMenu } = useDropdownManager();

// Lấy user info khi component mounted
onMounted(async () => {
  try {
    userInfor.value = await getMe();
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
  }
});

// Routes và form fields
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

// Routes mapping - KEY PHẢI KHỚP với vai trò từ backend
const routesMap = {
  nguoihammo: fanRoutes,
  admin: adminRoutes,
  huanluyenvien: coachRoutes, // Key phải là "coach" không phải "huanluyenvien"
  cauthu: playerRoutes, // Key phải là "player" không phải "cauthu"
};

// Computed: Lấy routes hiện tại theo vai trò
const currentRoutes = computed(() => {
  if (!userStore.user) {
    // Routes cho người chưa đăng nhập
    return [
      { path: "/", name: "Trang chủ" },
      { path: "/cauthu", name: "Cầu Thủ" },
      { path: "/shop", name: "Cửa hàng" },
    ];
  }

  const userRole = userStore.user.vaiTro;
  const routes = routesMap[userRole] || [];

  // Filter chỉ lấy routes không ẩn và có name
  return routes.filter((route) => !route.meta?.hidden && route.name);
});

// Computed: Menu items cho dropdown
const userMenuItems = computed(() => {
  const items = [
    { label: "Trang cá nhân", link: "/profile" },
    { label: "Đăng xuất", action: () => userStore.logout() },
  ];

  return items;
});

// Computed: Hiển thị tên với icon vai trò
const displayUserName = computed(() => {
  if (!userStore.user) return "";

  return `${userStore.user.hoVaTen}`;
});
</script>

<template>
  <!-- Header cho người CHƯA đăng nhập -->
  <div :class="cx('header-wrapper')" v-if="!userStore.user">
    <nav :class="cx('nav-wrapper')">
      <div :class="cx('nav-list')">
        <router-link
          v-for="item in currentRoutes"
          :key="item.path"
          :to="item.path"
          :class="cx('nav-item')"
        >
          {{ item.name }}
        </router-link>
      </div>
      <div :class="cx('nav-action')">
        <button
          :class="cx('register-btn', 'btn', 'btn-primary')"
          type="button"
          @click="formStore.openForm('Đăng nhập', {})"
        >
          Đăng nhập
        </button>
        <p style="margin: 0">|</p>
        <button
          :class="cx('register-btn', 'btn', 'btn-primary')"
          type="button"
          @click="formStore.openForm('Đăng ký', {})"
        >
          Đăng ký
        </button>
      </div>
    </nav>
  </div>

  <!-- Header cho người ĐÃ đăng nhập -->
  <div :class="cx('header-wrapper')" v-else>
    <nav :class="cx('nav-wrapper')">
      <div :class="cx('nav-list')">
        <router-link
          v-for="item in currentRoutes"
          :key="item.path"
          :to="item.path"
          :class="cx('nav-item')"
        >
          {{ item.name }}
        </router-link>

        <!-- Route đặc biệt cho admin -->
        <router-link
          v-if="userStore.user.vaiTro === 'admin'"
          to="/admin"
          :class="cx('nav-item', 'admin-item')"
        >
        </router-link>
      </div>

      <div :class="cx('nav-action')" data-dropdown-id>
        <div class="dropdown-trigger" @click.stop="toggleMenu('user-menu')">
          <span>{{ displayUserName }}</span>
          <FontAwesomeIcon :icon="['fas', 'angle-down']" />
        </div>

        <Menu
          v-show="activeMenuId === 'user-menu'"
          :menu-items="userMenuItems"
          top="60px"
        />
      </div>
    </nav>
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

/* Style đặc biệt cho admin item */
.admin-item {
  background: linear-gradient(45deg, #ff6b6b, #ffa726);
  font-weight: bold;
}

@media (max-width: 768px) {
  .profile-link span {
    display: none;
  }
}
</style>
