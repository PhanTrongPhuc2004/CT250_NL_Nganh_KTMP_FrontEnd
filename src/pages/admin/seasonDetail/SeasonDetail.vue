<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import TournamentCard from "@/components/common/cards/tournamentCard/TournamentCard.vue";
const route = useRoute();
const router = useRouter();
const seasonId = route.params.seasonId;
console.log("seasonId", seasonId);
const tournaments = ref([]);
const showTournamentForm = ref(false);
const showEditTournamentForm = ref(false);
const currentEditTournament = ref(null);
const editTournamentApi = `${import.meta.env.VITE_API_BE_BASE_URL}/giaidau/${
  currentEditTournament?._id
}`;
const addTournamentApi = `${import.meta.env.VITE_API_BE_BASE_URL}/giaidau`;
// Fields cho form thêm và chỉnh sửa
const tournamentFields = [
  {
    name: "tenGiaiDau",
    label: "Tên giải đấu",
    type: "text",
    required: true,
  },
  {
    name: "moTa",
    label: "Mô tả",
    type: "textarea",
  },
];

// Menu items cho tournament card
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
    label: "Quản lý trận đấu",
    action: (item) => manageTournamentMatches(item),
  },
  {
    label: "Xóa",
    action: (item) => deleteTournament(item),
  },
];

// Hàm xử lý chỉnh sửa giải đấu
const handleEditTournament = (item) => {
  console.log("Mở form chỉnh sửa giải đấu:", item);
  currentEditTournament.value = item;
  showEditTournamentForm.value = true;
};

// Hàm xử lý xem chi tiết
const viewTournamentDetails = (item) => {
  console.log("Xem chi tiết giải đấu:", item);
  // Điều hướng đến trang chi tiết giải đấu
  router.push(`/admin/compete/seasons/${seasonId}/tournaments/${item._id}`);
};

// Hàm xử lý quản lý trận đấu
const manageTournamentMatches = (item) => {
  console.log("Quản lý trận đấu:", item);
  // Điều hướng đến trang quản lý trận đấu
  router.push(`/tournament/${item._id}/matches`);
};

// Hàm xử lý xóa giải đấu
const deleteTournament = async (item) => {
  console.log("Xóa giải đấu:", item);
  if (confirm(`Bạn có chắc muốn xóa giải đấu "${item.tenGiaiDau}"?`)) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BE_BASE_URL}/giaidau/${item._id}`
      );
      console.log("Đã xóa giải đấu thành công");
      await fetchTournamentBySeason(seasonId); // Reload danh sách
    } catch (error) {
      console.error("Lỗi khi xóa giải đấu:", error);
      alert("Có lỗi xảy ra khi xóa giải đấu!");
    }
  }
};

// Hàm đóng form chỉnh sửa
const closeEditTournamentForm = () => {
  showEditTournamentForm.value = false;
  currentEditTournament.value = null;
};

// Hàm xử lý sau khi submit form chỉnh sửa
const handleEditSubmitted = () => {
  fetchTournamentBySeason(seasonId);
  closeEditTournamentForm();
};

// Fetch danh sách giải đấu theo mùa giải
const fetchTournamentBySeason = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/muagiai/${id}/giaidau`
    );
    tournaments.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách giải đấu:", error);
  }
};

// Hàm mở form thêm giải đấu
const openTournamentForm = () => {
  showTournamentForm.value = true;
};

// Hàm xử lý sau khi thêm giải đấu thành công
const handleAddTournamentSubmitted = () => {
  fetchTournamentBySeason(seasonId);
  showTournamentForm.value = false;
};

onMounted(() => {
  fetchTournamentBySeason(seasonId);
});

const goBack = () => {
  window.history.back();
};
</script>

<template>
  <div>
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
        <span class="m-0">Chi tiết mùa giải</span>
      </h2>
      <button class="btn btn-primary" @click="openTournamentForm">
        <i class="fas fa-plus me-2"></i>
        Thêm giải đấu
      </button>
    </div>

    <div class="border-top pt-3 border-secondary-subtle mt-3">
      <h4 class="text-secondary mb-3">Danh sách giải đấu</h4>
      <div class="row g-3">
        <div
          v-for="(tournament, index) in tournaments"
          :key="tournament._id || index"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <TournamentCard
            :item="tournament"
            :menu-items="tournamentMenuItems"
          />
        </div>

        <div v-if="tournaments.length === 0" class="col-12 text-center py-5">
          <p class="text-muted">Chưa có giải đấu nào trong mùa giải này.</p>
          <button class="btn btn-primary" @click="openTournamentForm">
            <i class="fas fa-plus me-2"></i>
            Thêm giải đấu đầu tiên
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Form thêm giải đấu mới -->
  <Form
    form-name="Thêm giải đấu mới"
    :input-fields="tournamentFields"
    v-if="showTournamentForm"
    :api="addTournamentApi"
    :orther-data="{ muaGiaiId: seasonId }"
    method="POST"
    @submitted="handleAddTournamentSubmitted"
    @closed="showTournamentForm = false"
  />

  <!-- Form chỉnh sửa giải đấu -->
  <Form
    form-name="Chỉnh sửa giải đấu"
    :input-fields="tournamentFields"
    v-if="showEditTournamentForm"
    :input-data="currentEditTournament"
    :api="editTournamentApi"
    method="PUT"
    @submitted="handleEditSubmitted"
    @closed="closeEditTournamentForm"
  />
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
