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
      tenGiaiDau: "",
      moTa: "",
      ngayBatDau: "",
      ngayKetThuc: "",
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

// QUAN TRỌNG: Sửa lại computed property
const currentMenuItems = computed(() => {
  if (!props.menuItems || props.menuItems.length === 0) {
    return [];
  }

  // Map lại menuItems để bind item vào action
  return props.menuItems.map((menuItem) => ({
    label: menuItem.label,
    action: () => {
      menuItem.action(props.item); // Truyền item vào action
    },
  }));
});

// Format data with fallbacks
const formattedData = computed(() => ({
  name: props.item.tenGiaiDau || "Tên giải đấu chưa cập nhật",
  description: props.item.moTa || "Chưa có mô tả chi tiết cho giải đấu này.",
  startDate: props.item.ngayBatDau
    ? formatDate(props.item.ngayBatDau)
    : "Chưa có ngày bắt đầu",
  endDate: props.item.ngayKetThuc
    ? formatDate(props.item.ngayKetThuc)
    : "Chưa có ngày kết thúc",
  duration:
    props.item.ngayBatDau && props.item.ngayKetThuc
      ? `${formatDate(props.item.ngayBatDau)} - ${formatDate(
          props.item.ngayKetThuc
        )}`
      : "Thời gian chưa xác định",
}));
</script>

<template>
  <div class="tournament-card h-100">
    <div class="border rounded-4 shadow-sm bg-white h-100 d-flex flex-column">
      <!-- Header with tournament name -->
      <div class="position-relative">
        <img
          src="https://media.istockphoto.com/id/1407063872/vector/modern-abstract-background-with-black-gradient-abstract-black-business-background.jpg?s=612x612&w=0&k=20&c=6QftyGArm3LTpQsLw29DpZ9ZB42HMNK-wboAWyFZvto="
          alt="Background giải đấu"
          class="w-100 rounded-top-4"
          style="height: 140px; object-fit: cover"
        />
        <div
          class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-40 rounded-top-4"
        ></div>
        <div class="position-absolute bottom-0 start-0 w-100 p-3 text-white">
          <h5 class="fw-bold mb-1">{{ formattedData.name }}</h5>
          <div class="d-flex align-items-center small">
            <FontAwesomeIcon :icon="['fas', 'calendar']" class="me-2" />
            <span>{{ formattedData.duration }}</span>
          </div>
        </div>
      </div>

      <!-- Tournament details -->
      <div class="card-body p-3 flex-grow-1">
        <div class="tournament-info">
          <p class="text-muted small mb-3">
            {{ formattedData.description }}
          </p>
        </div>
      </div>

      <!-- Menu actions -->
      <div
        v-if="currentMenuItems.length > 0"
        class="d-flex justify-content-end align-items-center p-3 position-relative border-top"
      >
        <button
          class="btn btn-sm btn-outline-secondary d-flex align-items-center p-2"
          @click="toggleMenu(item._id)"
          aria-label="Tùy chọn giải đấu"
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
.tournament-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.tournament-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.tournament-info {
  font-size: 0.9rem;
}

.tournament-stats {
  border-top: 1px solid #e9ecef;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

@media (max-width: 576px) {
  .tournament-card {
    margin-bottom: 1rem;
  }
}
</style>
