<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { onMounted, ref, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { matchFields } from "@/utils/constanst";
import MatchCard from "@/components/common/cards/matchCard/MatchCard.vue";

const route = useRoute();
const showMatchForm = ref(false);
const tournamentId = route.params.tournamentId;
const squad = ref([]);
const matches = ref([]);
const showEditForm = ref(false);
const currentEditMatch = ref(null);
const showUpdateResultForm = ref(false);
const currentUpdateMatch = ref(null);
const loading = ref(false);
const errorMessage = ref("");

// 🆕 SỬA: Sử dụng computed để API URL luôn cập nhật
const updateMatchApi = computed(() => {
  if (currentEditMatch.value?._id) {
    return `${import.meta.env.VITE_API_BE_BASE_URL}/trandau/${
      currentEditMatch.value._id
    }`;
  }
  return "";
});

const addMatchApi = computed(
  () => `${import.meta.env.VITE_API_BE_BASE_URL}/trandau`
);
const updateResultApi = computed(
  () => `${import.meta.env.VITE_API_BE_BASE_URL}/ketquatrandau`
);

// 🆕 Computed để kiểm tra dữ liệu
const hasMatches = computed(() => matches.value.length > 0);
const isLoading = computed(() => loading.value && matches.value.length === 0);

// Fields cho form cập nhật kết quả
const updateResultMatchFields = [
  {
    name: "tiSo",
    type: "text",
    label: "Tỉ số chung",
    placeholder: "VD: 2-1 (Đội nhà - Đội khách)",
    required: true,
  },
  {
    type: "divider",
    label: "Thống kê đội nhà",
  },
  {
    name: "doiNha_tiLeKiemSoatBong",
    type: "number",
    label: "Tỉ lệ kiểm soát bóng (%)",
    placeholder: "VD: 60",
    min: 0,
    max: 100,
  },
  {
    name: "doiNha_soDuongChuyen",
    type: "number",
    label: "Số đường chuyển",
    placeholder: "VD: 450",
    min: 0,
  },
  {
    name: "doiNha_soPhaPhamLoi",
    type: "number",
    label: "Số pha phạm lỗi",
    placeholder: "VD: 15",
    min: 0,
  },
  {
    name: "doiNha_soTheVang",
    type: "number",
    label: "Số thẻ vàng",
    placeholder: "VD: 3",
    min: 0,
  },
  {
    name: "doiNha_soTheDo",
    type: "number",
    label: "Số thẻ đỏ",
    placeholder: "VD: 0",
    min: 0,
  },
  {
    name: "doiNha_soCauThu",
    type: "number",
    label: "Số cầu thủ",
    placeholder: "VD: 11",
    min: 0,
    max: 11,
  },
  {
    type: "divider",
    label: "Thống kê đội khách",
  },
  {
    name: "doiKhach_tiLeKiemSoatBong",
    type: "number",
    label: "Tỉ lệ kiểm soát bóng (%)",
    placeholder: "VD: 40",
    min: 0,
    max: 100,
  },
  {
    name: "doiKhach_soDuongChuyen",
    type: "number",
    label: "Số đường chuyển",
    placeholder: "VD: 320",
    min: 0,
  },
  {
    name: "doiKhach_soPhaPhamLoi",
    type: "number",
    label: "Số pha phạm lỗi",
    placeholder: "VD: 12",
    min: 0,
  },
  {
    name: "doiKhach_soTheVang",
    type: "number",
    label: "Số thẻ vàng",
    placeholder: "VD: 2",
    min: 0,
  },
  {
    name: "doiKhach_soTheDo",
    type: "number",
    label: "Số thẻ đỏ",
    placeholder: "VD: 1",
    min: 0,
  },
  {
    name: "doiKhach_soCauThu",
    type: "number",
    label: "Số cầu thủ",
    placeholder: "VD: 11",
    min: 0,
    max: 11,
  },
];

const menuItems = [
  {
    label: "Chỉnh sửa",
    action: (item) => {
      console.log("Chỉnh sửa", item);
      handleEditMatch(item);
    },
  },
  {
    label: "Cập nhật kết quả",
    action: (item) => {
      console.log("Cập nhật kết quả", item);
      handleUpdateResult(item);
    },
  },
  {
    label: "Xóa",
    action: (item) => {
      console.log("Xóa", item);
      handleDeleteMatch(item);
    },
    class: "text-danger",
  },
];

const fetchMatchByTournamentId = async (tournamentId) => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/giaidau/${tournamentId}/trandau`
    );
    matches.value = response.data;
    console.log("Matches data:", matches.value);
  } catch (error) {
    console.error("Error fetching match list:", error);
    errorMessage.value = "Không thể tải danh sách trận đấu. Vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
};

const fetchSquad = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh`
    );
    let data = response.data;

    if (data) {
      data = data.map((item) => ({
        _id: item._id,
        name: item.doiHinh,
        cauLacBoId: item.cauLacBoId,
      }));
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách đội hình:", error);
    return [];
  }
};

