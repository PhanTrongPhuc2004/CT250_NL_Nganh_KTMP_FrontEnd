<template>
  <div class="profile-container">
    <div class="profile-card shadow-lg">
      <h2 class="text-center mb-4">👤 Thông tin cá nhân</h2>

      <form @submit.prevent="updateUser">
        <div class="form-group">
          <label>Họ và tên</label>
          <input
            v-model="form.hoVaTen"
            type="text"
            class="form-control"
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            placeholder="Nhập email"
            required
          />
        </div>

        <div class="form-group">
          <label>Tên đăng nhập</label>
          <input
            v-model="form.tenDangNhap"
            type="text"
            class="form-control"
            disabled
          />
        </div>

        <div class="form-group">
          <label>Vai trò</label>
          <input
            v-model="form.vaiTro"
            type="text"
            class="form-control"
            disabled
          />
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button
            type="button"
            class="btn btn-secondary px-4"
            @click="exitProfile"
          >
            ❌ Hủy
          </button>
          <button type="submit" class="btn btn-primary px-4">
            💾 Cập nhật
          </button>
        </div>
      </form>
    </div>

    <!-- ✅ Toast thông báo -->
    <div
      class="toast-container position-fixed top-0 end-0 p-3"
      style="z-index: 2000"
    >
      <div
        id="updateToast"
        class="toast align-items-center text-bg-success border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">✅ Cập nhật thông tin thành công!</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/userStore";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Toast } from "bootstrap";

const router = useRouter();
const userStore = useUserStore();

// 📋 Dữ liệu form người dùng
const form = reactive({
  hoVaTen: userStore.user?.hoVaTen || "",
  email: userStore.user?.email || "",
  tenDangNhap: userStore.user?.tenDangNhap || "",
  vaiTro: userStore.user?.vaiTro || "",
});

// 🔄 Cập nhật thông tin người dùng
const updateUser = async () => {
  try {
    const res = await axios.put(
      `http://localhost:5000/nguoidung/${userStore.user._id}`,
      form,
      { withCredentials: true }
    );
    userStore.setUser(res.data);

    // ✅ Hiển thị thông báo thành công
    const toastEl = document.getElementById("updateToast");
    const toast = new Toast(toastEl);
    toast.show();
  } catch (err) {
    console.error(err);
    alert("❌ Cập nhật thất bại!");
  }
};

// ❌ Hủy → quay về trang trước hoặc trang chính
const exitProfile = () => {
  router.back(); // 👈 quay lại trang trước đó
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
    background: linear-gradient(135deg, #9b7b7f, #8d494d);
  padding: 40px;
}

.profile-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 35px;
  max-width: 500px;
  width: 100%;
  transition: all 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  font-weight: 600;
  color: #444;
  margin-bottom: 5px;
  display: block;
}

input.form-control {
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  transition: all 0.3s ease;
}

input.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 5px rgba(13, 110, 253, 0.4);
}

button.btn {
  font-weight: 500;
  border-radius: 10px;
  padding: 10px 18px;
  transition: all 0.3s ease;
}

button.btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

h2 {
  font-weight: 700;
  color: #333;
  text-align: center;
}

.toast-container {
  z-index: 3000;
}
</style>
