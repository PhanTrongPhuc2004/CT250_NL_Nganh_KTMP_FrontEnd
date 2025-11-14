<script setup>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import MatchCard from "@/components/common/cards/matchCard/MatchCard.vue";
import { matchFields, trainingFields } from "@/utils/constanst";

const route = useRoute();
const router = useRouter();
const tournamentId = route.params.tournamentId;
const seasonId = route.params.seasonId;

const tournamentInfo = ref({});
const seasonInfo = ref({});
const matches = ref([]);
const upcommingMatches = ref([]);
const squads = ref([]);
const showMatchForm = ref(false);
const showTrainingForm = ref(false);
const showEditMatchForm = ref(false);
const showUpdateResultForm = ref(false);
const currentEditMatch = ref(null);
const currentUpdateMatch = ref(null);
const loading = ref(false);
const errorMessage = ref("");
const ortherTrainingFields = ref([]);

const tournamentApi = `${import.meta.env.VITE_API_BE_BASE_URL}/giaidau`;
const seasonApi = `${import.meta.env.VITE_API_BE_BASE_URL}/muagiai`;
const matchApi = `${import.meta.env.VITE_API_BE_BASE_URL}/trandau`;
const addTrainingApi = `${import.meta.env.VITE_API_BE_BASE_URL}/lichtapluyen`;
const resultApi = `${import.meta.env.VITE_API_BE_BASE_URL}/ketquatrandau`;
const squadApi = `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh`;

const editMatchApi = computed(() => {
  if (currentEditMatch.value?._id) {
    return `${matchApi}/id/${currentEditMatch.value._id}`;
  }
  return "";
});

const updateResultApi = computed(() => {
  if (currentUpdateMatch.value?._id) {
    return `${resultApi}/${currentUpdateMatch.value._id}`;
  }
  return "";
});

const hasMatches = computed(() => matches.value.length > 0);
const isLoading = computed(() => loading.value && matches.value.length === 0);

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

const matchMenuItems = [
  {
    label: "Chỉnh sửa",
    action: (item) => handleEditMatch(item),
  },
  {
    label: "Cập nhật kết quả",
    action: (item) => handleUpdateResult(item),
  },
  {
    label: "Xóa",
    action: (item) => handleDeleteMatch(item),
    class: "text-danger",
  },
];

const fetchSeasonInfo = async () => {
  try {
    const response = await axios.get(`${seasonApi}/id/${seasonId}`, {
      withCredentials: true,
    });
    seasonInfo.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải thông tin mùa giải:", error);
    errorMessage.value = "Không thể tải thông tin mùa giải. Vui lòng thử lại!";
  }
};

const fetchMatchesBySeason = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(
      `${seasonApi}/ma/${seasonInfo?.value?.maMuaGiai}/trandau`,
      { withCredentials: true }
    );
    matches.value = response.data;
    upcommingMatches.value = response.data.filter(
      (match) => match.trangThai === "chua_bat_dau"
    );
  } catch (error) {
    console.error("Lỗi khi tải danh sách trận đấu:", error);
    try {
      const allMatchesResponse = await axios.get(matchApi, {
        withCredentials: true,
      });
      matches.value = allMatchesResponse.data.filter(
        (match) => match.maMuaGiai === seasonInfo.value.maMuaGiai
      );
    } catch (fallbackError) {
      console.error("Lỗi fallback:", fallbackError);
      errorMessage.value =
        "Không thể tải danh sách trận đấu. Vui lòng thử lại!";
    }
  } finally {
    loading.value = false;
  }
};

const fetchSquads = async () => {
  try {
    const response = await axios.get(squadApi, { withCredentials: true });
    let data = response.data;
    if (data) {
      data = data.map((item) => ({
        _id: item._id,
        name: item.doiHinh,
        cauLacBoId: item.cauLacBoId,
      }));
    }
    squads.value = data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách đội hình:", error);
  }
};

const handleEditMatch = (match) => {
  currentEditMatch.value = match;
  showEditMatchForm.value = true;
  errorMessage.value = "";
};

const handleUpdateResult = (match) => {
  currentUpdateMatch.value = match;
  showUpdateResultForm.value = true;
  errorMessage.value = "";
};

const handleDeleteMatch = async (match) => {
  if (!match?._id) return;
  if (
    confirm(
      `Bạn có chắc muốn xóa trận đấu ${match.doiNha} vs ${match.doiKhach}?`
    )
  ) {
    try {
      await axios.delete(`${matchApi}/id/${match._id}`, {
        withCredentials: true,
      });
      await fetchMatchesBySeason();
    } catch (error) {
      console.error("Lỗi khi xóa trận đấu:", error);
      errorMessage.value = "Không thể xóa trận đấu. Vui lòng thử lại!";
    }
  }
};

const openMatchForm = () => {
  if (!seasonInfo.value.maMuaGiai) {
    errorMessage.value =
      "Chưa tải được thông tin mùa giải. Vui lòng thử lại sau!";
    return;
  }
  showMatchForm.value = true;
  errorMessage.value = "";
};

