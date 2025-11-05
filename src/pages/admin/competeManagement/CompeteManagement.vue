<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./competeManagement.module.scss";
import Form from "@/components/common/form/Form.vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import { useFormStore } from "@/stores/formStore";
import SeasonCard from "@/components/common/cards/seasonCard/SeasonCard.vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const formStore = useFormStore();
const router = useRouter();
const cx = classNames.bind(styles);

// --- STATE ---
const seasonList = ref([]);
const competitions = ref([]);
const currentSeason = ref(null);
const showSeasonForm = ref(false);
const showEditSeasonForm = ref(false);
const currentEditSeason = ref(null);

// API endpoints
const seasonApi = "http://localhost:5000/muagiai";
const competitionApi = "http://localhost:5000/giaidau";

// --- FORM FIELDS ---
const seasonFields = [
  {
    name: "namBatDau",
    label: "Năm bắt đầu",
    type: "number",
    required: true,
    placeholder: "VD: 2024",
    min: 2000,
    max: 2030,
  },
  {
    name: "namKetThuc",
    label: "Năm kết thúc",
    type: "number",
    required: true,
    placeholder: "VD: 2025",
    min: 2000,
    max: 2030,
  },
];

const competitionFields = [
  { name: "tenGiaiDau", label: "Tên giải đấu", type: "text" },
  { name: "moTa", label: "Mô tả", type: "textarea" },
];

// --- FETCH FUNCTIONS ---
const fetchSeasons = async () => {
  try {
    const res = await axios.get(seasonApi);
    seasonList.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách mùa giải:", error);
  }
};

const fetchCompetitions = async (seasonId) => {
  try {
    const res = await axios.get(`${competitionApi}?seasonId=${seasonId}`);
    competitions.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách giải đấu:", error);
  }
};

// --- SEASON MENU ACTIONS ---
const seasonMenuItems = [
  {
    label: "Chỉnh sửa",
    action: (item) => handleEditSeason(item),
  },
  {
    label: "Xem chi tiết",
    action: (item) => viewSeasonDetails(item),
  },
  {
    label: "Quản lý giải đấu",
    action: (item) => manageSeasonTournaments(item),
  },
  {
    label: "Xóa",
    action: (item) => deleteSeason(item),
  },
];

// Hàm mở form thêm mùa giải
const openSeasonForm = () => {
  showSeasonForm.value = true;
};

// Hàm xử lý chỉnh sửa mùa giải
const handleEditSeason = (item) => {
  console.log("Mở form chỉnh sửa mùa giải:", item);
  currentEditSeason.value = item;
  showEditSeasonForm.value = true;
};

// Hàm xử lý xem chi tiết mùa giải
const viewSeasonDetails = (item) => {
  console.log("Xem chi tiết mùa giải:", item);
  // Điều hướng đến trang chi tiết mùa giải
  router.push(`/admin/compete/seasons/${item._id}`);
};

// Hàm xử lý quản lý giải đấu
const manageSeasonTournaments = (item) => {
  console.log("Quản lý giải đấu:", item);
  // Điều hướng đến trang quản lý giải đấu
  router.push(`/admin/compete/seasons/${item._id}/tournaments`);
};

// Hàm xử lý xóa mùa giải
const deleteSeason = async (item) => {
  console.log("Xóa mùa giải:", item);
  const seasonName = `${item.namBatDau}-${item.namKetThuc}`;
  if (confirm(`Bạn có chắc muốn xóa mùa giải "${seasonName}"?`)) {
    try {
      await axios.delete(`${seasonApi}/${item._id}`);
      console.log("Đã xóa mùa giải thành công");
      await fetchSeasons(); // Reload danh sách
    } catch (error) {
      console.error("Lỗi khi xóa mùa giải:", error);
      alert("Có lỗi xảy ra khi xóa mùa giải!");
    }
  }
};

// Hàm đóng form thêm mùa giải
const closeSeasonForm = () => {
  showSeasonForm.value = false;
};

// Hàm đóng form chỉnh sửa mùa giải
const closeEditSeasonForm = () => {
  showEditSeasonForm.value = false;
  currentEditSeason.value = null;
};

// Hàm xử lý sau khi submit form thêm mùa giải
const handleSeasonSubmitted = () => {
  fetchSeasons();
  closeSeasonForm();
};

// Hàm xử lý sau khi submit form chỉnh sửa mùa giải
const handleEditSeasonSubmitted = () => {
  fetchSeasons();
  closeEditSeasonForm();
};

// Validation: Kiểm tra năm kết thúc phải >= năm bắt đầu
const validateSeasonYears = (formData) => {
  if (parseInt(formData.namKetThuc) < parseInt(formData.namBatDau)) {
    alert("Năm kết thúc phải lớn hơn hoặc bằng năm bắt đầu!");
    return false;
  }
  return true;
};
const goBack = () => {
  window.history.back();
};
onMounted(fetchSeasons);
</script>

<template>
  <div :class="cx('')">
    <!-- Header -->
    <div class="d-flex justify-content-between">
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
        <span class="m-0">Danh sách mùa giải</span>
      </h2>
      <button type="button" class="btn btn-primary" @click="openSeasonForm">
        <i class="fas fa-plus me-2"></i>
        Tạo mùa giải
      </button>
    </div>

    <!-- Season list -->
    <div :class="cx('season-list', 'mt-4')">
      <h4 class="text-secondary mb-3">Danh sách mùa giải</h4>

      <div class="row g-3">
        <div
          v-for="season in seasonList"
          :key="season._id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <SeasonCard :item="season" :menu-items="seasonMenuItems" />
        </div>

        <!-- Hiển thị khi không có mùa giải nào -->
        <div v-if="seasonList.length === 0" class="col-12 text-center py-5">
          <p class="text-muted">Chưa có mùa giải nào.</p>
          <button class="btn btn-primary" @click="openSeasonForm">
            <i class="fas fa-plus me-2"></i>
            Tạo mùa giải đầu tiên
          </button>
        </div>
      </div>
    </div>

    <!-- Form thêm mùa giải mới -->
    <Form
      v-if="showSeasonForm"
      form-name="Thêm mùa giải mới"
      :input-fields="seasonFields"
      :api="seasonApi"
      method="POST"
      :transform-data="validateSeasonYears"
      @submitted="handleSeasonSubmitted"
      @closed="closeSeasonForm"
    />

    <!-- Form chỉnh sửa mùa giải -->
    <Form
      v-if="showEditSeasonForm"
      form-name="Chỉnh sửa mùa giải"
      :input-fields="seasonFields"
      :input-data="currentEditSeason"
      :api="`${seasonApi}/${currentEditSeason?._id}`"
      method="PUT"
      :transform-data="validateSeasonYears"
      @submitted="handleEditSeasonSubmitted"
      @closed="closeEditSeasonForm"
    />
  </div>
</template>

<style scoped>
.wrapper {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.season-list {
  border-top: 1px solid #dee2e6;
  padding-top: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header h2 {
    margin-bottom: 0;
  }
}
</style>
