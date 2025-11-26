<!-- src/pages/user/ticketPurchase/TicketPurchase.vue -->
<template>
  <div class="ticket-purchase-page min-vh-100 bg-light">
    <div class="container py-5">
      <div class="text-center mb-5">
        <h1 class="display-5 fw-bold text-danger">MUA VÉ XEM BÓNG ĐÁ</h1>
        <p class="text-muted lead">Chọn trận đấu yêu thích và đặt vé ngay hôm nay!</p>
      </div>

      <!-- Match Selector - Đã đẹp hơn -->
      <div class="card shadow-lg border-0 mb-5 overflow-hidden">
        <div class="card-header bg-gradient-danger text-white text-center py-4">
          <h4 class="mb-0"><i class="bi bi-trophy"></i> Chọn trận đấu</h4>
        </div>
        <div class="card-body p-4">
          <MatchSelector
            :giaiDauList="giaiDauList"
            :muaGiaiList="muaGiaiList"
            :tranDauList="upcomingMatches"
            :selectedGiaiDau="selectedGiaiDau"
            :selectedMuaGiai="selectedMuaGiai"
            :selectedMatch="selectedMatch"
            @update:giaiDau="onGiaiDauChange"
            @update:muaGiai="onMuaGiaiChange"
            @update:match="onMatchChange"
          />
        </div>
      </div>

      <!-- Danh sách vé -->
      <div v-if="selectedMatch && cauHinhVeList.length > 0">
        <div class="card shadow-lg border-0">
          <div class="card-header bg-dark text-white text-center py-4">
            <h3 class="mb-0">
              <i class="bi bi-futbol"></i> {{ selectedMatchInfo.doiNha?.tenDoiBong || selectedMatchInfo.doiNha }} 
              vs {{ selectedMatchInfo.doiKhach?.tenDoiBong || selectedMatchInfo.doiKhach }}
            </h3>
            <p class="mb-0 mt-2">
              <i class="bi bi-calendar-event"></i> {{ formatFullDate(selectedMatchInfo.ngayBatDau) }} 
              • <i class="bi bi-geo-alt"></i> {{ selectedMatchInfo.diaDiem || 'Sân vận động' }}
            </p>
          </div>
          <div class="card-body p-0">
            <TicketList :cauHinhVeList="cauHinhVeList" @buy="openBuyModal" />
          </div>
        </div>
      </div>

      <!-- Chưa chọn trận -->
      <div v-else-if="selectedMatch" class="text-center py-5">
        <div class="spinner-border text-danger" style="width: 4rem; height: 4rem;"></div>
        <p class="mt-3 text-muted fs-5">Đang tải cấu hình vé...</p>
      </div>

      <!-- Chưa chọn gì -->
      <div v-else class="text-center py-5">
        <div class="empty-state py-5">
          <i class="bi bi-ticket-perforated display-1 text-danger opacity-25"></i>
          <h3 class="mt-4 text-muted">Chưa chọn trận đấu</h3>
          <p class="text-muted">Hãy chọn giải đấu → mùa giải → trận đấu để xem vé</p>
        </div>
      </div>

      <!-- Modal mua vé nhiều -->
      <BuyTicketModal
        v-if="showBuyModal"
        :config="selectedConfig"
        :matchInfo="selectedMatchInfo"
        @close="showBuyModal = false"
        @success="handleBuySuccess"
      />
    </div>
  </div>
</template>

<!-- src/pages/user/ticketPurchase/TicketPurchase.vue -->
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "@/utils/axios";
import MatchSelector from "./components/MatchSelector.vue";
import TicketList from "./components/TicketList.vue";
import BuyTicketModal from "./components/BuyTicketModal.vue";

const route = useRoute();

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

const upcomingMatches = computed(() => {
  const now = new Date();
  return tranDauList.value.filter(m => new Date(m.ngayBatDau) > now);
});

// === FETCH DATA ===
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
  const res = await axios.get(`/muagiai/ma/${selectedMuaGiai.value}/trandau`);
  tranDauList.value = res.data || [];
};

const fetchCauHinhVe = async () => {
  if (!selectedMatch.value) return;
  try {
    const res = await axios.get(`/cauhinhve/trandau/${selectedMatch.value}`);
    cauHinhVeList.value = res.data; // DÙNG NGUYÊN DỮ LIỆU BACKEND → CHUẨN 100%
    selectedMatchInfo.value = tranDauList.value.find(t => t.maTranDau === selectedMatch.value);
  } catch (err) {
    cauHinhVeList.value = [];
  }
};

// === AUTO FILL KHI CÓ QUERY PARAM ===
onMounted(async () => {
  await fetchGiaiDau();

  if (route.query.maTranDau) {
    selectedMatch.value = route.query.maTranDau;
    if (route.query.maGiaiDau) selectedGiaiDau.value = route.query.maGiaiDau;
    if (route.query.maMuaGiai) selectedMuaGiai.value = route.query.maMuaGiai;

    if (selectedGiaiDau.value) await fetchMuaGiaiByGiaiDau();
    if (selectedMuaGiai.value) await fetchTranDauByMuaGiai();
    await fetchCauHinhVe();
  }
});

// Watch thay đổi URL
watch(() => route.query.maTranDau, async (newVal) => {
  if (newVal && newVal !== selectedMatch.value) {
    selectedMatch.value = newVal;
    await fetchCauHinhVe();
  }
});

// === CÁC HÀM CHANGE ===
const onGiaiDauChange = async (val) => {
  selectedGiaiDau.value = val;
  selectedMuaGiai.value = "";
  selectedMatch.value = "";
  cauHinhVeList.value = [];
  await fetchMuaGiaiByGiaiDau();
};

const onMuaGiaiChange = async (val) => {
  selectedMuaGiai.value = val;
  selectedMatch.value = "";
  cauHinhVeList.value = [];
  await fetchTranDauByMuaGiai();
};

const onMatchChange = async (val) => {
  selectedMatch.value = val;
  if (val) await fetchCauHinhVe();
};

const openBuyModal = (config) => {
  if (config.soGheConLai <= 0) return alert("Hết vé!");
  selectedConfig.value = config;
  showBuyModal.value = true;
};

const handleBuySuccess = () => {
  showBuyModal.value = false;
  fetchCauHinhVe();
};

const formatFullDate = (d) => new Date(d).toLocaleString('vi-VN', {
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  hour: '2-digit', minute: '2-digit'
});
</script>

<style scoped>
.bg-gradient-danger {
  background: linear-gradient(135deg, #E02128, #8B2C31) !important;
}
.ticket-purchase-page {
  background: linear-gradient(to bottom, #fdf2f2, #ffffff);
}
.empty-state i {
  font-size: 6rem;
}
</style>