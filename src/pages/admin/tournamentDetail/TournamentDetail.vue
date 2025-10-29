div
<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { onMounted, ref } from "vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
const route = useRoute();
const showMatchForm = ref(false);
const tournamentId = route.params.tournamentId;
const squad = ref([]);
const matches = ref([]);
const addMatchFields = [
  { name: "capDau", type: "text", label: "Cặp đấu" },
  { name: "diaDiem", type: "text", label: "Địa điểm" },
  { name: "ngayDienRa", type: "date", label: "Ngày diễn ra" },
  { name: "thoiGianDienRa", type: "time", label: "Thời gian diễn ra" },
  {
    name: "doiHinhId",
    type: "text",
    label: "Chọn đội hình",
    children: squad,
  },
];
const fetchMatchByTournamentId = async (tournamentId) => {
  axios
    .get(`http://localhost:5000/giaidau/${tournamentId}/trandau`)
    .then((response) => {
      matches.value = response.data;
      console.log("Match List:", matches.value);
    })
    .catch((error) => {
      console.error("Error fetching match list:", error);
    });
};

const fetchSquad = async () => {
  try {
    const response = await axios.get("http://localhost:5000/doihinh");
    let data = response.data;

    if (data) {
      data = data.map((item) => ({
        _id: item._id,
        name: item.doiHinh, // đổi field doiHinh -> name
        cauLacBoId: item.cauLacBoId,
      }));
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách đội hình:", error);
  }
};

onMounted(async () => {
  squad.value = (await fetchSquad()) || [];
  await fetchMatchByTournamentId(tournamentId);
});
</script>

<template>
  <div class="p-3">
    <div class="d-flex align-items-center justify-content-between mt-3 mb-3">
      <h2 class="m-0" style="color: var(--primary-color)">Chi tiết giải đấu</h2>
      <button class="btn btn-primary" @click="showMatchForm = !showMatchForm">
        <i class="bi bi-plus-circle me-1"></i> Thêm trận đấu
      </button>
    </div>
    <div>
      <div v-for="(match, index) in matches">
        <PlayerCard :item="match" type="match" :key="index" />
      </div>
    </div>
    <Form
      v-if="showMatchForm"
      :input-fields="addMatchFields"
      form-name="Thêm trận đấu mới"
      :api="`http://localhost:5000/trandau`"
      method="POST"
      :orther-data="{ giaiDauId: tournamentId }"
      @submitted="() => fetchMatchByTournamentId(tournamentId)"
    />
  </div>
</template>
