<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="m-0 d-flex" style="color: var(--primary-color)">
        <FontAwesomeIcon icon="fa-solid fa-angle-left" @click="goBack()" />
        <p>Chi tiết đội hình</p>
      </h2>
      <button class="btn btn-primary" @click="handleAddPlayerToSquad">
        <i class="fas fa-plus me-2"></i>
        Thêm cầu thủ
      </button>
    </div>
    <div class="d-flex flex-wrap gap-3 border-top pt-3">
      <div
        v-for="(player, index) in playersInSquad"
        :key="index"
        class="col-12 col-sm-6 col-md-3"
      >
        <PlayerCard type="player" :item="player" />
      </div>
    </div>
  </div>
  <ShowPlayersForm :items="players" v-if="showAddPlayerForm" />
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ShowPlayersForm from "@/components/common/showPlayersForm/ShowPlayersForm.vue";
const route = useRoute();
const squadId = route.params.squadId;
const playersInSquad = ref([]);
const players = ref([]);
const showAddPlayerForm = ref(false);
console.log("doi hinh id", squadId);
const handleAddPlayerToSquad = async () => {
  showAddPlayerForm.value = !showAddPlayerForm.value;
  console.log("showAddPlayerForm", showAddPlayerForm.value);
};
const fetchPlayerBySqaudId = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh/${squadId}/cauthu`
  );
  playersInSquad.value = res.data.cauThus;
  console.log("data tra ve", res.data);
  console.log("cau thu thuoc doi hinh nay la", playersInSquad.value);
};

onMounted(async () => {
  fetchPlayerBySqaudId();
  fetchPlayers();
});
const goBack = () => {
  window.history.back();
};

const fetchPlayers = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/vaitro?vaiTro=cauthu`
    );
    players.value = response.data;

    console.log("tat ca cau thu", players.value);
  } catch (error) {
    console.log(error);
  }
};
</script>
