<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { onMounted, ref, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SeasonCard from "@/components/common/cards/seasonCard/SeasonCard.vue";

const route = useRoute();
const router = useRouter();
const tournamentId = route.params.tournamentId;
const searchQuery = ref("");
// --- STATE ---
const tournamentInfo = ref({});
const seasons = ref([]);
const showSeasonForm = ref(false);
const showEditSeasonForm = ref(false);
const currentEditSeason = ref(null);
const loading = ref(false);
const errorMessage = ref("");

// --- API ENDPOINTS ---
const API_BASE = import.meta.env.VITE_API_BE_BASE_URL;
const tournamentApi = `${API_BASE}/giaidau`;
const seasonApi = `${API_BASE}/muagiai`;

// --- FORM FIELDS ---
const seasonFields = [
  {
    name: "tenMuaGiai",
    label: "Tên mùa giải",
    type: "text",
    required: true,
    placeholder: "VD: Mùa giải 2024-2025",
  },
  { name: "ngayBatDau", label: "Ngày bắt đầu", type: "date", required: true },
  { name: "ngayKetThuc", label: "Ngày kết thúc", type: "date", required: true },
  {name: "anhMinhHoa", label: "Ảnh minh họa", type: "file", required: false}
];

// --- COMPUTED ---
const hasSeasons = computed(() => seasons.value.length > 0);
const isLoading = computed(() => loading.value && !seasons.value.length);

// --- FETCH FUNCTIONS ---
const fetchTournamentInfo = async () => {
  try {
    const { data } = await axios.get(`${tournamentApi}/id/${tournamentId}`, {
      withCredentials: true,
    });
    tournamentInfo.value = data;
  } catch {
    errorMessage.value = "Không thể tải thông tin giải đấu. Vui lòng thử lại!";
  }
};

const fetchSeasonsByTournament = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const maGiaiDau = tournamentInfo.value.maGiaiDau;
    if (!maGiaiDau) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return fetchSeasonsByTournament();
    }

    const { data } = await axios.get(`${seasonApi}?maGiaiDau=${maGiaiDau}`, {
      withCredentials: true,
    });
    seasons.value = data;
  } catch {
    try {
      const { data } = await axios.get(seasonApi, { withCredentials: true });
      seasons.value = data.filter(
        (s) => s.maGiaiDau === tournamentInfo.value.maGiaiDau
      );
    } catch {
      errorMessage.value =
        "Không thể tải danh sách mùa giải. Vui lòng thử lại!";
    }
  } finally {
    loading.value = false;
  }
};

// --- ACTIONS ---
const openSeasonForm = () => (showSeasonForm.value = true);
const closeSeasonForm = () => (showSeasonForm.value = false);

const handleEditSeason = (item) => {
  currentEditSeason.value = {
    ...item,
    ngayBatDau: formatDateForInput(item.ngayBatDau),
    ngayKetThuc: formatDateForInput(item.ngayKetThuc),
  };
  showEditSeasonForm.value = true;
};

const closeEditSeasonForm = () => {
  showEditSeasonForm.value = false;
  currentEditSeason.value = null;
};

const viewSeasonDetails = (item) => {
  router.push(`/admin/compete/tournament/${tournamentId}/season/${item._id}`);
};

const deleteSeason = async (item) => {
  if (!confirm(`Bạn có chắc muốn xóa mùa giải "${item.tenMuaGiai}"?`)) return;
  try {
    await axios.delete(`${seasonApi}/id/${item._id}`, {
      withCredentials: true,
    });
    await fetchSeasonsByTournament();
  } catch {
    errorMessage.value = "Không thể xóa mùa giải. Vui lòng thử lại!";
  }
};

// --- FORM HANDLERS ---
const handleSeasonSubmitted = () => {
  fetchSeasonsByTournament();
  closeSeasonForm();
};

const handleEditSeasonSubmitted = () => {
  fetchSeasonsByTournament();
  closeEditSeasonForm();
};

const handleSeasonError = () => {
  errorMessage.value = "Có lỗi xảy ra. Vui lòng thử lại!";
};

// --- HELPERS ---
const validateSeasonDates = (formData) => {
  const start = new Date(formData.ngayBatDau);
  const end = new Date(formData.ngayKetThuc);

  if (end < start) {
    alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!");
    return false;
  }

  return { ...formData, maGiaiDau: tournamentInfo.value.maGiaiDau };
};

const formatDateForInput = (date) =>
  date ? new Date(date).toISOString().split("T")[0] : "";
const formatDateForDisplay = (date) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa cập nhật";

