<template>
  <!-- Lớp phủ nền -->
  <div 
    class="modal-backdrop fade show position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-100"
    style="z-index: 1040;"
    @click="handleClose"
  ></div>

  <!-- Form -->
  <div
    class="card border-0 shadow-sm position-fixed top-50 start-50 translate-middle col-md-10 col-lg-8"
    style="max-height: 90vh; overflow: hidden; z-index: 1050;"
  >
    <div class="position-absolute top-0 end-0 p-2" style="z-index: 10">
      <FontAwesomeIcon
        icon="fa-solid fa-close"
        class="text-muted hover-cursor fs-4"
        @click="handleClose"
      />
    </div>

    

    <!-- Header với tìm kiếm -->
    <div class="p-3 border-bottom bg-light">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <FontAwesomeIcon icon="fa-solid fa-search" />
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Tìm kiếm cầu thủ..."
              v-model="searchQuery"
            />
          </div>
        </div>
        <div class="col-md-6 text-start">
          <span class="badge bg-danger">
            {{ filteredPlayers.length }} cầu thủ
          </span>
        </div>
      </div>
    </div>

    <!-- Danh sách cầu thủ -->
    <div class="card-body p-0" style="overflow-y: auto">
      <table class="table align-middle mb-0">
        <thead class="table-light sticky-top" style="top: 0">
          <tr>
            <th class="text-center" style="width: 40px">#</th>
            <th>Cầu thủ</th>
            <th class="text-center" style="width: 100px">Số áo</th>
            <th class="text-center" style="width: 200px">Đội hình hiện tại</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in filteredPlayers" :key="player._id">
            <td class="text-center text-muted">{{ index + 1 }}</td>
            <td>
              <div class="d-flex align-items-center">
                <img
                  :src="
                    player.anhDaiDien ||
                    player.anhMinhHoa ||
                    '/src/assets/default-avatar.png'
                  "
                  :alt="player.hoVaTen"
                  class="rounded-circle me-3"
                  style="width: 40px; height: 40px; object-fit: cover"
                />
                <div>
                  <div class="fw-semibold">{{ player.hoVaTen }}</div>
                  <small class="text-muted">{{
                    player.viTri || "Chưa có vị trí"
                  }}</small>
                </div>
              </div>
            </td>
            <td class="text-center">
              <span class="badge bg-danger fs-6">{{
                player.soAo || "-"
              }}</span>
            </td>
            <td class="text-center">
              <select
                v-model="player.maDoiHinh"
                class="form-select form-select-sm"
                :class="{
                  'is-invalid': !isValidSquad(player.maDoiHinh) && player.maDoiHinh,
                  'border-warning': !player.maDoiHinh,
                }"
              >
                <option value="">-- Chưa có đội hình --</option>
                <option
                  v-for="squad in squads"
                  :key="squad._id"
                  :value="squad.maDoiHinh"
                >
                  {{ squad.tenDoiHinh }} ({{ squad.maDoiHinh }})
                </option>
              </select>
              <div
                v-if="!isValidSquad(player.maDoiHinh) && player.maDoiHinh"
                class="invalid-feedback d-block"
              >
                Đội hình không hợp lệ
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="filteredPlayers.length === 0" class="text-center py-5">
        <FontAwesomeIcon
          icon="fa-solid fa-users"
          size="3x"
          class="text-muted mb-3"
        />
        <p class="text-muted" v-if="searchQuery">
          Không tìm thấy cầu thủ phù hợp với "{{ searchQuery }}"
        </p>
        <p class="text-muted" v-else>Không có cầu thủ nào trong câu lạc bộ</p>
      </div>
    </div>

    <div
      class="card-footer bg-white border-top d-flex justify-content-between align-items-center"
    >
      <div class="text-muted small">
        <span class="me-3">
          Tổng: <strong>{{ allPlayers.length }}</strong> cầu thủ
        </span>
        <span class="me-3 text-success">
          Có đội hình: <strong>{{ playersWithSquadCount }}</strong>
        </span>
        <span class="text-warning">
          Chưa có: <strong>{{ playersWithoutSquadCount }}</strong>
        </span>
      </div>
      <div>
        
        <button
          class="btn btn-danger"
          @click="handleSubmit"
          :disabled="isSubmitting || !hasChanges"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          <FontAwesomeIcon icon="fa-solid fa-check" class="me-2" />
          {{ isSubmitting ? "Đang xử lý..." : "Cập nhật đội hình" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const emit = defineEmits(["closed", "players-updated"]);

const squads = ref([]);
const allPlayers = ref([]);
const isSubmitting = ref(false);
const searchQuery = ref("");
const originalData = ref([]);

// Computed properties
const filteredPlayers = computed(() => {
  if (!searchQuery.value) return allPlayers.value;

  const query = searchQuery.value.toLowerCase();
  return allPlayers.value.filter(
    (player) =>
      player.hoVaTen?.toLowerCase().includes(query) ||
      player.viTri?.toLowerCase().includes(query) ||
      player.soAo?.toString().includes(query)
  );
});

const playersWithSquadCount = computed(() => {
  return allPlayers.value.filter(
    (player) => player.maDoiHinh && isValidSquad(player.maDoiHinh)
  ).length;
});

const playersWithoutSquadCount = computed(() => {
  return allPlayers.value.filter(
    (player) => !player.maDoiHinh || !isValidSquad(player.maDoiHinh)
  ).length;
});

const hasChanges = computed(() => {
  if (originalData.value.length !== allPlayers.value.length) return true;

  return allPlayers.value.some((player, index) => {
    const originalPlayer = originalData.value[index];
    return originalPlayer?.maDoiHinh !== player.maDoiHinh;
  });
});

const isValidSquad = (maDoiHinh) => {
  if (!maDoiHinh) return true; // Empty is valid (no squad)
  return squads.value.some((squad) => squad.maDoiHinh === maDoiHinh);
};

// Fetch all players from club
const fetchAllPlayers = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/cauthu`,
      { withCredentials: true }
    );

    allPlayers.value = response.data.map((player) => ({
      ...player,
      maDoiHinh: player.maDoiHinh || "", // Ensure maDoiHinh exists
    }));

    console.log("📋 Danh sách cầu thủ:", allPlayers.value);
    
    // Store original data for change detection
    originalData.value = JSON.parse(JSON.stringify(allPlayers.value));
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách cầu thủ:", error);
    alert("Không thể tải danh sách cầu thủ. Vui lòng thử lại!");
  }
};

// Fetch all squads
const fetchSquads = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh`,
      { withCredentials: true }
    );

    squads.value = response.data;
    console.log("📋 Danh sách đội hình:", squads.value);
  } catch (error) {
    console.error("❌ Lỗi khi tải danh sách đội hình:", error);
    alert("Không thể tải danh sách đội hình. Vui lòng thử lại!");
  }
};

