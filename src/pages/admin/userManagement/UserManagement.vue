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
const roleUserAdded = ref("");
const formNameAddUser = ref("");
const formNameEditUser = ref("");
const submitApi = ref("");
const squad = ref([]);
const viTriOptions = [
  { name: "Tiền đạo" },
  { name: "Tiền vệ" },
  { name: "Hậu vệ" },
];

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
  {
    name: "viTri",
    type: "text",
    label: "Vị trí",
    children: { value: viTriOptions },
  },
  {
    name: "chanThuan",
    type: "text",
    label: "Chân thuận",
    children: {
      value: [{ name: "Trái" }, { name: "Phải" }, { name: "Cả hai" }],
    },
  },
  { name: "quocTich", type: "text", label: "Quốc tịch" },
  { name: "soAo", type: "number", label: "Số áo" },
  { name: "ngayGiaNhap", type: "date", label: "Ngày gia nhập" },
  { name: "anhMinhHoa", type: "text", label: "Ảnh minh họa (URL)" },
  { name: "namSinh", type: "date", label: "Năm sinh" },
  { name: "doiHinhId", type: "text", label: "Đội hình", children: squad },
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
  { name: "doiHinhId", type: "text", label: "Đội hình", children: squad },
  {
    name: "phuTrach",
    type: "select",
    label: "Phụ trách",
    children: {
      value: [
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
  },
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
const formData = ref({});

// Modal state
const showForm = ref(false);
const fetchSquad = async () => {
  try {
    const response = await axios.get("http://localhost:5000/doihinh/", {
      withCredentials: true,
    });

    let data = response.data;

    if (data) {
      data = data.map((item) => ({
        _id: item._id,
        name: item.doiHinh, // đổi field doiHinh -> name
        cauLacBoId: item.cauLacBoId,
      }));
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đội:", error);
    return [];
  }
};
// Fetch danh sách người dùng
async function fetchUsers() {
  try {
    const response = await axios.get("http://localhost:5000/nguoidung/", {
      withCredentials: true,
    });
    users.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
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
async function handleOpenForm(mode, vaiTro, user = null) {
  formMode.value = mode;
  formData.value.vaiTro = vaiTro;
  if (mode == "add") {
    submitApi.value = "http://localhost:5000/nguoidung";
  } else {
    submitApi.value = `http://localhost:5000/nguoidung/${user._id}`;
  }
  if (mode == "add") {
    resetForm(vaiTro);
    if (vaiTro === "admin") {
      formNameAddUser.value = "Thêm Quản Trị Viên";
    } else if (vaiTro === "nguoihammo") {
      formNameAddUser.value = "Thêm Người Hâm Mộ";
    } else if (vaiTro === "cauthu") {
      formNameAddUser.value = "Thêm Cầu Thủ";
      squad.value = await fetchSquad();
      formData.value.doiHinhId = squad;
    } else if (vaiTro === "huanluyenvien") {
      squad.value = await fetchSquad();
      formNameAddUser.value = "Thêm Huấn Luyện Viên";
    } else {
      formNameAddUser.value = "Thêm Người Dùng";
    }
  }

  if (mode == "edit") {
    formData.value = { ...user };
    console.log("Data user chuan bi sua:", formData.value);
    if (vaiTro === "admin") {
      formNameEditUser.value = "Chỉnh Sửa Quản Trị Viên";
    } else if (vaiTro === "nguoihammo") {
      formNameEditUser.value = "Chỉnh Sửa Người Hâm Mộ";
    } else if (vaiTro === "cauthu") {
      formNameEditUser.value = "Chỉnh Sửa Cầu Thủ";
    } else if (vaiTro === "huanluyenvien") {
      formNameEditUser.value = "Chỉnh Sửa Huấn Luyện Viên";
    } else {
      formNameEditUser.value = "Chỉnh Sửa Người Dùng";
    }
  }
  // Chờ Vue render xong Form và Modal
  await nextTick();

  const modalEl = document.getElementById("userModal");

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
function resetForm(vaiTro) {
  const fields = dataObj[vaiTro]?.fields || [];
  formData.value = {};

  fields.forEach((field) => {
    formData.value[field.name] = ""; // tạo key trống cho từng field
  });

  formData.value.vaiTro = vaiTro; // nhớ thêm vai trò
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="container mt-4">
    <h2>Danh sách người dùng</h2>

    <div class="d-flex align-items-center mb-3">
      <select
        class="form-select mb-3 w-auto mr-2"
        @change="
          (e) => {
            roleUserAdded = e.target.value;
          }
        "
      >
        <option value="">-- Thêm người dùng --</option>
        <option value="nguoihammo">Người hâm mộ</option>
        <option value="admin">Quản trị viên</option>
        <option value="cauthu">Cầu thủ</option>
        <option value="huanluyenvien">Huấn luyện viên</option>
      </select>
      <button
        class="btn btn-primary mb-3"
        @click="handleOpenForm('add', roleUserAdded)"
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
    <div :class="cx('user-management-form-wrapper')">
      <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
        <Form
          v-if="formData.vaiTro && dataObj[formData.vaiTro]"
          :key="`${formData.vaiTro}-${formMode}-${formData._id || 'new'}`"
          :input-fields="dataObj[formData.vaiTro].fields"
          :form-name="formMode === 'add' ? formNameAddUser : formNameEditUser"
          :mode="formMode"
          :input-data="formData"
          :api="`http://localhost:5000/nguoidung${
            formMode === 'add' ? '' : '/' + formData._id
          }`"
          :method="formMode === 'add' ? 'POST' : 'PUT'"
          modal-id="userModal"
        />
      </div>
    </div>
  </div>
</template>
