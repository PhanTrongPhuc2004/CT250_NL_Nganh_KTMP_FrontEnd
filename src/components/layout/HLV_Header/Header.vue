<script setup>
import classNames from "classnames/bind";
import styles from "./header.module.scss";
import { useRouter } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { useUserStore } from "@/stores/userStore";
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useDropdownManager } from "@/composables/useDropdownManager";
import { ref, onMounted } from "vue"; // 👈 Thêm onMounted
import { useFormStore } from "@/stores/formStore";
import { getMe } from "@/utils";
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

// Computed: Filter routes dựa trên điều kiện
const filteredRoutes = ref([]);

// Watch để cập nhật routes khi userInfo thay đổi
import { watchEffect } from "vue";

watchEffect(() => {
  filteredRoutes.value = userRoutes.filter((item) => {
    // Nếu là route notifications, chỉ hiển thị khi user KHÔNG phải nguoihammo
    if (item.path === "/notifications") {
      return userInfor.value?.vaiTro !== "nguoihammo";
    }
    // Các route khác hiển thị bình thường
    return true;
  });
});
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

  <!-- Nếu đã đăng nhập -->
  <div :class="cx('header-wrapper')" v-else>
    <nav :class="cx('nav-wrapper')">
      <div :class="cx('nav-list')">
        <!-- ✅ ĐÚNG: Sử dụng filteredRoutes -->
        <router-link
          v-for="item in filteredRoutes"
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
            { label: 'Trang cá nhân', link: '/profile' },
            { label: 'Đăng xuất', action: () => userStore.logout() },
          ]"
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

@media (max-width: 768px) {
  .profile-link span {
    display: none;
  }
}
</style>
