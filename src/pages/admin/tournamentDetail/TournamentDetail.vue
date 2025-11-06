<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { onMounted, ref } from "vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
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
const showUpdateResultForm = ref(false); // Thêm state cho form cập nhật kết quả
const currentUpdateMatch = ref(null); // Thêm state lưu trận đấu đang cập nhật kết quả
const addMatchApi = `${import.meta.env.VITE_API_BE_BASE_URL}/trandau`;
const updateResultApi = `${import.meta.env.VITE_API_BE_BASE_URL}/ketquatrandau`;
const updateMatchApi = `${import.meta.env.VITE_API_BE_BASE_URL}/trandau/${
  currentUpdateMatch?._id
}`;

// Fields cho form cập nhật kết quả
const updateResultMatchFields = [
  {
    name: "tiSo",
    type: "text",
    label: "Tỉ số chung",
    placeholder: "VD: 2-1 (Đội nhà - Đội khách)",
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
  },
  {
    name: "doiNha_soDuongChuyen",
    type: "number",
    label: "Số đường chuyển",
    placeholder: "VD: 450",
  },
  {
    name: "doiNha_soPhaPhamLoi",
    type: "number",
    label: "Số pha phạm lỗi",
    placeholder: "VD: 15",
  },
  {
    name: "doiNha_soTheVang",
    type: "number",
    label: "Số thẻ vàng",
    placeholder: "VD: 3",
  },
  {
    name: "doiNha_soTheDo",
    type: "number",
    label: "Số thẻ đỏ",
    placeholder: "VD: 0",
  },
  {
    name: "doiNha_soCauThu",
    type: "number",
    label: "Số cầu thủ",
    placeholder: "VD: 11",
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
  },
  {
    name: "doiKhach_soDuongChuyen",
    type: "number",
    label: "Số đường chuyển",
    placeholder: "VD: 320",
  },
  {
    name: "doiKhach_soPhaPhamLoi",
    type: "number",
    label: "Số pha phạm lỗi",
    placeholder: "VD: 12",
  },
  {
    name: "doiKhach_soTheVang",
    type: "number",
    label: "Số thẻ vàng",
    placeholder: "VD: 2",
  },
  {
    name: "doiKhach_soTheDo",
    type: "number",
    label: "Số thẻ đỏ",
    placeholder: "VD: 1",
  },
  {
    name: "doiKhach_soCauThu",
    type: "number",
    label: "Số cầu thủ",
    placeholder: "VD: 11",
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
  },
];

const fetchMatchByTournamentId = async (tournamentId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/giaidau/${tournamentId}/trandau`
    );
    matches.value = response.data;
    console.log("Matches data:", matches.value);
  } catch (error) {
    console.error("Error fetching match list:", error);
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
  }
};

// Hàm xử lý chỉnh sửa
const handleEditMatch = (match) => {
  console.log("Mở form chỉnh sửa trận đấu:", match);
  currentEditMatch.value = match;
  showEditForm.value = true;
};

// Hàm xử lý cập nhật kết quả
const handleUpdateResult = (match) => {
  console.log("Mở form cập nhật kết quả:", match);
  currentUpdateMatch.value = match;
  showUpdateResultForm.value = true;
};

// Hàm xử lý xóa
const handleDeleteMatch = async (match) => {
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
    }
  }
};

// Hàm xử lý sau khi submit form chỉnh sửa
const handleEditSubmitted = () => {
  fetchMatchByTournamentId(tournamentId);
  closeEditForm();
};

// Hàm xử lý sau khi submit form cập nhật kết quả
const handleUpdateResultSubmitted = () => {
  fetchMatchByTournamentId(tournamentId);
  closeUpdateResultForm();
};

// Hàm đóng form chỉnh sửa
const closeEditForm = () => {
  showEditForm.value = false;
  currentEditMatch.value = null;
};

// Hàm đóng form cập nhật kết quả
const closeUpdateResultForm = () => {
  showUpdateResultForm.value = false;
  currentUpdateMatch.value = null;
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
      <button class="btn btn-primary" @click="showMatchForm = !showMatchForm">
        <i class="bi bi-plus-circle me-1"></i> Thêm trận đấu
      </button>
    </div>

    <div class="border-top pt-3 border-secondary-subtle mt-3">
      <h4 class="text-secondary mb-3">Danh sách trận đấu</h4>

      <div v-if="matches.length > 0" class="row g-3">
        <div
          v-for="(match, index) in matches"
          :key="match._id || index"
          class="col-12 col-sm-6 col-md-3"
        >
          <MatchCard :item="match" :menu-items="menuItems" />
        </div>
      </div>

      <div v-else-if="matches.length === 0" class="text-center py-5">
        <p class="text-muted">Chưa có trận đấu nào trong giải đấu này.</p>
        <button class="btn btn-primary" @click="showMatchForm = true">
          <i class="bi bi-plus-circle me-1"></i> Thêm trận đấu đầu tiên
        </button>
      </div>

      <div v-else class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-2">Đang tải danh sách trận đấu...</p>
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
      @closed="showMatchForm = false"
    />

    <!-- Form chỉnh sửa trận đấu -->
    <Form
      v-if="showEditForm"
      :input-fields="matchFields"
      form-name="Chỉnh sửa trận đấu"
      :input-data="currentEditMatch"
      :api="updateMatchApi"
      method="PUT"
      @submitted="handleEditSubmitted"
      @closed="closeEditForm"
    />

    <!-- Form cập nhật kết quả -->
    <Form
      v-if="showUpdateResultForm"
      :input-fields="updateResultMatchFields"
      form-name="Cập nhật kết quả trận đấu"
      :input-data="currentUpdateMatch"
      :api="updateResultApi"
      method="PUT"
      :transform-data="transformUpdateResultData"
      @submitted="handleUpdateResultSubmitted"
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
