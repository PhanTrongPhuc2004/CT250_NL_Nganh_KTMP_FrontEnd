<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-semibold mb-0 text-header">Mua vé trận đấu</h4>
    </div>

    <!-- DÙNG COMPONENT CHUNG -->
    <MatchSelector :giaiDauList="giaiDauList" :muaGiaiList="muaGiaiList" :tranDauList="tranDauList"
      :selectedGiaiDau="selectedGiaiDau" :selectedMuaGiai="selectedMuaGiai" :selectedMatch="selectedMatch"
      @update:giaiDau="onGiaiDauChange" @update:muaGiai="onMuaGiaiChange" @update:match="onMatchChange" />

    <div v-if="selectedMatch && cauHinhVeList.length > 0" class="mt-4">
      <TicketList :cauHinhVeList="cauHinhVeList" @buy="openBuyModal" />
    </div>
    <div v-else-if="selectedMatch" class="text-center py-5 text-muted">
      <p>Đang tải cấu hình vé...</p>
    </div>
    <div v-else class="text-center py-5">
      <div class="empty-state">
        <i class="bi bi-ticket-perforated fs-1"></i>
        <p class="mt-3 text-muted">Vui lòng chọn trận đấu để mua vé</p>
      </div>
    </div>

    <BuyTicketModal v-if="showBuyModal" :config="selectedConfig" :matchInfo="selectedMatchInfo"
      @close="showBuyModal = false" @success="handleBuySuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"; // THÊM nextTick
import axios from "@/utils/axios";
import MatchSelector from "./components/MatchSelector.vue";
import TicketList from "./components/TicketList.vue";
import BuyTicketModal from "./components/BuyTicketModal.vue";

// --- DỮ LIỆU
const giaiDauList = ref([]);
const muaGiaiList = ref([]);
const tranDauList = ref([]);
const cauHinhVeList = ref([]);

const selectedGiaiDau = ref("");
const selectedMuaGiai = ref("");
const selectedMatch = ref("");
const selectedMatchInfo = ref(null);

const showBuyModal = ref(false);
const selectedConfig = ref(null);

// --- API
const fetchGiaiDau = async () => {
  const res = await axios.get("/giaidau");
  giaiDauList.value = res.data;
};

const fetchMuaGiaiByGiaiDau = async () => {
  if (!selectedGiaiDau.value) return;
  const res = await axios.get(`/muagiai?maGiaiDau=${selectedGiaiDau.value}`);
  muaGiaiList.value = res.data;
};

const fetchTranDauByMuaGiai = async () => {
  if (!selectedMuaGiai.value) return;

  // RESET + ĐỢI DOM
  tranDauList.value = [];
  selectedMatch.value = "";
  await nextTick();

  try {
    // SỬA: DÙNG API CÓ SẴN
    const res = await axios.get(`/muagiai/ma/${selectedMuaGiai.value}/trandau`);
    tranDauList.value = res.data;
  } catch (err) {
    console.error("Lỗi lấy trận đấu:", err);
    tranDauList.value = [];
  }
};

const fetchCauHinhVe = async () => {
  if (!selectedMatch.value) return;
  try {
    const res = await axios.get(`/cauhinhve/trandau/${selectedMatch.value}`);
    cauHinhVeList.value = res.data.map(c => ({
      ...c,
      tongSoGhe: c.soGheKetThuc - c.soGheBatDau + 1
    }));
    const match = tranDauList.value.find(t => t.maTranDau === selectedMatch.value);
    selectedMatchInfo.value = match;
  } catch (err) {
    console.error("Lỗi lấy cấu hình vé:", err);
    cauHinhVeList.value = [];
  }
};

// --- XỬ LÝ SỰ KIỆN
const onGiaiDauChange = (val) => {
  selectedGiaiDau.value = val;
  selectedMuaGiai.value = "";
  selectedMatch.value = "";
  muaGiaiList.value = [];
  tranDauList.value = [];
  cauHinhVeList.value = [];
  fetchMuaGiaiByGiaiDau();
};

const onMuaGiaiChange = async (val) => {
  selectedMuaGiai.value = val;
  selectedMatch.value = "";
  tranDauList.value = [];
  cauHinhVeList.value = [];
  await nextTick(); // ĐỢI DOM XÓA OPTION CŨ
  fetchTranDauByMuaGiai();
};

const onMatchChange = (val) => {
  selectedMatch.value = val;
  cauHinhVeList.value = [];
  if (val) fetchCauHinhVe();
};

const openBuyModal = (config) => {
  if (config.soGheConLai <= 0) return alert("Ghế đã hết!");
  selectedConfig.value = config;
  showBuyModal.value = true;
};

const handleBuySuccess = () => {
  showBuyModal.value = false;
  fetchCauHinhVe();
};

// --- LIFECYCLE
onMounted(fetchGiaiDau);
</script>

<style scoped>
.text-header {
  color: #8B2C31;
  font-weight: 700;
}

.empty-state i {
  color: #E02128;
  opacity: 0.6;
}
</style>