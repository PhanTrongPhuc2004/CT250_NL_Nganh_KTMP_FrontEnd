<script setup>
import classNames from "classnames/bind";
import styles from "./header.module.scss";
import { useRouter } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { useUserStore } from "@/stores/userStore";
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useDropdownManager } from "@/composables/useDropdownManager"; // 👈 thêm
import { watchEffect } from "vue";

const userStore = useUserStore();
const router = useRouter();
const cx = classNames.bind(styles);

// Sử dụng hook dropdown
const { activeMenuId, toggleMenu } = useDropdownManager();

const userRoutes = router.getRoutes().filter((r) => r.meta?.user);

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
</script>

<template>
  <!-- Nếu chưa đăng nhập -->
  <div :class="cx('header-wrapper')" v-if="!userStore.user">
    <nav :class="cx('nav-wrapper')">
      <div :class="cx('nav-list')">
        <router-link
          v-for="item in userRoutes"
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
          data-bs-toggle="modal"
          data-bs-target="#loginModal"
        >
          Đăng nhập
        </button>
        <p style="margin: 0">|</p>
        <button
          :class="cx('register-btn', 'btn', 'btn-primary')"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#registerModal"
        >
          Đăng ký
        </button>
      </div>
    </nav>
  </div>

  <!-- Nếu đã đăng nhập -->
  <div :class="cx('header-wrapper')" v-else>
    <nav :class="cx('nav-wrapper')">
      <div :class="cx('nav-list')">
        <router-link
          v-for="item in userRoutes"
          :key="item.path"
          :to="item.path"
          :class="cx('nav-item')"
        >
          {{ item.name }}
        </router-link>
      </div>

      <div :class="cx('nav-action')" data-dropdown-id>
        <div class="dropdown-trigger" @click.stop="toggleMenu('user-menu')">
          <span>{{ userStore.user.hoVaTen }}</span>
          <FontAwesomeIcon :icon="['fas', 'angle-down']" />
        </div>

        <!-- Menu người dùng -->
        <Menu
          v-show="activeMenuId === 'user-menu'"
          :menu-items="[
            { name: 'Trang cá nhân', link: '/profile' },
            { name: 'Đăng xuất', action: () => userStore.logout() },
          ]"
          top="60px"
        />
      </div>
    </nav>
  </div>

  <!-- Modal Đăng ký -->
  <div class="modal fade" id="registerModal" tabindex="-1" aria-hidden="true">
    <Form
      :inputFields="registerFields"
      method="POST"
      api="http://localhost:5000/nguoidung"
      :form-name="'Đăng ký'"
    />
  </div>

  <!-- Modal Đăng nhập -->
  <div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
    <Form
      :inputFields="loginFields"
      method="POST"
      api="http://localhost:5000/nguoidung/login"
      :form-name="'Đăng nhập'"
    />
  </div>
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

@media (max-width: 768px) {
  .profile-link span {
    display: none;
  }
}
</style>
