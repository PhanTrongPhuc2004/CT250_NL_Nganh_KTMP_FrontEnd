<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./userManagement.module.scss";
const cx = classNames.bind(styles);
const users = ref([]);

// Form state
const formMode = ref("add"); // "add" | "edit"
const formData = ref({
  _id: null,
  hoVaTen: "",
  email: "",
  tenDangNhap: "",
  matKhau: "",
  vaiTro: "fan",
});

// Modal state
const showForm = ref(false);

// Fetch danh sách người dùng
async function fetchUsers() {
  try {
    const response = await axios.get("http://localhost:5000/nguoidung/all", {
      withCredentials: true,
    });
    users.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
  }
}

// Thêm user
async function addUser() {
  try {
    await axios.post("http://localhost:5000/nguoidung", formData.value, {
      withCredentials: true,
    });
    fetchUsers();
    closeForm();
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
  }
}

// Cập nhật user
async function updateUser() {
  try {
    await axios.put(
      `http://localhost:5000/nguoidung/${formData.value._id}`,
      formData.value,
      { withCredentials: true }
    );
    fetchUsers();
    closeForm();
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
  }
}

// Xóa user
async function deleteUser(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
  try {
    await axios.delete(`http://localhost:5000/nguoidung/${id}`, {
      withCredentials: true,
    });
    fetchUsers();
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
  }
}

// Mở form thêm hoặc sửa
function openForm(mode, user = null) {
  formMode.value = mode;
  if (mode === "edit" && user) {
    formData.value = { ...user };
  } else {
    resetForm();
  }
  showForm.value = true;
}

// Đóng form
function closeForm() {
  showForm.value = false;
}

// Reset form
function resetForm() {
  formData.value = {
    _id: null,
    hoVaTen: "",
    email: "",
    tenDangNhap: "",
    matKhau: "",
    vaiTro: "fan",
  };
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="container mt-4">
    <h2>Danh sách người dùng</h2>

    <button class="btn btn-primary mb-3" @click="openForm('add')">
      Thêm người dùng
    </button>

    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Họ và tên</th>
          <th>Email</th>
          <th>Tên đăng nhập</th>
          <th>Vai trò</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user._id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.hoVaTen }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.tenDangNhap }}</td>
          <td>{{ user.vaiTro }}</td>
          <td>
            <button
              class="btn btn-sm btn-warning me-2"
              @click="openForm('edit', user)"
            >
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteUser(user._id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="users.length === 0" class="text-muted fst-italic">
      Không có người dùng nào.
    </p>

    <!-- Modal & Backdrop -->
    <div v-if="showForm">
      <!-- Backdrop mờ -->
      <div :class="cx('modal-backdrop')" @click="closeForm"></div>

      <!-- Form modal -->
      <div :class="cx('modal-dialog')">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ formMode === "add" ? "Thêm người dùng" : "Sửa người dùng" }}
            </h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <div class="modal-body">
            <form
              @submit.prevent="formMode === 'add' ? addUser() : updateUser()"
            >
              <div class="mb-3">
                <label class="form-label">Họ và tên</label>
                <input
                  type="text"
                  v-model="formData.hoVaTen"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  v-model="formData.email"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input
                  type="text"
                  v-model="formData.tenDangNhap"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3" v-if="formMode === 'add'">
                <label class="form-label">Mật khẩu</label>
                <input
                  type="password"
                  v-model="formData.matKhau"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Vai trò</label>
                <select v-model="formData.vaiTro" class="form-select">
                  <option value="fan">Fan</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success me-2">
                  {{ formMode === "add" ? "Thêm" : "Cập nhật" }}
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeForm"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
