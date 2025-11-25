<template>
  <div class="container">
    <!-- Tiêu đề -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-semibold m-0" style="color: var(--primary-color);">Quản lý người dùng</h4>
      <div class="d-flex">
        <input type="text" class="form-control form-control-sm w-auto me-3 " placeholder="Tìm kiếm..." v-model="searchQuery" @input="handleSearch" />
        <div class="d-flex gap-2">
          <select
            class="form-select form-select-sm w-auto"
            v-model="roleUserAdded"
          >
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="nguoihammo">Người hâm mộ</option>
            <option value="cauthu">Cầu thủ</option>
            <option value="huanluyenvien">Huấn luyện viên</option>
          </select>
          <button
            class="btn btn-sm text-white"
            style="background-color: var(--button-primary-color);"
            @click="handleOpenForm('add', roleUserAdded)"
            :disabled="!roleUserAdded"
          >
            <i class="bi bi-plus-lg me-1"></i> Thêm
          </button>
        </div>
      </div>
    </div>
    <div class="d-flex pt-3 border-top">
      <select
          class="form-select form-select-sm w-auto me-2"
          v-model="roleUserArrange"
        >
          <option value="all">Tất cả</option>
          <option value="admin">Quản trị viên</option>
          <option value="nguoihammo">Người hâm mộ</option>
          <option value="cauthu">Cầu thủ</option>
          <option value="huanluyenvien">Huấn luyện viên</option>
        </select>
        <button
          class="btn btn-sm text-white "
          style="background-color: var(--button-primary-color);"
          @click="() => handleArrange(roleUserArrange)"
          :disabled="!roleUserArrange"
        >
          <FontAwesomeIcon icon="fa-solid fa-sort"/> Lọc
        </button>
    </div>
    <!-- Bảng -->
    <div class="card border-0 shadow-sm mt-3">
      <div class="card-body p-0">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="text-center" style="width: 40px">#</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Tên đăng nhập</th>
              <th>Vai trò</th>
              <th class="text-center" style="width: 160px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in arrangeUsers" :key="user._id">
              <td class="text-center text-muted">{{ index + 1 }}</td>
              <td class="fw-semibold">{{ user.hoVaTen }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.tenDangNhap }}</td>
              <td>
                <span class="badge bg-light text-dark border small px-2 py-1">
                  {{ user.vaiTro }}
                </span>
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-outline-secondary me-2"
                  @click="handleOpenForm('edit', user.vaiTro, user)"
                >
                  <FontAwesomeIcon icon="fa-solid fa-pen" />
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteUser(user._id)"
                >
                  <FontAwesomeIcon icon="fa-solid fa-trash" />
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center text-muted py-3 fst-italic">
                Không có người dùng nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <Form
      v-if="
        formStore.isCurrent(
          formMode == 'add' ? formNameAddUser : formNameEditUser
        )
      "
      :key="`${formData.vaiTro}-${formMode}-${formData._id || 'new'}`"
      :input-fields="dataObj[formData.vaiTro].fields"
      :input-data="formData"
      :form-name="formMode === 'add' ? formNameAddUser : formNameEditUser"
      :api="api"
      :method="formMode === 'add' ? 'POST' : 'PUT'"
      modal-id="userModal"
      @submitted="handleFormSubmitted" 
      @updated="handleFormSubmitted"   
      @closed="formStore.closeForm"
      @error="handleFormError"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import axios from "axios";
import Form from "@/components/common/form/Form.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useFormStore } from "@/stores/formStore";
import { computed } from "vue";
const formStore = useFormStore();
import {
  adminFields,
  nguoiHamMoFields,
  playerFields,
  huanLuyenVienFields,
} from "@/utils/constanst";
const users = ref([]);
const roleUserAdded = ref("");
const roleUserArrange = ref("all");
const formMode = ref("add");
const formData = ref({});
const formNameAddUser = ref("");
const formNameEditUser = ref("");
const squad = ref([]);
const arrangeUsers = ref([]);
const searchQuery = ref("");
const api = computed(() => {
  const baseUrl = `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung`;

  if (formMode.value === "add") {
    return baseUrl;
  } else {
    // Kiểm tra xem có _id không
    if (!formData.value._id) {
      console.error("❌ Không có ID người dùng để chỉnh sửa");
      throw new Error("Không có ID người dùng. Vui lòng thử lại!");
    }
    return `${baseUrl}/${formData.value._id}`;
  }
});
const viTriOptions = [
  { name: "Tiền đạo" },
  { name: "Tiền vệ" },
  { name: "Hậu vệ" },
];

const handleSearch = () => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === "") {
    handleArrange(roleUserArrange.value);
  } else {
    arrangeUsers.value = users.value.filter((user) =>
      user.hoVaTen.toLowerCase().includes(query)
    );
  }
};

// --- Mapping
const dataObj = {
  admin: { fields: adminFields },
  nguoihammo: { fields: nguoiHamMoFields },
  cauthu: { fields: playerFields },
  huanluyenvien: { fields: huanLuyenVienFields },
};

// --- API
const fetchSquad = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/`
  );
  squad.value = res.data.map((i) => ({ _id: i._id, name: i.doiHinh }));
};
const fetchUsers = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/`
    );
    users.value = res.data;
    // Tự động cập nhật filtered users sau khi fetch
    handleArrange(roleUserArrange.value);
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách người dùng:", error);
    alert("Có lỗi xảy ra khi tải danh sách người dùng!");
  }
};

// SỬA LẠI HÀM DELETE ĐỂ TỰ ĐỘNG CẬP NHẬT
const deleteUser = async (id) => {
  if (!confirm("Xóa người dùng này?")) return;
  try {
    await axios.delete(`${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/${id}`);
    // Fetch lại danh sách sau khi xóa
    await fetchUsers();
    // Cập nhật lại filtered users
    handleArrange(roleUserArrange.value);
  } catch (error) {
    console.error("❌ Lỗi khi xóa người dùng:", error);
    alert("Có lỗi xảy ra khi xóa người dùng!");
  }
};


async function handleOpenForm(mode, vaiTro, user = null) {
  formMode.value = mode;
  formData.value = mode === "add" ? { vaiTro } : { ...user };

  if (vaiTro === "cauthu" || vaiTro === "huanluyenvien") await fetchSquad();

  formNameAddUser.value = "Thêm người dùng";
  formNameEditUser.value = "Chỉnh sửa thông tin";
  formStore.openForm(
    mode === "add" ? formNameAddUser.value : formNameEditUser.value
  );
}
const handleArrange = (role) => {
  if (role === 'all') {
    arrangeUsers.value = [...users.value]; // Tạo bản copy để đảm bảo reactivity
  } else {
    arrangeUsers.value = users.value.filter((user) => user.vaiTro === role);
  }
};

const handleFormSubmitted = (responseData) => {
  console.log("✅ Form submitted successfully:", responseData);
  
  // Fetch lại danh sách người dùng
  fetchUsers();
  
  // Đóng form
  formStore.closeForm();
  
  // Reset form data
  formData.value = {};
  formMode.value = "add";
};

// THÊM HÀM XỬ LÝ LỖI
const handleFormError = (error) => {
  console.error("❌ Form error:", error);
  alert("Có lỗi xảy ra khi xử lý form!");
  formStore.closeForm();
};
onMounted(async () => {
  await fetchUsers();
  handleArrange(roleUserArrange.value);
});
</script>

<style scoped>
.table {
  font-size: 0.9rem;
}
.card {
  border-radius: 12px;
}
select.form-select,
button.btn {
  border-radius: 6px;
}
</style>
