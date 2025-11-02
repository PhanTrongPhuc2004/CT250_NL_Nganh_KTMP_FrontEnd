<template>
  <div>
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <FontAwesomeIcon icon="fa-solid fa-angle-left" />
        <h3>Chi tiết đội hình</h3>
      </div>
      <button
        type="btn"
        class="btn btn-primary"
        @click="handleAddPlayerToSquad"
      >
        Thêm cầu thủ vào đội hình
      </button>
    </div>
    <div class="d-flex flex-wrap gap-3">
      <div
        v-for="(player, index) in players"
        :key="index"
        class="col-12 col-sm-6 col-md-3"
      >
        <PlayerCard type="player" :item="player" />
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const route = useRoute();
const squadId = route.params.squadId;
console.log("doi hinh id", squadId);
const players = ref([]);
const handleAddPlayerToSquad = async () => {};
const fetchPlayerBySqaudId = async () => {
  const res = await axios.get(
    `http://localhost:5000/doihinh/${squadId}/cauthu`
  );
  players.value = res.data.cauThus;
  console.log("data tra ve", res.data);
  console.log("cau thu thuoc doi hinh nay la", players.value);
};

onMounted(async () => {
  fetchPlayerBySqaudId();
});
</script>