const openTraningForm = async () => {
  showTrainingForm.value = true;
  await findUpcomingMatchesBySeason();
  errorMessage.value = "";
};

const closeMatchForm = () => {
  showMatchForm.value = false;
  showTrainingForm.value = false;
  errorMessage.value = "";
};

const closeEditMatchForm = () => {
  showEditMatchForm.value = false;
  currentEditMatch.value = null;
  errorMessage.value = "";
};

const closeUpdateResultForm = () => {
  showUpdateResultForm.value = false;
  currentUpdateMatch.value = null;
  errorMessage.value = "";
};

const handleMatchSubmitted = () => {
  fetchMatchesBySeason();
  closeMatchForm();
};

const handleEditMatchSubmitted = () => {
  fetchMatchesBySeason();
  closeEditMatchForm();
};

const handleUpdateResultSubmitted = () => {
  fetchMatchesBySeason();
  closeUpdateResultForm();
};

const handleMatchError = (error) => {
  console.error("Lỗi khi xử lý trận đấu:", error);
  if (error.response?.data?.message) {
    errorMessage.value = error.response.data.message;
  } else {
    errorMessage.value = "Có lỗi xảy ra. Vui lòng thử lại!";
  }
};

const transformUpdateResultData = (formData) => {
  const [doiNhaScore, doiKhachScore] = formData.tiSo
    ? formData.tiSo.split("-").map(Number)
    : [null, null];

  return {
    ketQua: {
      doiNha: doiNhaScore,
      doiKhach: doiKhachScore,
    },
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
    trangThai: "daKetThuc",
  };
};

const transformMatchData = (formData) => {
  const maMuaGiai = formData.maMuaGiai || seasonInfo.value.maMuaGiai;
  if (!maMuaGiai) throw new Error("Mã mùa giải là bắt buộc");

  let formattedNgayBatDau = formData.ngayBatDau;
  let formattedThoiGian = formData.thoiGian;

  if (formData.ngayBatDau && typeof formData.ngayBatDau === "string") {
    const dateTimeParts = formData.ngayBatDau.split("T");
    if (dateTimeParts.length === 2) {
      formattedNgayBatDau = dateTimeParts[0];
      formattedThoiGian = dateTimeParts[1].substring(0, 5);
    }
  }

  if (!formattedNgayBatDau) throw new Error("Ngày bắt đầu là bắt buộc");
  if (!formattedThoiGian) throw new Error("Thời gian là bắt buộc");
  if (!formData.diaDiem) throw new Error("Địa điểm là bắt buộc");
  if (!formData.doiNha) throw new Error("Đội nhà là bắt buộc");
  if (!formData.doiKhach) throw new Error("Đội khách là bắt buộc");

  return {
    maMuaGiai: maMuaGiai,
    diaDiem: formData.diaDiem,
    ngayBatDau: formattedNgayBatDau,
    thoiGian: formattedThoiGian,
    doiNha: formData.doiNha,
    doiKhach: formData.doiKhach,
    trangThai: formData.trangThai || "chuaDienRa",
  };
};

const prepareEditData = (match) => {
  if (!match) return {};
  const preparedData = { ...match };
  if (match.ngayBatDau && match.thoiGian) {
    preparedData.ngayBatDau = `${match.ngayBatDau}T${match.thoiGian}`;
  }
  return preparedData;
};

const goBack = () => {
  window.history.back();
};

const findUpcomingMatchesBySeason = async () => {
  try {
    const response = await axios.get(
      `${seasonApi}/ma/${seasonInfo?.value?.maMuaGiai}/trandau`,
      { withCredentials: true }
    );
    upcommingMatches.value = response.data.filter(
      (upcommingMatch) => upcommingMatch.trangThai === "chua_bat_dau"
    );
    return upcommingMatches.value;
  } catch (error) {
    console.error("Lỗi khi tải danh sách trận đấu:", error);
  }
};

