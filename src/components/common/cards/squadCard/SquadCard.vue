<script setup>
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      doiHinh: "",
      cauLacBoId: "",
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
const menuButtonRef = ref(null);

// Default menu items
const defaultMenuItems = [
  {
    label: "Chỉnh sửa",
    action: (item) => console.log("Chỉnh sửa đội hình:", item),
  },
  {
    label: "Xem chi tiết",
    action: (item) => console.log("Xem chi tiết đội hình:", item),
  },
  {
    label: "Quản lý cầu thủ",
    action: (item) => console.log("Quản lý cầu thủ:", item),
  },
  {
    label: "Xóa",
    action: (item) => console.log("Xóa đội hình:", item),
  },
];

// Computed properties
const currentMenuItems = computed(() => {
  // Ưu tiên sử dụng menuItems từ props, nếu không có thì dùng default
  const items = props.menuItems.length > 0 ? props.menuItems : defaultMenuItems;

  return items.map((menuItem) => ({
    ...menuItem,
    action: () => menuItem.action(props.item), // Bind item hiện tại
  }));
});

const shouldShowMenu = computed(() => {
  return currentMenuItems.value.length > 0;
});

const formattedData = computed(() => ({
  squadName: props.item.tenDoiHinh || "Đội hình chưa có tên",
  clubId: props.item.cauLacBoId || "",
}));

const isMenuOpen = computed(() => {
  return activeMenuId.value === props.item._id;
});

// Methods
const toggleMenu = () => {
  activeMenuId.value = isMenuOpen.value ? null : props.item._id;
};

const closeMenu = () => {
  activeMenuId.value = null;
};

// Click outside to close menu
const handleClickOutside = (event) => {
  if (menuButtonRef.value && !menuButtonRef.value.contains(event.target)) {
    closeMenu();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="squad-card h-100">
    <div
      class="card border-0 shadow-sm h-100 d-flex flex-column"
      style="border-radius: 12px"
    >
      <div class="card-body d-flex flex-column flex-grow-1">
        <!-- Squad header -->
        <div class="mb-3">
          <h5 class="card-title text-danger fw-bold mb-2">
            {{ formattedData.squadName }}
          </h5>
        </div>

        <!-- Squad details -->
        <div class="squad-info flex-grow-1">
          <div class="squad-stats small text-muted">
            <div class="d-flex align-items-center mb-2">
              <FontAwesomeIcon
                :icon="['fas', 'shirt']"
                class="text-primary me-2"
              />
              <span>Đội hình thi đấu chính thức</span>
            </div>
          </div>
        </div>

        <!-- Menu actions -->
        <div
          v-if="shouldShowMenu"
          class="d-flex justify-content-end align-items-center mt-3 pt-3 border-top"
        >
          <div class="position-relative">
            <button
              ref="menuButtonRef"
              class="btn btn-sm btn-outline-secondary d-flex align-items-center p-2"
              @click.stop="toggleMenu"
              aria-label="Tùy chọn đội hình"
            >
              <FontAwesomeIcon :icon="['fas', 'ellipsis-v']" />
            </button>
            <Menu
              v-if="isMenuOpen"
              top="-130px"
              right="0"
              :menu-items="currentMenuItems"
              :on-close="closeMenu"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.squad-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.squad-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.squad-info {
  font-size: 0.9rem;
}

.squad-stats {
  padding-top: 0.5rem;
}

/* Menu positioning */
.position-relative {
  position: relative;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .squad-card {
    margin-bottom: 1rem;
  }
}
</style>