const goBack = () => window.history.back();

// --- LIFECYCLE ---
onMounted(async () => {
  await Promise.all([fetchTournamentInfo(), fetchSeasonsByTournament()]);
});

// --- MENU ITEMS ---
const seasonMenuItems = [
  { label: "Chỉnh sửa", action: handleEditSeason },
  { label: "Xem chi tiết", action: viewSeasonDetails },
  { label: "Xóa", action: deleteSeason, class: "text-danger" },
];

const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    fetchSeasonsByTournament();
    return;
  }

  const filtered = seasons.value.filter((season) =>
    season.tenMuaGiai.toLowerCase().includes(query)
  );
  seasons.value = filtered;
};
</script>

<template>
  <div >
    <div >
      <!-- Header -->
    <div class="d-flex align-items-center justify-content-between">
      <h2 class="m-0 d-flex align-items-center" style="color: var(--primary-color)">
        <FontAwesomeIcon
          icon="fa-solid fa-angle-left"
          @click="goBack"
          class="me-2 cursor-pointer"
        />
        <span>Chi tiết giải đấu</span>
      </h2>
      <div class="d-flex">
        <input type="text" class="form-control form-control-sm w-auto me-3 " placeholder="Tìm kiếm..." v-model="searchQuery" @input="handleSearch" />
        <button class="btn btn-primary" @click="openSeasonForm">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-1" />
          Thêm mùa giải
        </button>
      </div>
    </div>

    <!-- Thông tin giải đấu -->
    <div class="border-top pt-3 mt-3">
      <h4 class="text-secondary mb-3">Thông tin giải đấu</h4>
      <div class="card">
        <div class="card-body row">
          <div class="col-md-6">
            <h5 class="card-title text-primary">
              {{ tournamentInfo.tenGiaiDau || "Đang tải..." }}
            </h5>
            <p>
              <strong>Mã giải đấu:</strong>
              {{ tournamentInfo.maGiaiDau || "Chưa cập nhật" }}
            </p>
            <p>
              <strong>Năm thành lập:</strong>
              {{ tournamentInfo.namThanhLap || "Chưa cập nhật" }}
            </p>
          </div>
          <div class="col-md-6">
            <p>
              <strong>Mô tả:</strong>
              {{ tournamentInfo.moTa || "Chưa có mô tả" }}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Danh sách mùa giải -->
    <div class="border-top pt-3 mt-3">
      <h4 class="text-secondary mb-3">Danh sách mùa giải</h4>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="text-muted mt-2">Đang tải danh sách mùa giải...</p>
      </div>

      <div v-else-if="hasSeasons" class="row g-3">
        <div
          v-for="season in seasons"
          :key="season._id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <SeasonCard
            :item="{
              ...season,
              namBatDau: formatDateForDisplay(season.ngayBatDau),
              namKetThuc: formatDateForDisplay(season.ngayKetThuc),
            }"
            :menu-items="seasonMenuItems"
          />
        </div>
      </div>

      <div v-else class="text-center py-5">
        <p class="text-muted">Chưa có mùa giải nào trong giải đấu này.</p>
        <button class="btn btn-primary" @click="openSeasonForm">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-1" />
          Thêm mùa giải đầu tiên
        </button>
      </div>
    </div>

    <!-- Form -->
    <Form
      v-if="showSeasonForm"
      form-name="Thêm mùa giải mới"
      :input-fields="seasonFields"
      :api="seasonApi"
      method="POST"
      :orther-data="{ maGiaiDau: tournamentInfo.maGiaiDau }"
      :transform-data="validateSeasonDates"
      @submitted="handleSeasonSubmitted"
      @error="handleSeasonError"
      @closed="closeSeasonForm"
    />

    <Form
      v-if="showEditSeasonForm && currentEditSeason"
      form-name="Chỉnh sửa mùa giải"
      :input-fields="seasonFields"
      :input-data="currentEditSeason"
      :api="`${seasonApi}/id/${currentEditSeason._id}`"
      method="PUT"
      :orther-data="{ maGiaiDau: tournamentInfo.maGiaiDau }"
      :transform-data="validateSeasonDates"
      @submitted="handleEditSeasonSubmitted"
      @error="handleSeasonError"
      @closed="closeEditSeasonForm"
    />
  </div>
</template>

<style scoped>
h2 {
  
}
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
.btn-primary:hover {
  background-color: var(--primary-dark-color);
  border-color: var(--primary-dark-color);
}
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}
.card-title {
  color: var(--primary-color);
  margin-bottom: 1rem;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
