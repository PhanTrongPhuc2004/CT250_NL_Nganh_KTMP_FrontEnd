<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./competeManagement.module.scss";
import Form from "@/components/common/form/Form.vue";
import SeasonCard from "@/components/common/cards/seasonCard/SeasonCard.vue";
import CompeteCard from "@/components/common/cards/competeCard/CompeteCard.vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
const cx = classNames.bind(styles);

// --- STATE ---
const seasonList = ref([]);
const competitions = ref([]);
const currentSeason = ref(null);

// API endpoints
const seasonApi = "http://localhost:5000/muagiai";
const competitionApi = "http://localhost:5000/giaidau";

// Modal IDs
const seasonModalId = "createSeasonModal";
const competitionModalId = "createCompetitionModal";

// --- FORM FIELDS ---
const seasonFields = [
  { name: "namBatDau", label: "Năm bắt đầu", type: "number" },
  { name: "namKetThuc", label: "Năm kết thúc", type: "number" },
];

const competitionFields = [
  { name: "tenGiaiDau", label: "Tên giải đấu", type: "text" },
  { name: "moTa", label: "Mô tả", type: "textarea" },
];

// --- FETCH FUNCTIONS ---
const fetchSeasons = async () => {
  try {
    const res = await axios.get(seasonApi);
    seasonList.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách mùa giải:", error);
  }
};

const fetchCompetitions = async (seasonId) => {
  try {
    const res = await axios.get(`${competitionApi}?seasonId=${seasonId}`);
    competitions.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách giải đấu:", error);
  }
};

onMounted(fetchSeasons);
</script>

<template>
  <div :class="cx('wrapper')">
    <!-- Header -->
    <div :class="cx('header')">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        :data-bs-target="`#${seasonModalId}`"
      >
        + Tạo mùa giải
      </button>

      <button
        type="button"
        class="btn btn-success ms-2"
        data-bs-toggle="modal"
        :data-bs-target="`#${competitionModalId}`"
        :disabled="!currentSeason"
      >
        + Tạo giải đấu
      </button>
    </div>

    <!-- Season list -->
    <div :class="cx('season-list', 'mt-4')">
      <h4 class="text-secondary mb-3">Danh sách mùa giải</h4>
      <div class="d-flex flex-row flex-wrap gap-5">
        <div
          v-for="season in seasonList"
          :key="season._id"
          class="col-md-3 col-sm-6"
        >
          <PlayerCard
            :item="season"
            :isActive="currentSeason?._id === season._id"
            type="season"
          />
        </div>
      </div>
    </div>

    <!-- Modal tạo mùa giải -->
    <div
      class="modal fade"
      :id="seasonModalId"
      tabindex="-1"
      aria-hidden="true"
    >
      <Form
        :inputFields="seasonFields"
        :inputData="{}"
        formName="Tạo mùa giải"
        :api="seasonApi"
        method="POST"
        :modalId="seasonModalId"
        @submitted="fetchSeasons"
      />
    </div>

    <!-- Modal tạo giải đấu -->
    <div
      class="modal fade"
      :id="competitionModalId"
      tabindex="-1"
      aria-hidden="true"
    >
      <Form
        :inputFields="competitionFields"
        :inputData="{}"
        :ortherData="{ muaGiaiId: currentSeason?._id }"
        formName="Tạo giải đấu"
        :api="competitionApi"
        method="POST"
        :modalId="competitionModalId"
        @submitted="() => fetchCompetitions(currentSeason._id)"
      />
    </div>
  </div>
</template>

<style scoped>
.season-list {
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}
</style>
