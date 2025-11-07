<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-primary" @click="handleOpenForm">
        <FontAwesomeIcon icon="fa-solid fa-plus" />
        Thêm đội hình
      </button>
    </div>

    <div class="pt-3 mt-4 border-top">
      <h4 class="text-secondary mb-3">Danh sách đội hình</h4>

      <!-- Loading state -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="squads.length === 0" class="text-center text-muted py-4">
        <p>Chưa có đội hình nào. Hãy thêm đội hình đầu tiên!</p>
      </div>

      <!-- Danh sách đội hình -->
      <div v-else class="">
        <div class="d-flex flex-wrap gap-3">
          <SquadCard
            :item="squad"
            :menu-items="squadMenuItems"
            v-for="squad in squads"
            :key="squad._id"
          />
        </div>
      </div>

      <!-- TRONG SQUAD MANAGEMENT TEMPLATE -->
      <Form
        v-if="formStore.isCurrent('Thêm đội hình')"
        :input-fields="squadFields"
        form-name="Thêm đội hình"
        :api="formAction.add.api"
        :method="formAction.add.method"
        :orther-data="{ cauLacBoId }"
        @submitted="handleFormSuccess"
        @error="handleFormError"
        @closed="handleFormClosed"
      />

      <Form
        v-if="formStore.isCurrent('Chỉnh sửa đội hình') && selectedSquad"
        :input-fields="squadFields"
        form-name="Chỉnh sửa đội hình"
        :api="formAction.edit.api(selectedSquad._id)"
        :method="formAction.edit.method"
        :input-data="{ doiHinh: selectedSquad.doiHinh }"
        @updated="handleEditSuccess"
        @error="handleEditError"
        @closed="handleFormClosed"
      />

      <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Form from "@/components/common/form/Form.vue";
import { useFormStore } from "@/stores/formStore";
import { fetchClubInfo } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SquadCard from "@/components/common/cards/squadCard/SquadCard.vue";
import { useRouter } from "vue-router";
const router = useRouter();

// Reactive data
const clubInfo = ref([]);
const squads = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const selectedSquad = ref(null); // Đội hình được chọn để chỉnh sửa

// Stores
const formStore = useFormStore();

// Constants
const squadFields = [
  {
    name: "doiHinh",
    label: "Tên đội hình",
    type: "text",
    required: true,
    placeholder: "Nhập tên đội hình",
  },
];

const formAction = {
  add: {
    api: `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/`,
    method: "post",
  },
  edit: {
    api: (id) => `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/${id}`,
    method: "put",
  },
  delete: {
    api: (id) => `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/${id}`,
    method: "delete",
  },
};

const squadMenuItems = [
  {
    label: "Chỉnh sửa",
    action: (item) => handleEditSquad(item),
  },
  {
    label: "Xem chi tiết",
    action: (item) => viewSquadDetails(item),
  },
  {
    label: "Xóa đội hình",
    action: (item) => handleDeleteSquad(item),
    class: "text-danger",
  },
];
// THÊM: Method xử lý đóng form
const handleFormClosed = () => {
  formStore.closeForm();
  selectedSquad.value = null;
  errorMessage.value = "";
};
// Computed
const cauLacBoId = computed(() => {
  return clubInfo.value?.[0]?._id || null;
});

// Methods
const handleOpenForm = () => {
  errorMessage.value = "";
  selectedSquad.value = null;
  formStore.openForm("Thêm đội hình");
};

const fetchDoiHinh = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh`
    );
    squads.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách đội hình:", error);
    errorMessage.value = "Không thể tải danh sách đội hình. Vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
};
// TRONG SQUAD MANAGEMENT COMPONENT
const handleFormSuccess = (responseData) => {
  console.log("🎯 handleFormSuccess được gọi với data:", responseData);

  // Refresh danh sách sau khi thêm thành công
  fetchDoiHinh();
  errorMessage.value = "";
  formStore.closeForm();

  console.log("🔄 Đã gọi fetchDoiHinh()");
};

const handleEditSuccess = (responseData) => {
  console.log("🎯 handleEditSuccess được gọi với data:", responseData);

  fetchDoiHinh();
  errorMessage.value = "";
  selectedSquad.value = null;
  formStore.closeForm();

  console.log("🔄 Đã gọi fetchDoiHinh()");
};

const handleFormError = (error) => {
  console.error("Lỗi khi thêm đội hình:", error);
  errorMessage.value =
    error.response?.data?.message ||
    "Không thể thêm đội hình. Vui lòng thử lại!";
};

const handleEditSquad = (item) => {
  console.log("Chỉnh sửa đội hình:", item);
  selectedSquad.value = item;
  errorMessage.value = "";
  formStore.openForm("Chỉnh sửa đội hình");
};

const handleEditError = (error) => {
  console.error("Lỗi khi chỉnh sửa đội hình:", error);
  errorMessage.value =
    error.response?.data?.message ||
    "Không thể chỉnh sửa đội hình. Vui lòng thử lại!";
};

const viewSquadDetails = (item) => {
  console.log("Xem chi tiết đội hình:", item);
  router.push(`/admin/squad/${item._id}`);
  // TODO: Implement view details functionality
};

const manageSquadPlayers = (item) => {
  console.log("Quản lý cầu thủ:", item);
  // TODO: Implement manage players functionality
};

//handle delete squad
const handleDeleteSquad = async (item) => {
  try {
    if (!confirm(`Bạn có chắc muốn xóa đội hình "${item.doiHinh}"?`)) {
      return;
    }

    const response = await axios.delete(formAction.delete.api(item._id));
    console.log("Xóa thành công:", response.data);

    // Refresh danh sách sau khi xóa
    await fetchDoiHinh();
  } catch (error) {
    console.error("Lỗi khi xóa đội hình:", error);
    errorMessage.value = "Không thể xóa đội hình. Vui lòng thử lại!";
  }
};

// Lifecycle
onMounted(async () => {
  try {
    clubInfo.value = await fetchClubInfo();
    await fetchDoiHinh();
  } catch (error) {
    console.error("Lỗi khi khởi tạo component:", error);
    errorMessage.value = "Không thể tải dữ liệu. Vui lòng thử lại!";
  }
});
</script>