onMounted(async () => {
  await fetchSeasonInfo();
  await fetchSquads();
  await fetchMatchesBySeason();

  ortherTrainingFields.value = [
    {
      name: "maTranDau",
      label: "Chọn trận đấu",
      type: "select",
      children: upcommingMatches.value.map((match) => ({
        _id: match.maTranDau,
        name: `${match.doiNha} vs ${match.doiKhach}`,
      })),
    },
  ];

  console.log("orther training fields", ortherTrainingFields.value);
});
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <h2 class="m-0 d-flex align-items-center text-primary">
        <FontAwesomeIcon
          icon="fa-solid fa-angle-left"
          @click="goBack()"
          class="me-2 cursor-pointer"
        />
        <span class="m-0"
          >Chi tiết mùa giải -
          {{ seasonInfo?.tenMuaGiai || "Đang tải..." }}</span
        >
      </h2>
      <div class="d-flex">
        <button
          class="btn btn-success me-2"
          @click="openTraningForm"
          :disabled="!seasonInfo.maMuaGiai"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-1" />
          Thêm lịch tập luyện
        </button>
        <button
          class="btn btn-primary"
          @click="openMatchForm"
          :disabled="!seasonInfo.maMuaGiai"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-1" />
          Thêm trận đấu
        </button>
      </div>
    </div>

    <div class="border-top pt-3 border-secondary-subtle mt-3">
      <h4 class="text-secondary mb-3">Thông tin mùa giải</h4>
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5 class="card-title text-primary">
                {{ seasonInfo.tenMuaGiai || "Đang tải..." }}
              </h5>
              <p class="card-text">
                <strong>Mã mùa giải:</strong>
                {{ seasonInfo.maMuaGiai || "Chưa cập nhật" }}
              </p>
              <p class="card-text">
                <strong>Giải đấu:</strong>
                {{ tournamentInfo.tenGiaiDau || "Đang tải..." }}
              </p>
              <p class="card-text" v-if="!seasonInfo.maMuaGiai">
                <small class="text-warning">Đang tải mã mùa giải...</small>
              </p>
            </div>
            <div class="col-md-6">
              <p class="card-text">
                <strong>Mô tả mùa giải:</strong>
                {{ seasonInfo.moTa || "Chưa có mô tả" }}
              </p>
              <p class="card-text">
                <strong>Thời gian:</strong>
                {{
                  seasonInfo.thoiGianBatDau
                    ? new Date(seasonInfo.thoiGianBatDau).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Chưa cập nhật"
                }}
                -
                {{
                  seasonInfo.thoiGianKetThuc
                    ? new Date(seasonInfo.thoiGianKetThuc).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Chưa cập nhật"
                }}
              </p>
              <p class="card-text">
                <strong>Trạng thái:</strong>
                <span
                  :class="{
                    'text-success': seasonInfo.trangThai === 'dangDienRa',
                    'text-warning': seasonInfo.trangThai === 'sapDienRa',
                    'text-secondary': seasonInfo.trangThai === 'daKetThuc',
                  }"
                >
                  {{
                    seasonInfo.trangThai === "dangDienRa"
                      ? "Đang diễn ra"
                      : seasonInfo.trangThai === "sapDienRa"
                      ? "Sắp diễn ra"
                      : seasonInfo.trangThai === "daKetThuc"
                      ? "Đã kết thúc"
                      : "Chưa xác định"
                  }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-top pt-3 border-secondary-subtle mt-3">
      <h4 class="text-secondary mb-3">Danh sách trận đấu</h4>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="text-muted mt-2">Đang tải danh sách trận đấu...</p>
      </div>

      <div v-else-if="hasMatches" class="row g-3">
        <div
          v-for="match in matches"
          :key="match._id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <MatchCard
            :item="match"
            :menu-items="matchMenuItems"
            :show-score="true"
          />
        </div>
      </div>

      <div v-else class="text-center py-5">
        <p class="text-muted">Chưa có trận đấu nào trong mùa giải này.</p>
        <button
          class="btn btn-primary"
          @click="openMatchForm"
          :disabled="!seasonInfo.maMuaGiai"
        >
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-1" />
          Thêm trận đấu đầu tiên
        </button>
        <p v-if="!seasonInfo.maMuaGiai" class="text-warning mt-2">
          Vui lòng đợi tải thông tin mùa giải...
        </p>
      </div>
    </div>

    <Form
      v-if="showMatchForm && seasonInfo.maMuaGiai"
      :input-fields="matchFields"
      form-name="Thêm trận đấu mới"
      :api="matchApi"
      method="POST"
      :orther-data="{ maMuaGiai: seasonInfo?.maMuaGiai }"
      :transform-data="transformMatchData"
      @submitted="handleMatchSubmitted"
      @error="handleMatchError"
      @closed="closeMatchForm"
    />

    <Form
      v-if="showTrainingForm && seasonInfo.maMuaGiai"
      :input-fields="trainingFields"
      :orther-fields="ortherTrainingFields"
      form-name="Thêm lịch tập luyện mới"
      :api="addTrainingApi"
      method="POST"
      :orther-data="{ maMuaGiai: seasonInfo?.maMuaGiai }"
      :transform-data="transformMatchData"
      @submitted="handleMatchSubmitted"
      @error="handleMatchError"
      @closed="closeMatchForm"
    />

    <Form
      v-if="showEditMatchForm && currentEditMatch && seasonInfo.maMuaGiai"
      :input-fields="matchFields"
      form-name="Chỉnh sửa trận đấu"
      :input-data="prepareEditData(currentEditMatch)"
      :api="editMatchApi"
      method="PUT"
      :transform-data="transformMatchData"
      @submitted="handleEditMatchSubmitted"
      @error="handleMatchError"
      @closed="closeEditMatchForm"
    />

    <Form
      v-if="showUpdateResultForm && currentUpdateMatch"
      :input-fields="updateResultMatchFields"
      form-name="Cập nhật kết quả trận đấu"
      :input-data="currentUpdateMatch"
      :orther-data="{ maTranDau: currentUpdateMatch?.maTranDau }"
      :api="updateResultApi"
      method="PUT"
      :transform-data="transformUpdateResultData"
      @submitted="handleUpdateResultSubmitted"
      @error="handleMatchError"
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

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.card-title {
  color: var(--primary-color);
  margin-bottom: 1rem;
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

.cursor-pointer {
  cursor: pointer;
}
</style>
