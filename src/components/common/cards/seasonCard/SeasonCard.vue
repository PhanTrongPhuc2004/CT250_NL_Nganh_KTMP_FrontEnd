<script setup>
import { formatDate } from "@/utils";
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, computed } from "vue";
import bg from "@/assets/images/default-background.jpg"

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

const imageLoaded = ref(false); // Track image loading state
const imageError = ref(false); // Track image error

const isMenuOpen = (id) => {
  return activeMenuId.value === id;
};

const closeMenu = () => {
  activeMenuId.value = null;
};

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



// Tính số năm của mùa giải
const seasonDuration = computed(() => {
  if (!props.item.namBatDau || !props.item.namKetThuc) return 1;
  return parseInt(props.item.ngayKetThuc) - parseInt(props.item.ngayBatDau) + 1;
});
// Image handling
const handleImageLoad = () => {
  imageLoaded.value = true;
};

const handleImageError = () => {
  imageError.value = true;
  imageLoaded.value = true; // Still mark as loaded to show default
};
const getImageSource = computed(() => {
  if (!props.item.anhMinhHoa || imageError.value) {
    return bg; // Return default background
  }

  if (props.item.anhMinhHoa.includes('cloudinary.com') && props.item.anhMinhHoa.includes('/upload/')) {
    return props.item.anhMinhHoa.replace('/upload/', '/upload/w_400,h_200,c_fill,q_auto,f_auto/');
  }

  return props.item.anhMinhHoa;
})


</script>

<template>
  <div :class="class" class="season-card h-100">
    <div class="border rounded-4 shadow-sm bg-white h-100 d-flex flex-column">
      <!-- Header with season image -->
      <div class="position-relative">
        <img
          :src="getImageSource"
          :class="{ 'image-loaded': imageLoaded, 'image-error': imageError }"
          @load="handleImageLoad"
          @error="handleImageError"

          alt="Background mùa giải"
          class="w-100 rounded-top-4"
          style="height: 140px; object-fit: cover"
        />
        
        <div class="position-absolute bottom-0 start-0 w-100 p-3 text-white">
          <h5 class="fw-bold mb-1">{{ item.tenMuaGiai }}</h5>
          <div class="d-flex align-items-center small">
            <FontAwesomeIcon :icon="['fas', 'calendar']" class="me-2" />
            <span>{{  }}</span>
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
