<script setup>
import { formatDate, formatTime, getMe } from "@/utils";
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      doiNha: "",
      doiKhach: "",
      diaDiem: "",
      ngayDienRa: "",
      thoiGianDienRa: "",
      _id: "",
    }),
  },
  menuItems: {
    type: Array,
    default: () => [],
  },
});

// State for menu management
const activeMenuId = ref(null);
const matchResult = ref(null); // Lưu kết quả trận đấu
const isLoading = ref(false); // Trạng thái loading
const userInfor = ref(null);

// Fetch kết quả trận đấu
const fetchMatchResult = async () => {
  if (!props.item._id) return;

  isLoading.value = true;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/ketquatrandau/${props.item._id}`
    );
    matchResult.value = response.data;
    console.log("Kết quả trận đấu:", matchResult.value);
  } catch (error) {
    // Nếu không tìm thấy kết quả, để matchResult là null
    if (error.response?.status === 404) {
      matchResult.value = null;
    } else {
      console.error("Lỗi khi fetch kết quả trận đấu:", error);
    }
  } finally {
    isLoading.value = false;
  }
};

// Methods for menu handling
const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

const isMenuOpen = (id) => {
  return activeMenuId.value === id;
};

const closeMenu = () => {
  activeMenuId.value = null;
};

// Sửa lại: Truyền item vào action và kiểm tra menuItems
const currentMenuItems = computed(() => {
  // THÊM: Kiểm tra nếu không có menuItems thì trả về mảng rỗng
  if (!props.menuItems || props.menuItems.length === 0) {
    return [];
  }

  return props.menuItems.map((item) => ({
    ...item,
    action: () => item.action(props.item), // Truyền item hiện tại vào action
  }));
});

// THÊM: Computed property để kiểm tra có nên hiển thị menu không
const shouldShowMenu = computed(() => {
  return currentMenuItems.value.length > 0;
});

// Kiểm tra trận đấu đã có kết quả chưa
const hasResult = computed(() => {
  return matchResult.value && matchResult.value.tiSo;
});

// Kiểm tra trận đấu đã diễn ra chưa (dựa trên ngày)
const isMatchFinished = computed(() => {
  if (!props.item.ngayDienRa) return false;

  const matchDate = new Date(props.item.ngayDienRa);
  const today = new Date();

  // So sánh ngày (bỏ qua giờ)
  const matchDateOnly = new Date(
    matchDate.getFullYear(),
    matchDate.getMonth(),
    matchDate.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Nếu ngày trận đấu đã qua (nhỏ hơn hôm nay)
  return matchDateOnly < todayOnly;
});

// Kiểm tra trận đấu đang diễn ra (hôm nay)
const isMatchToday = computed(() => {
  if (!props.item.ngayDienRa) return false;

  const matchDate = new Date(props.item.ngayDienRa);
  const today = new Date();

  const matchDateOnly = new Date(
    matchDate.getFullYear(),
    matchDate.getMonth(),
    matchDate.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return matchDateOnly.getTime() === todayOnly.getTime();
});

// Kiểm tra trận đấu sắp diễn ra (chưa diễn ra)
const isMatchUpcoming = computed(() => {
  return !isMatchFinished.value && !isMatchToday.value && !hasResult.value;
});

// Format data with fallbacks
const formattedData = computed(() => ({
  teams: `${props.item.doiNha || "Chưa có"} - ${
    props.item.doiKhach || "Chưa có"
  }`,
  location: props.item.diaDiem || "Địa điểm chưa cập nhật",
  date: props.item.ngayDienRa
    ? formatDate(props.item.ngayDienRa)
    : "Chưa có ngày",
  time: props.item.thoiGianDienRa
    ? formatTime(props.item.thoiGianDienRa)
    : "Chưa có giờ",
  score: hasResult.value ? matchResult.value.tiSo : null,
  status: getMatchStatus(),
}));

// Xác định trạng thái trận đấu
const getMatchStatus = () => {
  if (hasResult.value) return "Đã có kết quả";
  if (isMatchFinished.value) return "Đã kết thúc";
  if (isMatchToday.value) return "Hôm nay";
  return "Sắp diễn ra";
};

// Tính toán màu sắc cho trạng thái
const statusColor = computed(() => {
  if (hasResult.value) return "success"; // Đã có kết quả - màu xanh
  if (isMatchFinished.value) return "warning"; // Đã kết thúc nhưng chưa có kết quả - màu vàng
  if (isMatchToday.value) return "primary"; // Hôm nay - màu xanh đậm
  return "info"; // Sắp diễn ra - màu xanh nhạt
});

// Tính toán class cho badge
const statusBadgeClass = computed(() => {
  return `badge bg-${statusColor.value}`;
});

// Hiển thị thống kê nếu có
const showStats = computed(() => {
  return hasResult.value && matchResult.value.thongKe;
});

// Lấy thống kê cho đội nhà
const homeStats = computed(() => {
  return matchResult.value?.thongKe?.doiNha || {};
});

// Lấy thống kê cho đội khách
const awayStats = computed(() => {
  return matchResult.value?.thongKe?.doiKhach || {};
});

// Xử lý đặt vé
const handleBookTicket = () => {
  if (isMatchUpcoming.value && userInfor.value?.vaiTro !== "admin") {
    alert(
      `Đặt vé cho trận đấu: ${formattedData.value.teams}\nNgày: ${formattedData.value.date}\nGiờ: ${formattedData.value.time}\nĐịa điểm: ${formattedData.value.location}`
    );
    // Thêm logic đặt vé thực tế ở đây
  }
};

// Fetch kết quả khi component được mount
onMounted(async () => {
  fetchMatchResult();
  userInfor.value = await getMe();
  console.log("userInfor", userInfor.value);
});

// Theo dõi thay đổi của item để fetch lại kết quả
import { watch } from "vue";
watch(
  () => props.item._id,
  (newId) => {
    if (newId) {
      fetchMatchResult();
    }
  }
);
</script>

<template>
  <div class="match-card h-100">
    <div class="border rounded-4 shadow-sm bg-white h-100 d-flex flex-column">
      <!-- Header with teams -->
      <div class="position-relative">
        <img
          src="https://img.freepik.com/vector-gratis/papel-pintado-textura-hexagonal-oscuro-audaz-estilo-geometrico_1017-43003.jpg"
          alt="Background trận đấu"
          class="w-100 rounded-top-4"
          style="height: 120px; object-fit: cover"
        />
        <div
          class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-top-4"
        ></div>

        <!-- Loading indicator -->
        <div
          v-if="isLoading"
          class="position-absolute top-50 start-50 translate-middle"
        >
          <div
            class="spinner-border spinner-border-sm text-white"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Hiển thị tỉ số nếu có -->
        <div
          v-else-if="hasResult"
          class="position-absolute top-0 start-0 w-100 p-2"
        >
          <span :class="statusBadgeClass" class="float-end fw-bold">
            {{ formattedData.score }}
          </span>
        </div>

        <p
          class="position-absolute top-50 start-50 translate-middle text-white fs-6 fw-bold w-100 text-center px-2 m-0"
        >
          {{ formattedData.teams }}
        </p>

        <!-- Hiển thị trạng thái -->
        <div
          v-if="!isLoading"
          class="position-absolute bottom-0 start-0 w-100 p-2"
        >
          <span :class="statusBadgeClass" class="small">
            {{ formattedData.status }}
          </span>
        </div>
      </div>

      <!-- Match details -->
      <div class="card-body p-3 flex-grow-1">
        <div class="match-details mb-3">
          <div class="d-flex align-items-center mb-2">
            <FontAwesomeIcon
              :icon="['fas', 'map-marker-alt']"
              class="text-muted me-2"
            />
            <small class="text-muted">{{ formattedData.location }}</small>
          </div>
          <div class="d-flex align-items-center mb-2">
            <FontAwesomeIcon
              :icon="['fas', 'calendar']"
              class="text-muted me-2"
            />
            <small class="text-muted">{{ formattedData.date }}</small>
          </div>
          <div class="d-flex align-items-center">
            <FontAwesomeIcon :icon="['fas', 'clock']" class="text-muted me-2" />
            <small class="text-muted">{{ formattedData.time }}</small>
          </div>
        </div>

        <div class="match-info">
          <!-- Thông báo nếu trận đã kết thúc nhưng chưa có kết quả -->
          <div
            v-if="isMatchFinished && !hasResult && !isLoading"
            class="border-top pt-3"
          >
            <div class="alert alert-warning small mb-0 p-2">
              <FontAwesomeIcon
                :icon="['fas', 'exclamation-triangle']"
                class="me-1"
              />
              Trận đấu đã kết thúc nhưng chưa có kết quả
            </div>
          </div>
        </div>

        <!-- Nút đặt vé - CHỈ HIỂN THỊ KHI TRẬN SẮP DIỄN RA VÀ KHÔNG PHẢI ADMIN -->
        <div
          v-if="isMatchUpcoming && userInfor?.vaiTro !== 'admin'"
          class="mt-3"
        >
          <button class="btn btn-warning w-100" @click="handleBookTicket">
            <FontAwesomeIcon :icon="['fas', 'ticket-alt']" class="me-2" />
            Đặt vé ngay
          </button>
        </div>
      </div>

      <!-- Menu actions - CHỈ HIỂN THỊ KHI CÓ MENU ITEMS -->
      <div
        v-if="shouldShowMenu && menuItems"
        class="d-flex justify-content-end align-items-center p-3 position-relative border-top"
      >
        <button
          class="btn btn-sm btn-outline-secondary d-flex align-items-center p-2"
          @click="toggleMenu(item._id)"
          aria-label="Tùy chọn"
        >
          <FontAwesomeIcon :icon="['fas', 'ellipsis-v']" />
        </button>
        <Menu
          v-if="isMenuOpen(item._id)"
          top="100%"
          right="0"
          :menu-items="currentMenuItems"
          :on-close="closeMenu"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.match-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

.match-stats {
  font-size: 0.8rem;
}

.match-stats h6 {
  font-size: 0.85rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .match-stats {
    font-size: 0.75rem;
  }
}
</style>
