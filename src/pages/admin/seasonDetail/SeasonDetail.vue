<script setup>
import TournamentCard from "@/components/common/cards/tournamentCard/TournamentCard.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Form from "@/components/common/form/Form.vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
const route = useRoute();
const router = useRouter();
const seasonId = route.params.id;
console.log("Season ID:", seasonId);
const addTournamentFields = [
  {
    name: "tenGiaiDau",
    label: "Tên giải đấu",
    type: "text",
  },
  {
    name: "moTa",
    label: "Mô tả",
    type: "textarea",
  },
];
const tournaments = ref([]); // ✅ lưu danh sách giải đấu trong mùa
const showTournamentForm = ref(false);
// Lấy danh sách giải đấu theo mùa giải
const fetchTournamentBySeason = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/muagiai/${id}/giaidau`
    );
    tournaments.value = response.data; // ✅ cập nhật reactive state
    console.log("Competitions in Season:", tournaments.value);
  } catch (error) {
    console.error("Lỗi khi tải danh sách trận đấu:", error);
  }
};

// Hàm xử lý khi nhấn nút "Thêm trận đấu"
const handleAddTournament = () => {
  showTournamentForm.value = !showTournamentForm.value;
};

onMounted(() => {
  fetchTournamentBySeason(seasonId);
});
</script>

<template>
  <div class="mt-3 p-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Chi tiết mùa giải</h2>
      <button class="btn btn-primary" @click="handleAddTournament">
        <i class="fas fa-plus me-2"></i>
        Thêm giải đấu
      </button>
    </div>

    <!-- ✅ Dùng tournaments thay vì competeList -->
    <div class="d-flex flex-row flex-wrap gap-3">
      <div
        v-if="tournaments.length"
        v-for="(tournament, index) in tournaments"
        :key="tournament._id"
        class="col-md-3 col-sm-6"
      >
        <PlayerCard :item="tournament" type="tournament" />
      </div>
      <div v-else class="text-muted mt-3">
        Chưa có trận đấu nào trong mùa giải này.
      </div>
    </div>
  </div>
  <!--cac modal-->
  <Form
    form-name="Thêm giải đấu mới"
    :input-fields="addTournamentFields"
    v-if="showTournamentForm"
    :api="`http://localhost:5000/giaidau`"
    :orther-data="{ muaGiaiId: seasonId }"
    method="POST"
    @submitted="() => fetchTournamentBySeason(seasonId)"
  />
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
