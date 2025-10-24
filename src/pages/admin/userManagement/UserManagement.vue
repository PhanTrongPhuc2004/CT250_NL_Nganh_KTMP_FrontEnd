<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./userManagement.module.scss";
import Form from "@/components/common/form/Form.vue";
import { useFormStore } from "@/stores/formStore";
import { nextTick } from "vue";
const formStore = useFormStore();
const { openForm, closeForm } = formStore;

const cx = classNames.bind(styles);
const users = ref([]);
const activeForm = ref("");
const adminFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
  { name: "diaChi", type: "text", label: "Địa chỉ" },
];
const nguoiHamMoFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
];
const cauThuFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
  { name: "diaChi", type: "text", label: "Địa chỉ" },
  { name: "namHanhNghe", type: "text", label: "Năm hành nghề" },
  { name: "cauLacBoCu", type: "text", label: "Câu lạc bộ cũ" },
  { name: "chieuCao", type: "number", step: "0.01", label: "Chiều cao (m)" },
  { name: "viTri", type: "text", label: "Vị trí" },
  { name: "chanThuan", type: "text", maxlength: 1, label: "Chân thuận" },
  { name: "quocTich", type: "text", label: "Quốc tịch" },
  { name: "soAo", type: "number", label: "Số áo" },
  { name: "ngayGiaNhap", type: "date", label: "Ngày gia nhập" },
  { name: "anhMinhHoa", type: "text", label: "Ảnh minh họa (URL)" },
  { name: "namSinh", type: "number", label: "Năm sinh" },
];
const huanLuyenVienFields = [
  { name: "diaChi", type: "text", label: "Địa chỉ" },
  { name: "namHanhNghe", type: "text", label: "Năm hành nghề" },
  { name: "cauLacBoCu", type: "text", label: "Câu lạc bộ cũ" },
  { name: "quocTich", type: "text", label: "Quốc tịch" },
  { name: "ngayGiaNhap", type: "date", label: "Ngày gia nhập" },
  { name: "anhMinhHoa", type: "text", label: "Ảnh minh họa" },
  { name: "vaiTro", type: "text", label: "Vai trò" },
  { name: "namSinh", type: "number", label: "Năm sinh" },
];

const dataObj = {
  admin: {
    fields: adminFields,
    api: "http://localhost:5000/nguoidung",
  },
  nguoihammo: {
    fields: nguoiHamMoFields,
    api: "http://localhost:5000/nguoidung",
  },
  cauthu: {
    fields: cauThuFields,
    api: "http://localhost:5000/nguoidung",
  },
  huanluyenvien: {
    fields: huanLuyenVienFields,
    api: "http://localhost:5000/nguoidung",
  },
};
// Form state
const formMode = ref("add"); // "add" | "edit"
const formData = ref({
  _id: null,
});

// Modal state
const showForm = ref(false);

// Fetch danh sách người dùng
async function fetchUsers() {
  try {
    const response = await axios.get("http://localhost:5000/nguoidung/", {
      withCredentials: true,
    });
    users.value = response.data;
    console.log(users.value);
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
async function handleOpenForm(mode, vaiTro) {
  formMode.value = mode;
  formData.value.vaiTro = vaiTro;

  console.log("Vai trò:", formData.value.vaiTro);
  console.log("Trường:", dataObj[formData.value.vaiTro].fields);

  // Chờ Vue render xong Form và Modal
  await nextTick();

  const modalEl = document.getElementById("addAdminModal");
  if (!modalEl) {
    console.error("Không tìm thấy modal element!");
    return;
  }

  // Khởi tạo modal
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

// Đóng form
function handleCloseForm() {
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

    <select
      class="form-select mb-3 w-auto"
      @change="handleOpenForm('add', $event.target.value)"
    >
      <option value="">-- Thêm người dùng --</option>
      <option value="nguoihammo">Người hâm mộ</option>
      <option value="admin">Quản trị viên</option>
      <option value="cauthu">Cầu thủ</option>
      <option value="huanluyenvien">Huấn luyện viên</option>
    </select>

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

    <!-- Modal Form -->
    <div :class="cx('user-management-form-wrapper')">
      <div
        class="modal fade"
        id="addAdminModal"
        tabindex="-1"
        aria-hidden="true"
      >
        <Form
          v-if="formData.vaiTro && dataObj[formData.vaiTro]"
          :input-fields="dataObj[formData.vaiTro].fields"
          form-name="Thêm Quản Trị Viên"
          :mode="formMode"
          :formData="formData"
          api="http://localhost:5000/nguoidung"
          method="post"
          modal-id="addAdminModal"
        />
      </div>
    </div>
  </div>
</template>
