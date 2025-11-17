<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
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
        <span class="m-0"
          >Chi tiết đội hình -
          {{ squadInfo?.tenDoiHinh || "Đang tải..." }}</span
        >
      </h2>
      
      <div class="d-flex gap-2">
        <!--
      
        <button class="btn btn-outline-primary" @click="refreshData">
          <FontAwesomeIcon icon="fa-solid fa-refresh" class="me-2" />
          Làm mới
        </button>
      
      -->
        <button class="btn text-white" @click="handleAddPlayerToSquad" style="background-color: var(--primary-color);">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-2" />
          Thêm cầu thủ
        </button>
      </div>
    </div>
    <h4 class="text-secondary mb-3">Thông tin đội hình</h4>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="text-muted mt-2">Đang tải danh sách cầu thủ...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
    <div v-else-if="squadInfo" class="card mb-4">

      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h5 class="card-title text-primary">{{ squadInfo.tenDoiHinh }}</h5>
            <p class="card-text mb-1">
              <strong>Mã đội hình:</strong> {{ squadInfo.maDoiHinh || "Chưa có" }}
            </p>
            <p class="card-text mb-1">
              <strong>Mô tả:</strong> {{ squadInfo.moTa || "Chưa có mô tả" }}
            </p>
            <p class="card-text mb-0">
              <strong>Trạng thái:</strong>
              <span :class="getStatusClass(squadInfo.trangThai)">
                {{ getStatusText(squadInfo.trangThai) }}
              </span>
            </p>
          </div>
          <div class="col-md-4 text-end">
            <div class="bg-light p-3 rounded">
              <div class="fw-bold text-primary fs-4">{{ playersInSquad.length }}</div>
              <div class="text-muted">Cầu thủ trong đội hình</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-top pt-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="text-secondary mb-0">Danh sách cầu thủ trong đội hình</h4>
        <div class="text-muted small">
          Đã cập nhật lúc: {{ lastUpdated }}
        </div>
      </div>

      <div v-if="playersInSquad.length > 0" class="row g-3">
        <div
          v-for="(player, index) in playersInSquad"
          :key="player._id || index"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <PlayerCard
            :item="player"
            :menu-items="getPlayerMenuItems(player)"
            @menu-action="handleMenuAction"
          />
        </div>
      </div>

      <div v-else class="text-center py-5">
        <div class="empty-state">
          <FontAwesomeIcon
            icon="fa-solid fa-users"
            size="4x"
            class="text-muted mb-3"
          />
          <h5 class="text-muted mb-2">Chưa có cầu thủ nào</h5>
          <p class="text-muted mb-4">Thêm cầu thủ đầu tiên vào đội hình này</p>
          <button class="btn btn-primary" @click="handleAddPlayerToSquad">
            <FontAwesomeIcon icon="fa-solid fa-plus" class="me-2" />
            Thêm cầu thủ đầu tiên
          </button>
        </div>
      </div>
    </div>

    <!-- Form quản lý đội hình -->
    <ShowPlayersForm
      :items="players"
      v-if="showAddPlayerForm"
      @closed="closeAddPlayerForm"
      @players-updated="handlePlayersUpdated"
    />

    <!-- Modal chi tiết cầu thủ -->
    <div
      v-if="showPlayerDetailModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header text-black">
            <h5 class="modal-title">
              <FontAwesomeIcon icon="fa-solid fa-user" class="me-2" />
              Thông tin chi tiết cầu thủ
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closePlayerDetailModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="currentViewPlayer" class="row">
              <div class="col-md-4 text-center mb-3">
                <div class="player-avatar-container" style="border-color: grey">
                  <img
                    :src="
                      currentViewPlayer.anhMinhHoa ||
                      '/src/assets/default-avatar.png'
                    "
                    :alt="currentViewPlayer.hoVaTen"
                    class="img-fluid rounded-circle player-avatar"
                    style="width: 200px; height: 200px; object-fit: cover"
                  />
                </div>
                <h4 class="mt-3" style="color: grey">
                  {{ currentViewPlayer.hoVaTen }}
                </h4>
                <div class="badge fs-6 mt-1">Số {{ currentViewPlayer.soAo }}</div>
              </div>

              <div class="col-md-8">
                <div class="row">
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold" style="color: grey"
                      >Vị trí</label
                    >
                    <div class="form-control bg-light">
                      {{ currentViewPlayer.viTri || "Chưa có thông tin" }}
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold" style="color: grey"
                      >Quốc tịch</label
                    >
                    <div class="form-control bg-light">
                      {{ currentViewPlayer.quocTich || "Chưa có thông tin" }}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold" style="color: grey"
                      >Ngày sinh</label
                    >
                    <div class="form-control bg-light">
                      {{
                        currentViewPlayer.ngaySinh
                          ? formatDate(currentViewPlayer.ngaySinh)
                          : "Chưa có thông tin"
                      }}
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold" style="color: grey"
                      >Tuổi</label
                    >
                    <div class="form-control bg-light">
                      {{
                        currentViewPlayer.ngaySinh
                          ? calculateAge(currentViewPlayer.ngaySinh)
                          : "Chưa có thông tin"
                      }}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold" style="color: grey"
                      >Chiều cao</label
                    >
                    <div class="form-control bg-light">
                      {{
                        currentViewPlayer.chieuCao
                          ? `${currentViewPlayer.chieuCao} cm`
                          : "Chưa có thông tin"
                      }}
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold" style="color: grey"
                      >Cân nặng</label
                    >
                    <div class="form-control bg-light">
                      {{
                        currentViewPlayer.canNang
                          ? `${currentViewPlayer.canNang} kg`
                          : "Chưa có thông tin"
                      }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold" style="color: grey"
                    >Mô tả</label
                  >
                  <div
                    class="form-control bg-light"
                    style="min-height: 100px; max-height: 200px; overflow-y: auto"
                  >
                    {{ currentViewPlayer.moTa || "Chưa có mô tả" }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold" style="color: grey"
                    >Đội hình hiện tại</label
                  >
                  <div class="form-control bg-light">
                    {{ squadInfo?.tenDoiHinh || "Chưa có thông tin" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              @click="closePlayerDetailModal"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ShowPlayersForm from "@/components/common/showPlayersForm/ShowPlayersForm.vue";

const route = useRoute();
const router = useRouter();
const squadId = route.params.squadId;

const playersInSquad = ref([]);
const players = ref([]);
const showAddPlayerForm = ref(false);
const showPlayerDetailModal = ref(false);
const squadInfo = ref(null);
const currentViewPlayer = ref(null);
const loading = ref(false);
const errorMessage = ref("");
const lastUpdateTime = ref(new Date());

// Computed property để hiển thị thời gian cập nhật
const lastUpdated = computed(() => {
  return lastUpdateTime.value.toLocaleTimeString('vi-VN');
});

// Hàm refresh dữ liệu
const refreshData = async () => {
  console.log("🔄 Đang làm mới dữ liệu...");
  try {
    loading.value = true;
      await fetchSquadInfo(),
      await fetchPlayers()
    lastUpdateTime.value = new Date();
    console.log("✅ Dữ liệu đã được làm mới");
  } catch (error) {
    console.error("❌ Lỗi khi làm mới dữ liệu:", error);
    errorMessage.value = "Có lỗi xảy ra khi làm mới dữ liệu!";
  } finally {
    loading.value = false;
  }
};

const handleViewPlayer = (player) => {
  currentViewPlayer.value = player;
  showPlayerDetailModal.value = true;
  console.log("Xem chi tiết cầu thủ:", player);
};

const handleDeletePlayer = async (player) => {
  if (!player?._id) return;

  if (
    confirm(`Bạn có chắc muốn xóa cầu thủ "${player.hoVaTen}" khỏi đội hình?`)
  ) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BE_BASE_URL}/cauthu/${
          player._id
        }/doihinh/${squadId}`,
        { withCredentials: true }
      );
      await refreshData();
      alert(`✅ Đã xóa cầu thủ "${player.hoVaTen}" khỏi đội hình!`);
    } catch (error) {
      console.error("❌ Lỗi khi xóa cầu thủ:", error);
      errorMessage.value = "Không thể xóa cầu thủ. Vui lòng thử lại!";
    }
  }
};

const getPlayerMenuItems = (player) => [
  {
    label: "Xem hồ sơ",
    icon: "fa-eye",
    action: () => handleViewPlayer(player),
    class: "text-primary",
  },
  {
    label: "Xóa khỏi đội hình",
    icon: "fa-trash",
    action: () => handleDeletePlayer(player),
    class: "text-danger",
  },
];

const handleMenuAction = ({ action, item }) => {
  if (!item) return;

  switch (action) {
    case "delete":
      handleDeletePlayer(item);
      break;
    case "view":
      handleViewPlayer(item);
      break;
  }
};

const closePlayerDetailModal = () => {
  showPlayerDetailModal.value = false;
  currentViewPlayer.value = null;
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa có thông tin";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  } catch {
    return dateString;
  }
};

const calculateAge = (birthDate) => {
  if (!birthDate) return "Chưa có thông tin";
  try {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} tuổi`;
  } catch {
    return "Không xác định";
  }
};

const fetchSquadInfo = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/${squadId}`,
      { withCredentials: true }
    );
    squadInfo.value = response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tải thông tin đội hình:", error);
    errorMessage.value = "Không thể tải thông tin đội hình. Vui lòng thử lại!";
    squadInfo.value = null;
  }
};

const fetchPlayerMaDoiHinh = async () => {
  if (!squadInfo.value) return;
  console.log("🔍 Đang tải danh sách cầu thủ...");
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/cauthu?maDoiHinh=${
        squadInfo.value.maDoiHinh
      }`,
      { withCredentials: true }
    );
    playersInSquad.value = res.data || [];
    console.log(`📋 Đã tải ${playersInSquad.value.length} cầu thủ trong đội hình`);
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách cầu thủ:", error);
    playersInSquad.value = [];
    errorMessage.value = "Không thể tải danh sách cầu thủ. Vui lòng thử lại!";
  }
};

