<!-- src/components/common/cards/matchCard/MatchCard.vue -->
<script setup>
import { formatDate, getMe } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";

const props = defineProps({
  item: { type: Object, required: true }
});

defineEmits(['book-ticket']); // THÊM EMIT ĐỂ GỌI TỪ HOME

const userInfor = ref(null);
const matchResult = ref(null);
const isLoading = ref(false);

const statusConfig = {
  chua_bat_dau: { badgeClass: "badge bg-info", text: "Sắp diễn ra", showTicket: true },
  dang_dien_ra: { badgeClass: "badge bg-primary", text: "Đang diễn ra", showTicket: false },
  ket_thuc: { badgeClass: "badge bg-secondary", text: "Đã kết thúc", showTicket: false },
};

const currentStatus = computed(() => statusConfig[props.item.trangThai] || statusConfig.chua_bat_dau);

onMounted(async () => {
  userInfor.value = await getMe();
  if (props.item.trangThai === 'ket_thuc') fetchMatchResult();
});

const fetchMatchResult = async () => {
  if (!props.item.maTranDau) return;
  isLoading.value = true;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BE_BASE_URL}/ketquatrandau/ma/${props.item.maTranDau}`);
    matchResult.value = res.data;
  } catch (err) {
    if (err.response?.status === 404) matchResult.value = null;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="match-card h-100 shadow-sm bg-white d-flex flex-column">
    <!-- Background + Tỉ số -->
    <div class="position-relative">
      <img
        src="https://img.freepik.com/vector-gratis/papel-pintado-textura-hexagonal-oscuro-audaz-estilo-geometrico_1017-43003.jpg"
        class="w-100" style="height: 120px; object-fit: cover" />
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>

      <p class="position-absolute top-50 start-50 translate-middle text-white fs-6 fw-bold text-center w-100 px-2 m-0">
        {{ `${item.doiNha?.tenDoiBong || item.doiNha} vs ${item.doiKhach?.tenDoiBong || item.doiKhach}` }}
      </p>

      <div v-if="matchResult?.tiSo" class="position-absolute top-0 end-0 p-2">
        <span class="badge bg-success fw-bold">{{ matchResult.tiSo }}</span>
      </div>

      <div class="position-absolute bottom-0 start-0 w-100 p-2">
        <span :class="currentStatus.badgeClass" class="small">{{ currentStatus.text }}</span>
      </div>
    </div>

    <div class="card-body p-3 flex-grow-1">
      <div class="small text-muted mb-3">
        <div>
          <FontAwesomeIcon icon="fas fa-map-marker-alt" class="me-2" /> {{ item.diaDiem }}
        </div>
        <div>
          <FontAwesomeIcon icon="fas fa-calendar" class="me-2" /> {{ formatDate(item.ngayBatDau) }}
        </div>
        <div>
          <FontAwesomeIcon icon="fas fa-clock" class="me-2" /> {{ item.thoiGian || 'Chưa có giờ' }}
        </div>
      </div>
    </div>

    <!-- NÚT ĐẶT VÉ -->
    <div v-if="currentStatus.showTicket && userInfor?.vaiTro !== 'admin'" class="p-3 border-top text-center">
      <button @click="$emit('book-ticket', item)" class="btn btn-danger w-100 fw-bold">
        <FontAwesomeIcon icon="fas fa-ticket-alt" class="me-2" />
        Đặt vé
      </button>
    </div>
  </div>
</template>

<style scoped>
.match-card {
  transition: all 0.2s;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}
</style>