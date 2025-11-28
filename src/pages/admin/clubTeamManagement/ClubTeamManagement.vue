<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2
        class="m-0 d-flex align-items-center"
        style="color: var(--primary-color)"
      >
        <FontAwesomeIcon
          icon="fa-solid fa-angle-left"
          @click="goBack()"
          class="me-2"
          style="cursor: pointer"
        />
        <span class="m-0">Quản lý Đội bóng Câu lạc bộ</span>
      </h2>
      <button class="btn text-white" @click="openTeamForm" style="background-color: var(--button-primary-color);">
        <FontAwesomeIcon icon="fa-solid fa-plus" class="me-1" />
        Thêm đội bóng
      </button>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="text-muted mt-2">Đang tải danh sách đội bóng...</p>
    </div>

    <!-- Teams Grid -->
    <div v-else-if="teams.length > 0" class="row g-4  border-top mt-3">
      <h4 class="pt-3 m-0 text-secondary">Danh sách đội bóng</h4>
      <div
        v-for="team in teams"
        :key="team._id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mt-3"
      >
        <ClubTeamCard
          :item="team"
          :menu-items="teamMenuItems"
          :show-details="true"
          :show-logo="true"
          @menu-action="handleMenuAction"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-5 border-top">
      <div class="empty-state">
        <FontAwesomeIcon
          icon="fa-solid fa-people-group"
          size="4x"
          class="text-muted mb-3"
        />
        <h5 class="text-muted mb-2">Chưa có đội bóng nào</h5>
        <p class="text-muted mb-4">
          Bắt đầu bằng cách thêm đội bóng đầu tiên của bạn
        </p>
        <button class="btn btn-primary btn-lg" @click="openTeamForm">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-2" />
          Thêm đội bóng đầu tiên
        </button>
      </div>
    </div>

    <!-- Form thêm đội bóng mới -->
    <Form
      v-if="showTeamForm"
      :input-fields="teamFields"
      form-name="Thêm đội bóng mới"
      :api="teamApi"
      method="POST"
      :transform-data="transformTeamData"
      @submitted="handleTeamSubmitted"
      @error="handleTeamError"
      @closed="closeTeamForm"
    />

    <!-- Form chỉnh sửa đội bóng -->
    <Form
      v-if="showEditTeamForm && currentEditTeam"
      :input-fields="teamFields"
      form-name="Chỉnh sửa đội bóng"
      :input-data="currentEditTeam"
      :api="editTeamApi"
      method="PUT"
      :transform-data="transformTeamData"
      @submitted="handleEditTeamSubmitted"
      @error="handleTeamError"
      @closed="closeEditTeamForm"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, computed, h } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Form from "@/components/common/form/Form.vue";
import ClubTeamCard from "@/components/common/cards/clubTeamCard/ClubTeamCard.vue";

const router = useRouter();

// --- STATE ---
const teams = ref([]);
const showTeamForm = ref(false);
const showEditTeamForm = ref(false);
const currentEditTeam = ref(null);
const loading = ref(false);
const errorMessage = ref("");

// --- API ---
const teamApi = `${import.meta.env.VITE_API_BE_BASE_URL}/doibong`;

// --- MENU ITEMS (SỬA LẠI) ---
const teamMenuItems = [
  {
    label: "Chỉnh sửa",
    icon: "fa-pen-to-square", // SỬA: string thay vì array
    action: (item) => {
      handleEditTeam(item);
    }, // SỬA: string action thay vì function
  },
  {
    label: "Xem chi tiết",
    icon: "fa-eye", // SỬA: string thay vì array
    action: (item) => {
      handleViewTeam(item);
    }, // SỬA: string action thay vì function
  },
  {
    label: "Xóa",
    icon: "fa-trash", // SỬA: string thay vì array
    action: () => {
      handleDeleteTeam(item);
    }, // SỬA: string action thay vì function
  },
];

// --- COMPUTED ---
const editTeamApi = computed(() => {
  if (currentEditTeam.value?._id) {
    return `${teamApi}/id/${currentEditTeam.value._id}`;
  }
  return "";
});

const isLoading = computed(() => loading.value && teams.value.length === 0);

// --- FORM FIELDS ---
const teamFields = [
  {
    name: "tenDoiBong",
    type: "text",
    label: "Tên đội bóng",
    placeholder: "Nhập tên đội bóng",
    required: true,
  },
  {
    name: "gioiTinh",
    type: "select",
    label: "Giới tính",
    children:[
      { value: "nam", name: "Nam" },
      { value: "nu", name: "Nữ" },
    ]
  },
  {
    name: "sanNha",
    type: "text",
    label: "Sân nhà",
    placeholder: "Nhập tên sân nhà",
    required: true,
  },
  {
    name: "anhMinhHoa",
    type: "file",
    label: "URL Logo",
    placeholder: "https://example.com/logo.png",
    description: "Đường dẫn đến hình ảnh logo của đội bóng",
  },
];

// --- FETCH ---
const fetchClubTeam = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const response = await axios.get(teamApi, { withCredentials: true });
    teams.value = response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách đội bóng:", error);
    errorMessage.value = "Không thể tải danh sách đội bóng. Vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
};

// --- MENU ACTION HANDLER (THÊM MỚI) ---
const handleMenuAction = ({ action, item }) => {
  switch (action) {
    case "edit":
      handleEditTeam(item);
      break;
    case "view":
      handleViewTeam(item);
      break;
    case "delete":
      handleDeleteTeam(item);
      break;
    default:
      console.warn("⚠️ Action không xác định:", action);
  }
};

// --- ACTION HANDLERS ---
const handleEditTeam = (team) => {
  currentEditTeam.value = team;
  showEditTeamForm.value = true;
  errorMessage.value = "";
};

const handleViewTeam = (team) => {
  router.push(`/admin/clubteam/${team._id}`);
};

const handleDeleteTeam = async (team) => {
  if (!team?._id) {
    return;
  }

  if (confirm(`Bạn có chắc muốn xóa đội bóng "${team.tenDoiBong}"?`)) {
    try {
      await axios.delete(`${teamApi}/id/${team._id}`, {
        withCredentials: true,
      });
      await fetchClubTeam();
    } catch (error) {
      console.error("❌ Lỗi khi xóa đội bóng:", error);
      errorMessage.value = "Không thể xóa đội bóng. Vui lòng thử lại!";
    }
  }
};

const openTeamForm = () => {
  showTeamForm.value = true;
  errorMessage.value = "";
};

const closeTeamForm = () => {
  showTeamForm.value = false;
  errorMessage.value = "";
};

const closeEditTeamForm = () => {
  showEditTeamForm.value = false;
  currentEditTeam.value = null;
  errorMessage.value = "";
};

const handleTeamSubmitted = () => {
  fetchClubTeam();
  closeTeamForm();
};

const handleEditTeamSubmitted = () => {
  fetchClubTeam();
  closeEditTeamForm();
};

const handleTeamError = (error) => {
  console.error("⚠️ Lỗi khi xử lý đội bóng:", error);
  errorMessage.value =
    error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
};

// --- TRANSFORM ---
const transformTeamData = (formData) => {
  const transformedData = {
    tenDoiBong: formData.tenDoiBong,
    sanNha: formData.sanNha,
    logoUrl: formData.logoUrl || "",
  };
  return transformedData;
};

// --- MISC ---
const goBack = () => window.history.back();

onMounted(fetchClubTeam);
</script>

<style scoped>
.empty-state {
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}
</style>
