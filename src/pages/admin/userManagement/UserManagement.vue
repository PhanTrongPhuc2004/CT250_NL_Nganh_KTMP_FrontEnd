<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./userManagement.module.scss";
import Form from "@/components/common/form/Form.vue";
import { useFormStore } from "@/stores/formStore";
// ... imports khác

const users = ref([]);
const roleUserAdded = ref("");
const formNameAddUser = ref("");
const formNameEditUser = ref("");
const squad = ref([]);

const viTriOptions = [
  { name: "Tiền đạo" },
  { name: "Tiền vệ" },
  { name: "Hậu vệ" },
];

// ✅ Định nghĩa field ĐƠN GIẢN - KHÔNG CẦN createField()
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
  { name: "chieuCao", type: "number", step: "0.01", label: "Chiều cao" },
  { name: "viTri", type: "select", label: "Vị trí", children: viTriOptions },
  {
    name: "chanThuan",
    type: "select",
    label: "Chân thuận",
    children: [{ name: "Trái" }, { name: "Phải" }, { name: "Cả hai" }],
  },
  { name: "quocTich", type: "text", label: "Quốc tịch" },
  { name: "soAo", type: "number", label: "Số áo" },
  { name: "ngayGiaNhap", type: "date", label: "Ngày gia nhập" },
  { name: "anhMinhHoa", type: "text", label: "Ảnh minh họa (URL)" },
  { name: "namSinh", type: "date", label: "Năm sinh" },
  {
    name: "doiHinhId",
    type: "select",
    label: "Đội hình",
    children: squad,
  },
];

const huanLuyenVienFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
  { name: "diaChi", type: "text", label: "Địa chỉ" },
  { name: "namHanhNghe", type: "number", label: "Năm hành nghề" },
  { name: "cauLacBoCu", type: "text", label: "Câu lạc bộ cũ" },
  { name: "quocTich", type: "text", label: "Quốc tịch" },
  { name: "ngayGiaNhap", type: "date", label: "Ngày gia nhập" },
  { name: "anhMinhHoa", type: "text", label: "Ảnh minh họa" },
  { name: "doiHinhId", type: "select", label: "Đội hình", children: squad },
  {
    name: "phuTrach",
    type: "select",
    label: "Phụ trách",
    children: [
      { name: "Huấn luyện viên trưởng" },
      { name: "Trợ lý huấn luyện viên" },
      { name: "Huấn luyện viên thể lực" },
      { name: "Huấn luyện viên thủ môn" },
      { name: "Huấn luyện viên phục hồi chấn thương" },
      { name: "Huấn luyện viên chiến thuật" },
      { name: "Huấn luyện viên đội trẻ" },
      { name: "Huấn luyện viên tâm lý" },
      { name: "Chuyên gia dinh dưỡng" },
    ],
  },
  { name: "namSinh", type: "number", label: "Năm sinh" },
];

const dataObj = {
  admin: { fields: adminFields, api: "http://localhost:5000/nguoidung" },
  nguoihammo: {
    fields: nguoiHamMoFields,
    api: "http://localhost:5000/nguoidung",
  },
  cauthu: { fields: cauThuFields, api: "http://localhost:5000/nguoidung" },
  huanluyenvien: {
    fields: huanLuyenVienFields,
    api: "http://localhost:5000/nguoidung",
  },
};

const formMode = ref("add");
const formData = ref({});

// --- API Functions ---
const fetchSquad = async () => {
  try {
    const res = await axios.get("http://localhost:5000/doihinh/", {
      withCredentials: true,
    });
    squad.value = res.data.map((item) => ({
      _id: item._id,
      name: item.doiHinh,
    }));
  } catch (err) {
    console.error("Lỗi khi lấy đội hình:", err);
  }
};

const fetchUsers = async () => {
  try {
    const res = await axios.get("http://localhost:5000/nguoidung/", {
      withCredentials: true,
    });
    users.value = res.data;
  } catch (err) {
    console.error("Lỗi khi lấy người dùng:", err);
  }
};

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

// ✅ Mở form - LOGIC ĐƠN GIẢN
async function handleOpenForm(mode, vaiTro, user = null) {
  formMode.value = mode;

  if (mode === "add") {
    formData.value = { vaiTro };

    if (vaiTro === "cauthu" || vaiTro === "huanluyenvien") {
      await fetchSquad();
    }

    formNameAddUser.value =
      vaiTro === "admin"
        ? "Thêm Quản Trị Viên"
        : vaiTro === "nguoihammo"
        ? "Thêm Người Hâm Mộ"
        : vaiTro === "cauthu"
        ? "Thêm Cầu Thủ"
        : vaiTro === "huanluyenvien"
        ? "Thêm Huấn Luyện Viên"
        : "Thêm Người Dùng";
  } else if (mode === "edit") {
    formData.value = { ...user };

    if (vaiTro === "cauthu" || vaiTro === "huanluyenvien") {
      await fetchSquad();
    }

    formNameEditUser.value =
      vaiTro === "admin"
        ? "Chỉnh Sửa Quản Trị Viên"
        : vaiTro === "nguoihammo"
        ? "Chỉnh Sửa Người Hâm Mộ"
        : vaiTro === "cauthu"
        ? "Chỉnh Sửa Cầu Thủ"
        : vaiTro === "huanluyenvien"
        ? "Chỉnh Sửa Huấn Luyện Viên"
        : "Chỉnh Sửa Người Dùng";
  }

  // Mở modal
  await nextTick();
  const modalEl = document.getElementById("userModal");
  if (modalEl) new bootstrap.Modal(modalEl).show();
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="container mt-4">
    <h2>Danh sách người dùng</h2>

    <div class="d-flex align-items-center mb-3">
      <select class="form-select mb-3 w-auto mr-2" v-model="roleUserAdded">
        <option value="">-- Thêm người dùng --</option>
        <option value="nguoihammo">Người hâm mộ</option>
        <option value="admin">Quản trị viên</option>
        <option value="cauthu">Cầu thủ</option>
        <option value="huanluyenvien">Huấn luyện viên</option>
      </select>
      <button
        class="btn btn-primary mb-3"
        @click="handleOpenForm('add', roleUserAdded)"
        :disabled="!roleUserAdded"
      >
        Thêm
      </button>
    </div>

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
              @click="handleOpenForm('edit', user.vaiTro, user)"
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
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
      <Form
        v-if="formData.vaiTro && dataObj[formData.vaiTro]"
        :key="`${formData.vaiTro}-${formMode}-${formData._id || 'new'}`"
        :input-fields="dataObj[formData.vaiTro].fields"
        :input-data="formData"
        :form-name="formMode === 'add' ? formNameAddUser : formNameEditUser"
        :api="`http://localhost:5000/nguoidung${
          formMode === 'add' ? '' : '/' + formData._id
        }`"
        :method="formMode === 'add' ? 'POST' : 'PUT'"
        modal-id="userModal"
        @success="fetchUsers"
      />
    </div>
  </div>
</template>