// Hàm xử lý chỉnh sửa
const handleEditMatch = (match) => {
  console.log("Mở form chỉnh sửa trận đấu:", match);
  currentEditMatch.value = match;
  showEditForm.value = true;
  errorMessage.value = "";
};

// Hàm xử lý cập nhật kết quả
const handleUpdateResult = (match) => {
  console.log("Mở form cập nhật kết quả:", match);
  currentUpdateMatch.value = match;
  showUpdateResultForm.value = true;
  errorMessage.value = "";
};

// Hàm xử lý xóa
const handleDeleteMatch = async (match) => {
  if (!match?._id) {
    console.error("Không có ID trận đấu để xóa");
    return;
  }

  if (
    confirm(
      `Bạn có chắc muốn xóa trận đấu ${match.doiNha} vs ${match.doiKhach}?`
    )
  ) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BE_BASE_URL}/trandau/${match._id}`
      );
      console.log("Đã xóa trận đấu thành công");
      await fetchMatchByTournamentId(tournamentId);
    } catch (error) {
      console.error("Lỗi khi xóa trận đấu:", error);
      errorMessage.value = "Không thể xóa trận đấu. Vui lòng thử lại!";
    }
  }
};

// Hàm xử lý sau khi submit form chỉnh sửa
const handleEditSubmitted = () => {
  fetchMatchByTournamentId(tournamentId);
  closeEditForm();
};

// Hàm xử lý lỗi form chỉnh sửa
const handleEditError = (error) => {
  console.error("Lỗi khi chỉnh sửa trận đấu:", error);
  errorMessage.value = "Không thể chỉnh sửa trận đấu. Vui lòng thử lại!";
};

// Hàm xử lý sau khi submit form cập nhật kết quả
const handleUpdateResultSubmitted = () => {
  fetchMatchByTournamentId(tournamentId);
  closeUpdateResultForm();
};

// Hàm xử lý lỗi form cập nhật kết quả
const handleUpdateResultError = (error) => {
  console.error("Lỗi khi cập nhật kết quả:", error);
  errorMessage.value = "Không thể cập nhật kết quả. Vui lòng thử lại!";
};

// Hàm đóng form chỉnh sửa
const closeEditForm = () => {
  showEditForm.value = false;
  currentEditMatch.value = null;
  errorMessage.value = "";
};

// Hàm đóng form cập nhật kết quả
const closeUpdateResultForm = () => {
  showUpdateResultForm.value = false;
  currentUpdateMatch.value = null;
  errorMessage.value = "";
};

// Hàm đóng form thêm trận đấu
const closeAddMatchForm = () => {
  showMatchForm.value = false;
  errorMessage.value = "";
};

// Hàm xử lý lỗi thêm trận đấu
const handleAddMatchError = (error) => {
  console.error("Lỗi khi thêm trận đấu:", error);
  errorMessage.value = "Không thể thêm trận đấu. Vui lòng thử lại!";
};

onMounted(async () => {
  squad.value = (await fetchSquad()) || [];
  await fetchMatchByTournamentId(tournamentId);
});

const goBack = () => {
  window.history.back();
};

// Hàm xử lý trước khi gửi dữ liệu cập nhật kết quả
const transformUpdateResultData = (formData) => {
  const transformedData = {
    tiSo: formData.tiSo,
    thongKe: {
      doiNha: {
        tiLeKiemSoatBong: formData.doiNha_tiLeKiemSoatBong || 0,
        soDuongChuyen: formData.doiNha_soDuongChuyen || 0,
        soPhaPhamLoi: formData.doiNha_soPhaPhamLoi || 0,
        soTheVang: formData.doiNha_soTheVang || 0,
        soTheDo: formData.doiNha_soTheDo || 0,
        soCauThu: formData.doiNha_soCauThu || 0,
      },
      doiKhach: {
        tiLeKiemSoatBong: formData.doiKhach_tiLeKiemSoatBong || 0,
        soDuongChuyen: formData.doiKhach_soDuongChuyen || 0,
        soPhaPhamLoi: formData.doiKhach_soPhaPhamLoi || 0,
        soTheVang: formData.doiKhach_soTheVang || 0,
        soTheDo: formData.doiKhach_soTheDo || 0,
        soCauThu: formData.doiKhach_soCauThu || 0,
      },
    },
  };

  return transformedData;
};
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
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
        <span class="m-0">Chi tiết giải đấu</span>
      </h2>
      <button class="btn btn-primary" @click="showMatchForm = true">
        <FontAwesomeIcon icon="fa-solid fa-plus" class="me-1" />
        Thêm trận đấu
      </button>
    </div>

    <div class="border-top pt-3 border-secondary-subtle mt-3">
      <h4 class="text-secondary mb-3">Danh sách trận đấu</h4>

      <!-- Error message -->
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-2">Đang tải danh sách trận đấu...</p>
      </div>

      <!-- Matches list -->
      <div v-else-if="hasMatches" class="row g-3">
        <div
          v-for="match in matches"
          :key="match._id"
          class="col-12 col-sm-6 col-md-3"
        >
          <MatchCard :item="match" :menu-items="menuItems" />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-5">
        <p class="text-muted">Chưa có trận đấu nào trong giải đấu này.</p>
        <button class="btn btn-primary" @click="showMatchForm = true">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-1" />
          Thêm trận đấu đầu tiên
        </button>
      </div>
    </div>

    <!-- Form thêm trận đấu mới -->
    <Form
      v-if="showMatchForm"
      :input-fields="matchFields"
      form-name="Thêm trận đấu mới"
      :api="addMatchApi"
      method="POST"
      :orther-data="{ giaiDauId: tournamentId }"
      @submitted="
        () => {
          fetchMatchByTournamentId(tournamentId);
          showMatchForm = false;
        }
      "
      @error="handleAddMatchError"
      @closed="closeAddMatchForm"
    />

    <!-- Form chỉnh sửa trận đấu -->
    <Form
      v-if="showEditForm && currentEditMatch"
      :input-fields="matchFields"
      form-name="Chỉnh sửa trận đấu"
      :input-data="currentEditMatch"
      :api="updateMatchApi"
      method="PUT"
      @submitted="handleEditSubmitted"
      @error="handleEditError"
      @closed="closeEditForm"
    />

    <!-- Form cập nhật kết quả -->
    <Form
      v-if="showUpdateResultForm && currentUpdateMatch"
      :input-fields="updateResultMatchFields"
      form-name="Cập nhật kết quả trận đấu"
      :input-data="currentUpdateMatch"
      :api="updateResultApi"
      method="PUT"
      :transform-data="transformUpdateResultData"
      @submitted="handleUpdateResultSubmitted"
      @error="handleUpdateResultError"
      @closed="closeUpdateResultForm"
    />
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.8rem;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--primary-dark-color);
  border-color: var(--primary-dark-color);
}
</style>
