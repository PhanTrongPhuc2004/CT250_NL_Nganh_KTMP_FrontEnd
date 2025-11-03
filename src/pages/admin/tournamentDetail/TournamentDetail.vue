div
<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import { onMounted, ref } from "vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { matchFields } from "@/utils/constanst";
const route = useRoute();
const showMatchForm = ref(false);
const tournamentId = route.params.tournamentId;
const squad = ref([]);
const matches = ref([]);

const fetchMatchByTournamentId = async (tournamentId) => {
  axios
    .get(`http://localhost:5000/giaidau/${tournamentId}/trandau`)
    .then((response) => {
      matches.value = response.data;
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

const goBack = () => {
  console.log("back");
  window.history.back();
};
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <h2 class="m-0 d-flex" style="color: var(--primary-color)">
        <FontAwesomeIcon icon="fa-solid fa-angle-left" @click="goBack()" />
        <p>Chi tiết giải đấu</p>
      </h2>
      <button class="btn btn-primary" @click="showMatchForm = !showMatchForm">
        <i class="bi bi-plus-circle me-1"></i> Thêm trận đấu
      </button>
    </div>
    <div class="border-top pt-3 border-secondary-subtle">
      <h4 class="text-secondary mb-3">Danh sách trận đấu</h4>

      <div class="d-flex flex-wrap gap-3">
        <PlayerCard
          v-for="(match, index) in matches"
          :item="match"
          type="match"
          :key="index"
          class="col-12 col-sm-6 col-md-3"
        />
      </div>
    </div>
    <Form
      v-if="showMatchForm"
      :input-fields="matchFields"
      form-name="Thêm trận đấu mới"
      api="http://localhost:5000/trandau"
      method="POST"
      :orther-data="{ giaiDauId: tournamentId }"
      @submitted="() => fetchMatchByTournamentId(tournamentId)"
      @closed="showMatchForm = false"
    />
  </div>
</template>