const fetchPlayers = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/cauthu`,
      { withCredentials: true }
    );
    players.value = response.data;
    playersInSquad.value = players.value.filter(
      (player) => player.maDoiHinh === squadInfo.value.maDoiHinh
    );
    console.log(`📋 Đã tải ${players.value.length} cầu thủ`);
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách cầu thủ:", error);
    players.value = [];
  }
};

const handleAddPlayerToSquad = () => {
  showAddPlayerForm.value = true;
};

const closeAddPlayerForm = () => {
  showAddPlayerForm.value = false;
};

// QUAN TRỌNG: Sửa event handler này
const handlePlayersUpdated = (updatedPlayers) => {
  console.log("🎯 Nhận được sự kiện cập nhật từ form:", updatedPlayers);
  refreshData();
  closeAddPlayerForm();
};

const getStatusText = (status) => {
  switch (status) {
    case "dangHoatDong":
      return "Đang hoạt động";
    case "tamNgung":
      return "Tạm ngừng";
    default:
      return "Không xác định";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "dangHoatDong":
      return "text-success";
    case "tamNgung":
      return "text-warning";
    default:
      return "text-secondary";
  }
};

const goBack = () => {
  window.history.back();
};

// Auto refresh mỗi 30 giây (tùy chọn)
let refreshInterval;
onMounted(async () => {
  console.log("squad detail dang mound")
  try {
    await refreshData();
    console.log("da refresh data")
    
    
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo:", error);
    errorMessage.value = "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!";
  }
});


</script>

<style scoped>
.empty-state {
  padding: 3rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.text-success {
  color: #198754 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-secondary {
  color: #6c757d !important;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.card-title {
  color: grey;
  margin-bottom: 1rem;
}

.player-avatar-container {
  border: 4px solid grey;
  border-radius: 50%;
  padding: 4px;
  display: inline-block;
}

.player-avatar {
  border: 2px solid #dee2e6;
}

.modal-content {
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-radius: 12px 12px 0 0;
}

@media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .player-avatar {
    width: 150px !important;
    height: 150px !important;
  }

  .modal-dialog {
    margin: 20px;
  }
}
</style>