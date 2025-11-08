<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./competeManagement.module.scss";
import Form from "@/components/common/form/Form.vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import TournamentCard from "@/components/common/cards/tournamentCard/TournamentCard.vue";

const router = useRouter();
const cx = classNames.bind(styles);

// --- STATE ---
const tournaments = ref([]);
const showTournamentForm = ref(false);
const showEditTournamentForm = ref(false);
const currentEditTournament = ref(null);
const loading = ref(false);
const errorMessage = ref("");

// API endpoints
const tournamentApi = `${import.meta.env.VITE_API_BE_BASE_URL}/giaidau`;

// --- FORM FIELDS ---
const tournamentFields = [
  {
    name: "tenGiaiDau",
    label: "Tên giải đấu",
    type: "text",
    required: true,
    placeholder: "Nhập tên giải đấu",
  },
  {
    name: "namThanhLap",
    label: "Năm thành lập",
    type: "number",
    required: false, // 🆕 Không bắt buộc
    placeholder: "VD: 2024",
    min: 1900,
    max: 2030,
  },
  {
    name: "moTa",
    label: "Mô tả",
    type: "textarea",
    placeholder: "Nhập mô tả giải đấu",
  },
];

// --- FETCH FUNCTIONS ---
const fetchTournaments = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await axios.get(tournamentApi, {
      withCredentials: true,
    });
    tournaments.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách giải đấu:", error);
    errorMessage.value = "Không thể tải danh sách giải đấu. Vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
};

// --- TOURNAMENT MENU ACTIONS ---
const tournamentMenuItems = [
  {
    label: "Chỉnh sửa",
    action: (item) => handleEditTournament(item),
  },
  {
    label: "Xem chi tiết",
    action: (item) => viewTournamentDetails(item),
  },
  {
    label: "Xóa",
    action: (item) => deleteTournament(item),
    class: "text-danger",
  },
];

// Hàm mở form thêm giải đấu
const openTournamentForm = () => {
  showTournamentForm.value = true;
  errorMessage.value = "";
};

// Hàm xử lý chỉnh sửa giải đấu
const handleEditTournament = (item) => {
  console.log("Mở form chỉnh sửa giải đấu:", item);
  currentEditTournament.value = item;
  showEditTournamentForm.value = true;
  errorMessage.value = "";
};

// Hàm xử lý xem chi tiết giải đấu
// Hàm xử lý xem chi tiết giải đấu
const viewTournamentDetails = (item) => {
  console.log("Xem chi tiết giải đấu:", item);

  // Debug: kiểm tra router và routes
  console.log("Router available:", router);
  console.log("Current routes:", router.getRoutes());

  try {
    // Điều hướng đến trang chi tiết giải đấu
    router.push(`/admin/compete/tournament/${item._id}`).catch((err) => {
      console.error("Lỗi điều hướng:", err);
      alert("Không thể điều hướng đến trang chi tiết giải đấu");
    });
  } catch (error) {
    console.error("Lỗi khi điều hướng:", error);
  }
};

// Hàm xử lý xóa giải đấu
const deleteTournament = async (item) => {
  const tournamentName = item.tenGiaiDau;
  if (!confirm(`Bạn có chắc muốn xóa giải đấu "${tournamentName}"?`)) {
    return;
  }

  try {
    await axios.delete(`${tournamentApi}/ma/${item.maGiaiDau}`, {
      withCredentials: true,
    });
    console.log("Đã xóa giải đấu thành công");
    await fetchTournaments();
  } catch (error) {
    console.error("Lỗi khi xóa giải đấu:", error);
    errorMessage.value = "Không thể xóa giải đấu. Vui lòng thử lại!";
  }
};

// Hàm đóng form thêm giải đấu
const closeTournamentForm = () => {
  showTournamentForm.value = false;
  errorMessage.value = "";
};

// Hàm đóng form chỉnh sửa giải đấu
const closeEditTournamentForm = () => {
  showEditTournamentForm.value = false;
  currentEditTournament.value = null;
  errorMessage.value = "";
};

// Hàm xử lý sau khi submit form thêm giải đấu
const handleTournamentSubmitted = () => {
  fetchTournaments();
  closeTournamentForm();
};

// Hàm xử lý sau khi submit form chỉnh sửa giải đấu
const handleEditTournamentSubmitted = () => {
  fetchTournaments();
  closeEditTournamentForm();
};

// Hàm xử lý lỗi
const handleTournamentError = (error) => {
  console.error("Lỗi khi xử lý giải đấu:", error);
  errorMessage.value = "Có lỗi xảy ra. Vui lòng thử lại!";
};

const goBack = () => {
  window.history.back();
};

onMounted(() => {
  fetchTournaments();
});
</script>

<template>
  <div :class="cx('wrapper')">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center">
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
        <span class="m-0">Quản lý giải đấu</span>
      </h2>
      <button type="button" class="btn btn-primary" @click="openTournamentForm">
        <FontAwesomeIcon icon="fa-solid fa-plus" class="me-2" />
        Thêm giải đấu
      </button>
    </div>

    <!-- Tournaments Section -->
    <div class="border-top pt-3 border-secondary-subtle mt-3">
      <h4 class="text-secondary mb-3">Danh sách giải đấu</h4>

      <!-- Error message -->
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="text-muted mt-2">Đang tải danh sách giải đấu...</p>
      </div>

      <!-- Tournaments list -->
      <div v-else-if="tournaments.length > 0" class="row g-3">
        <div
          v-for="tournament in tournaments"
          :key="tournament._id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <TournamentCard
            :item="tournament"
            :menu-items="tournamentMenuItems"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="col-12 text-center py-5">
        <p class="text-muted">Chưa có giải đấu nào.</p>
        <button class="btn btn-primary" @click="openTournamentForm">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-2" />
          Thêm giải đấu đầu tiên
        </button>
      </div>
    </div>

    <!-- Form thêm giải đấu mới -->
    <Form
      v-if="showTournamentForm"
      form-name="Thêm giải đấu mới"
      :input-fields="tournamentFields"
      :api="tournamentApi"
      method="POST"
      @submitted="handleTournamentSubmitted"
      @error="handleTournamentError"
      @closed="closeTournamentForm"
    />

    <!-- Form chỉnh sửa giải đấu -->
    <Form
      v-if="showEditTournamentForm && currentEditTournament"
      form-name="Chỉnh sửa giải đấu"
      :input-fields="tournamentFields"
      :input-data="currentEditTournament"
      :api="`${tournamentApi}/id/${currentEditTournament._id}`"
      method="PUT"
      @submitted="handleEditTournamentSubmitted"
      @error="handleTournamentError"
      @closed="closeEditTournamentForm"
    />
  </div>
</template>

<style scoped>
.wrapper {
  padding: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
