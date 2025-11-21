  <script setup>
  import { formatDate, getMe } from "@/utils";
  import Menu from "@/components/common/menu/Menu.vue";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { ref, computed, onMounted, watch } from "vue";
  import axios from "axios";

  const props = defineProps({
    item: {
      type: Object,
      required: true,
      default: () => ({
        doiNha: "",
        doiKhach: "",
        diaDiem: "",
        ngayBatDau: "",
        thoiGian: "",
        _id: "",
        maTranDau: "",
        trangThai: "",
      }),
    },
    menuItems: {
      type: Array,
      default: () => [],
    },
  });

  const activeMenuId = ref(null);
  const matchResult = ref(null);
  const isLoading = ref(false);
  const userInfor = ref(null);

  const statusConfig = {
    chua_bat_dau: {
      badgeClass: "badge bg-info",
      showTicket: true,
    },
    dang_dien_ra: {
      badgeClass: "badge bg-primary",
      showTicket: false,
    },
    ket_thuc: {
      badgeClass: "badge bg-secondary",
      showTicket: false,
    },
  };

  const currentStatus = computed(() => {
    const status = props.item.trangThai || "chua_bat_dau";
    return statusConfig[status] || statusConfig.chua_bat_dau;
  });

  const isMatchFinished = computed(() => {
    return ["ket_thuc", "hoan_thanh", "huy_bo"].includes(props.item.trangThai);
  });

  const fetchMatchResult = async () => {
    if (!props.item.maTranDau) return;

    isLoading.value = true;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BE_BASE_URL}/ketquatrandau/ma/${
          props.item.maTranDau
        }`
      );
      matchResult.value = response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        matchResult.value = null;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const toggleMenu = (id) => {
    activeMenuId.value = activeMenuId.value === id ? null : id;
  };

  const isMenuOpen = (id) => {
    return activeMenuId.value === id;
  };

  const closeMenu = () => {
    activeMenuId.value = null;
  };

  const currentMenuItems = computed(() => {
    if (!props.menuItems?.length) return [];
    return props.menuItems.map((item) => ({
      ...item,
      action: () => item.action(props.item),
    }));
  });

  const shouldShowMenu = computed(() => {
    return currentMenuItems.value.length > 0;
  });

  const hasResult = computed(() => {
    return matchResult.value?.tiSo && matchResult.value.tiSo.trim() !== '';
  });

  const status = {
    chua_bat_dau: "Sắp diễn ra",
    dang_dien_ra: "Đang diễn ra",
    ket_thuc: "Đã kết thúc",
  };

  const handleBookTicket = () => {
    if (currentStatus.value.showTicket && userInfor.value?.vaiTro !== "admin") {
      alert(
        `Đặt vé cho trận đấu: ${props.item.doiNha} - ${props.item.doiKhach}\nNgày: ${formatDate(props.item.ngayBatDau)}\nGiờ: ${props.item.thoiGian}\nĐịa điểm: ${props.item.diaDiem}`
      );
    }
  };

  onMounted(async () => {
    await fetchMatchResult();
    userInfor.value = await getMe();
  });

  watch(
    () => props.item.maTranDau,
    (newMaTranDau) => {
      if (newMaTranDau) fetchMatchResult();
    }
  );

  // Thêm watch này để theo dõi khi trận đấu kết thúc
  watch(
    () => props.item.trangThai,
    (newStatus, oldStatus) => {
      // Nếu trận đấu vừa chuyển sang trạng thái kết thúc, fetch lại kết quả
      if (newStatus === 'ket_thuc' && oldStatus !== 'ket_thuc') {
        fetchMatchResult();
      }
    }
  );
  </script>

  <template>
    <div class="match-card h-100" style="cursor: pointer; ">
      <div class="border rounded-4 shadow-sm bg-white h-100 d-flex flex-column">
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

          <div
            v-else-if="hasResult"
            class="position-absolute top-0 start-0 w-100 p-2"
          >
            <span class="badge bg-success float-end fw-bold">
              {{ matchResult.tiSo }}
            </span>
          </div>

          <p
            class="position-absolute top-50 start-50 translate-middle text-white fs-6 fw-bold w-100 text-center px-2 m-0"
          >
            {{ `${item.doiNha} - ${item.doiKhach}` || "Chưa có thông tin" }}
          </p>

          <div
            v-if="!isLoading"
            class="position-absolute bottom-0 start-0 w-100 p-2"
          >
            <span :class="currentStatus.badgeClass" class="small">
              {{ status[item.trangThai] || "Chưa có thông tin" }}
            </span>
          </div>
        </div>

        <div class="card-body p-3 flex-grow-1">
          <div class="match-details mb-3">
            <div class="d-flex align-items-center mb-2">
              <FontAwesomeIcon
                :icon="['fas', 'map-marker-alt']"
                class="text-muted me-2"
              />
              <small class="text-muted">{{ item.diaDiem }}</small>
            </div>
            <div class="d-flex align-items-center mb-2">
              <FontAwesomeIcon
                :icon="['fas', 'calendar']"
                class="text-muted me-2"
              />
              <small class="text-muted">{{ formatDate(item.ngayBatDau) }}</small>
            </div>
            <div class="d-flex align-items-center">
              <FontAwesomeIcon :icon="['fas', 'clock']" class="text-muted me-2" />
              <small class="text-muted">{{ item.thoiGian }}</small>
            </div>
          </div>

          <div class="match-info">
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

            <div v-else-if="item.trangThai === 'huy_bo'" class="border-top pt-3">
              <div class="alert alert-danger small mb-0 p-2">
                <FontAwesomeIcon :icon="['fas', 'times-circle']" class="me-1" />
                Trận đấu đã bị hủy
              </div>
            </div>
          </div>

          <div
            v-if="currentStatus.showTicket && userInfor?.vaiTro !== 'admin'"
            class="mt-3"
          >
            <button class="btn btn-warning w-100" @click="handleBookTicket">
              <FontAwesomeIcon :icon="['fas', 'ticket-alt']" class="me-2" />
              Đặt vé ngay
            </button>
          </div>
        </div>

        <div
          v-if="shouldShowMenu && userInfor?.vaiTro == 'admin'"
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
            top="-115px"
            right="10px"
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

  @media (max-width: 576px) {
    .match-stats {
      font-size: 0.75rem;
    }
  }
  </style>