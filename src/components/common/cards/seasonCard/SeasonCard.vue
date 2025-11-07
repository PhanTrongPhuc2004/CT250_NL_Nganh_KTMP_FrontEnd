<script setup>
import { formatDate } from "@/utils";
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, computed } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      namBatDau: "",
      namKetThuc: "",
      tenMuaGiai: "",
      moTa: "",
      _id: "",
    }),
  },
  menuItems: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: "season",
  },
  class: {
    type: String,
    default: "",
  },
});

// State for menu management
const activeMenuId = ref(null);

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

// Default menu items
const defaultMenuItems = [
  {
    label: "Chỉnh sửa",
    action: () => console.log("Chỉnh sửa mùa giải:", props.item),
  },
  {
    label: "Xem chi tiết",
    action: () => console.log("Xem chi tiết mùa giải:", props.item),
  },
  {
    label: "Quản lý giải đấu",
    action: () => console.log("Quản lý giải đấu:", props.item),
  },
  {
    label: "Xóa",
    action: () => console.log("Xóa mùa giải:", props.item),
  },
];

// Sử dụng menuItems từ props hoặc default
const currentMenuItems = computed(() => {
  if (!props.menuItems || props.menuItems.length === 0) {
    return [];
  }

  return props.menuItems.map((menuItem) => ({
    ...menuItem,
    action: () => menuItem.action(props.item),
  }));
});

// Kiểm tra có nên hiển thị menu không
const shouldShowMenu = computed(() => {
  return currentMenuItems.value.length > 0;
});

// Format data with fallbacks
const formattedData = computed(() => ({
  seasonName:
    props.item.tenMuaGiai ||
    `Mùa giải ${props.item.namBatDau}-${props.item.namKetThuc}`,
  years: `${props.item.namBatDau || "N/A"} - ${props.item.namKetThuc || "N/A"}`,
  duration:
    props.item.namBatDau && props.item.namKetThuc
      ? `${props.item.namBatDau} - ${props.item.namKetThuc}`
      : "Thời gian chưa xác định",
}));

// Tính số năm của mùa giải
const seasonDuration = computed(() => {
  if (!props.item.namBatDau || !props.item.namKetThuc) return 1;
  return parseInt(props.item.namKetThuc) - parseInt(props.item.namBatDau) + 1;
});
</script>

<template>
  <div :class="class" class="season-card h-100">
    <div class="border rounded-4 shadow-sm bg-white h-100 d-flex flex-column">
      <!-- Header with season image -->
      <div class="position-relative">
        <img
          src="https://cdn.wallpapersafari.com/74/64/SqsDew.jpg"
          alt="Background mùa giải"
          class="w-100 rounded-top-4"
          style="height: 140px; object-fit: cover"
        />
        <div
          class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-40 rounded-top-4"
        ></div>
        <div class="position-absolute bottom-0 start-0 w-100 p-3 text-white">
          <h5 class="fw-bold mb-1">{{ formattedData.seasonName }}</h5>
          <div class="d-flex align-items-center small">
            <FontAwesomeIcon :icon="['fas', 'calendar']" class="me-2" />
            <span>{{ formattedData.years }}</span>
          </div>
        </div>

        <!-- Badge hiển thị số năm -->
        <div class="position-absolute top-0 end-0 m-2">
          <span class="badge bg-primary"> {{ seasonDuration }} năm </span>
        </div>
      </div>

      <!-- Season details -->
      <div class="card-body p-3 flex-grow-1">
        <div class="season-info">
          <p class="text-muted small mb-3">
            {{ formattedData.description }}
          </p>

          <!-- Additional season stats -->
        </div>
      </div>

      <!-- Menu actions -->
      <div
        v-if="shouldShowMenu"
        class="d-flex justify-content-end align-items-center p-3 position-relative border-top"
      >
        <button
          class="btn btn-sm btn-outline-secondary d-flex align-items-center p-2"
          @click="toggleMenu(item._id)"
          aria-label="Tùy chọn mùa giải"
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
.season-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.season-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.season-info {
  font-size: 0.9rem;
}

.season-stats {
  border-top: 1px solid #e9ecef;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .season-card {
    margin-bottom: 1rem;
  }
}
</style>
