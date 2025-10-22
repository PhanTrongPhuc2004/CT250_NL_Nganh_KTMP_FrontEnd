<script setup>
import classNames from "classnames/bind";
import styles from "./header.module.scss";
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

const userRoutes = router.getRoutes().filter((r) => !r.meta?.admin);
console.log(userRoutes);
</script>

<template>
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
      <div :class="cx('nav-action')">
        <router-link 
          to="/profile"
          class="profile-link"
        >
          <i class="bi bi-person-circle"></i>
          <span> 👤{{ userStore.user.hoVaTen }}</span>
        </router-link>
        <button
          :class="cx('register-btn', 'btn', 'btn-primary')"
          @click="userStore.logout()"
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  </div>

  <!-- Modal Đăng ký -->
  <div class="modal fade" id="registerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <Form
          :inputFields="registerFields"
          method="POST"
          api="http://localhost:5000/nguoidung"
          :form-name="'Đăng ký'"
        />
      </div>
    </div>
  </div>

  <!-- Modal Đăng nhập -->
  <div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <Form
          :inputFields="loginFields"
          method="POST"
          api="http://localhost:5000/nguoidung/login"
          :form-name="'Đăng nhập'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-link {
  display: flex;
  align-items: center;
  gap: 8px; /* khoảng cách giữa icon và tên */
  color: white;
  font-weight: 500;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 8px 14px;
  border-radius: 50px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Khi hover: sáng lên nhẹ */
.profile-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  text-decoration: none;
  color: #fff;
}

/* Icon 👤 */
.profile-link i {
  font-size: 1.4rem;
}

/* Ẩn tên người dùng trên thiết bị nhỏ */
@media (max-width: 768px) {
  .profile-link span {
    display: none;
  }
}
</style>