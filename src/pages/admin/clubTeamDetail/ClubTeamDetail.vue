<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 style="color: var(--primary-color);" class="mb-0">
        <FontAwesomeIcon icon="fa-solid fa-angle-left" @click="goBack" class="me-2" style="cursor: pointer;"/>
          
          Quản lý Đội hình</h2>
      <button class="btn text-white" @click="handleAddSquad" style="background-color: var(--button-primary-color);">
        <FontAwesomeIcon icon="fa-solid fa-plus" />
        Thêm đội hình
      </button>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="text-muted mt-2">Đang tải danh sách đội hình...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <div v-else-if="squads.length > 0" class="row g-3 mt-3 border-top pt-3">
      <h4 class="pt-0 m-0 text-secondary">Danh sách đội hình</h4>
      <div
        v-for="squad in squads"
        :key="squad._id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <SquadCard
          :item="squad"
          :menu-items="squadMenuItems"
          @menu-action="handleMenuAction"
        />
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="empty-state">
        <FontAwesomeIcon
          icon="fa-solid fa-people-group"
          size="4x"
          class="text-muted mb-3"
        />
        <h5 class="text-muted mb-2">Chưa có đội hình nào</h5>
        <p class="text-muted mb-4">
          Bắt đầu bằng cách thêm đội hình đầu tiên của bạn
        </p>
        <button class="btn btn-primary" @click="handleAddSquad">
          <FontAwesomeIcon icon="fa-solid fa-plus" class="me-2" />
          Thêm đội hình đầu tiên
        </button>
      </div>
    </div>
    <!--danh sach cau thu trong doi hinh nam hoac nu-->
    <div class="pt-4 mt-3 border-top">
      
      <h4 class="pt-0 m-0 text-secondary py-3">Danh sách cầu thủ</h4>
      <div class="d-flex flex-wrap  w-100">
  
        <div v-for="(player, index) in playersInClubTeam" :key="index" class="col-md-4">
          <PlayerCard :item="player" />
        </div>
  
      </div>
    </div>

    <Form
      v-if="showSquadForm"
      @closed="closeSquadForm"
      :input-fields="squadFields"
      form-name="Thêm đội hình"
      :orther-data="{ maDoiBong: maDoiBong }"
      :api="addSquadApi"
      method="POST"
      :transform-data="transformSquadData"
      @submitted="handleSquadSubmitted"
      @error="handleSquadError"
    />

    <Form
      v-if="showEditSquadForm && currentEditSquad"
      @closed="closeEditSquadForm"
      :input-fields="squadFields"
      form-name="Chỉnh sửa đội hình"
      :input-data="currentEditSquad"
      :api="editSquadApi"
      method="PUT"
      :transform-data="transformSquadData"
      @submitted="handleEditSquadSubmitted"
      @error="handleSquadError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Form from "@/components/common/form/Form.vue";
import SquadCard from "@/components/common/cards/squadCard/SquadCard.vue";
import { squadFields } from "@/utils/constanst";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import instance from "@/utils/axios";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
const route = useRoute();
const router = useRouter();
const clubTeamId = route.params.clubTeamId;

const showSquadForm = ref(false);
const showEditSquadForm = ref(false);
const squads = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const clubteamInfo = ref({});
const maDoiBong = ref(null);
const currentEditSquad = ref(null);
const playersInClubTeam = ref([])

const addSquadApi = `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh`;
const editSquadApi = computed(() =>
  currentEditSquad.value?._id
    ? `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/${
        currentEditSquad.value._id
      }`
    : null
);

const getSquadsApi = computed(() =>
  maDoiBong.value
    ? `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/doibong/ma/${
        maDoiBong.value
      }`
    : null
);

const squadMenuItems = [
  {
    label: "Chỉnh sửa",
    icon: "fa-edit",
    action: (item) => {
      currentEditSquad.value = item;
      showEditSquadForm.value = true;
      errorMessage.value = "";
    },
    class: "text-primary",
  },
  {
    label: "Xem chi tiết",
    icon: "fa-eye",
    action: (item) => {
      router.push(`/admin/clubteam/${clubTeamId}/squad/${item._id}`);
    },
    class: "text-success",
  },
  {
    label: "Xóa",
    icon: "fa-trash",
    action: async (item) => {
      if (
        item?._id &&
        confirm(`Bạn có chắc muốn xóa đội hình "${item.tenDoiHinh}"?`)
      ) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/${item._id}`,
            { withCredentials: true }
          );
          await fetchSquads();
        } catch {
          errorMessage.value = "Không thể xóa đội hình. Vui lòng thử lại!";
        }
      }
    },
    class: "text-danger",
  },
];

const fetchClubTeamInfo = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/doibong/id/${clubTeamId}`,
      { withCredentials: true }
    );
    clubteamInfo.value = res.data;
    maDoiBong.value = res.data.maDoiBong;
  } catch {
    errorMessage.value = "Không thể tải thông tin đội bóng. Vui lòng thử lại!";
  }
};

const fetchPlayersInClubTeam = async () => {
  try {
    const response = await instance.get(`${import.meta.env.VITE_API_BE_BASE_URL}/cauthu/doibong/ma/${maDoiBong.value}`)
    playersInClubTeam.value = response.data;
  } catch (error) {
    console.log(error)
  }
}

const fetchSquads = async () => {
  if (!getSquadsApi.value) return;
  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await axios.get(getSquadsApi.value, { withCredentials: true });
    squads.value = res.data;
  } catch (error) {
    squads.value = [];
    if (error.response?.status !== 404)
      errorMessage.value =
        "Không thể tải danh sách đội hình. Vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
};

const transformSquadData = (formData) => ({
  tenDoiHinh: formData.tenDoiHinh,
  moTa: formData.moTa || "",
  trangThai: formData.trangThai || "dangHoatDong",
  maDoiBong: maDoiBong.value,
});

const handleMenuAction = ({ action, item }) => {
  if (typeof action === "function") action(item);
};

const handleAddSquad = () => {
  if (!maDoiBong.value) {
    errorMessage.value = "Chưa có thông tin đội bóng. Vui lòng thử lại sau!";
    return;
  }
  showSquadForm.value = true;
};

const closeSquadForm = () => {
  showSquadForm.value = false;
  errorMessage.value = "";
};

const closeEditSquadForm = () => {
  showEditSquadForm.value = false;
  currentEditSquad.value = null;
  errorMessage.value = "";
};

const handleSquadSubmitted = () => {
  closeSquadForm();
  fetchSquads();
};

const handleEditSquadSubmitted = () => {
  closeEditSquadForm();
  fetchSquads();
};

const handleSquadError = (error) => {
  errorMessage.value =
    error.response?.data?.message ||
    "Có lỗi xảy ra khi xử lý đội hình. Vui lòng thử lại!";
};

const goBack = () => {
  window.history.back();
}

onMounted(async () => {
  await fetchClubTeamInfo();
  await fetchSquads();
  await fetchPlayersInClubTeam()
});
</script>

<style scoped>
.empty-state {
  padding: 3rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
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
}

.row.g-3 > div {
  transition: transform 0.2s ease-in-out;
}

.row.g-3 > div:hover {
  transform: translateY(-2px);
}
</style>