// Handle form submission - cập nhật đội hình
const handleSubmit = async () => {
  if (!hasChanges.value) {
    alert("Không có thay đổi nào để cập nhật!");
    return;
  }

  // Validate all selections
  const invalidSelections = allPlayers.value.filter(
    (player) => player.maDoiHinh && !isValidSquad(player.maDoiHinh)
  );

  if (invalidSelections.length > 0) {
    alert("Có đội hình không hợp lệ. Vui lòng kiểm tra lại!");
    return;
  }

  isSubmitting.value = true;

  try {
    const updates = [];
    
    // Cập nhật đội hình cho từng cầu thủ
    for (const player of allPlayers.value) {
      const originalPlayer = originalData.value.find(p => p._id === player._id);
      
      // Chỉ cập nhật nếu có thay đổi
      if (!originalPlayer || originalPlayer.maDoiHinh !== player.maDoiHinh) {
        updates.push({
          playerId: player._id,
          playerName: player.hoVaTen,
          maDoiHinh: player.maDoiHinh || null
        });
      }
    }

    console.log("🔄 Cập nhật đội hình:", updates);

    // Thực hiện cập nhật
    for (const update of updates) {
      try {
        await axios.patch(
          `${import.meta.env.VITE_API_BE_BASE_URL}/cauthu/${update.playerId}`,
          { 
            maDoiHinh: update.maDoiHinh
          },
          { withCredentials: true }
        );
        console.log(`✅ Đã cập nhật đội hình cho: ${update.playerName}`);
      } catch (error) {
        console.error(`❌ Lỗi cập nhật cầu thủ ${update.playerName}:`, error);
      }
    }

     // Sau khi cập nhật thành công
    emit('players-updated', allPlayers.value); // Quan trọng: emit event này
    

    // Show success message
    alert(
      `✅ Đã cập nhật đội hình thành công cho ${updates.length} cầu thủ!`
    );

    // Update original data
    originalData.value = JSON.parse(JSON.stringify(allPlayers.value));

  } catch (error) {
    console.error("❌ Lỗi khi cập nhật đội hình:", error);
    alert("Có lỗi xảy ra khi cập nhật đội hình!");
  } finally {
    isSubmitting.value = false;
  }
};

// Handle close
const handleClose = () => {
  emit("closed");
};

// Load data on mount
onMounted(async () => {
  try {
    await Promise.all([fetchSquads(), fetchAllPlayers()]);
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo form:", error);
  }
});
</script>

<style scoped>
/* Giữ nguyên các style cũ */
.hover-cursor {
  cursor: pointer;
}

.hover-cursor:hover {
  color: #dc3545 !important;
}

.table {
  margin-bottom: 0;
}

.card-body {
  max-height: 60vh;
}

.sticky-top {
  position: sticky;
  z-index: 5;
  background-color: #f8f9fa;
}

.form-select.is-invalid {
  border-color: #dc3545;
}

.form-select.border-warning {
  border-color: #ffc107;
}

.invalid-feedback {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    width: 95% !important;
    margin: 0 auto;
  }

  .card-footer {
    flex-direction: column;
    gap: 1rem;
  }

  .card-footer > div {
    width: 100%;
    text-align: center;
  }

  .table {
    font-size: 0.875rem;
  }
}
</style>