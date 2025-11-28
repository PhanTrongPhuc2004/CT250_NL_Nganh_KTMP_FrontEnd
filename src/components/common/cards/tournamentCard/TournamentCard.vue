<script setup>
import { formatDate } from "@/utils";
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, computed, onMounted } from "vue";
import bg from "@/assets/images/default-background.jpg"

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  menuItems: {
    type: Array,
    default: () => [],
  },
});

// State for menu management
const activeMenuId = ref(null);
const imageLoaded = ref(false); // Track image loading state
const imageError = ref(false); // Track image error

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

// Image handling
const handleImageLoad = () => {
  imageLoaded.value = true;
};

const handleImageError = () => {
  imageError.value = true;
  imageLoaded.value = true; // Still mark as loaded to show default
};

// Get image source with optimization
const getImageSource = computed(() => {
  if (!props.item.anhMinhHoa || imageError.value) {
    return bg; // Return default background
  }
  
  // If Cloudinary URL, add optimization parameters
  if (props.item.anhMinhHoa.includes('cloudinary.com') && props.item.anhMinhHoa.includes('/upload/')) {
    return props.item.anhMinhHoa.replace('/upload/', '/upload/w_400,h_200,c_fill,q_auto,f_auto/');
  }
  
  return props.item.anhMinhHoa;
});

// QUAN TRỌNG: Sửa lại computed property
const currentMenuItems = computed(() => {
  if (!props.menuItems || props.menuItems.length === 0) {
    return [];
  }

  return props.menuItems.map((menuItem) => ({
    label: menuItem.label,
    action: () => {
      menuItem.action(props.item);
    },
  }));
});

// Auto-load image after component mounts
onMounted(() => {
  // Small delay to ensure card is rendered first
  setTimeout(() => {
    if (props.item.anhMinhHoa && !imageLoaded.value && !imageError.value) {
      // Image will load naturally via the img tag
    }
  }, 100);
});
</script>

<template>
  <div class="tournament-card h-100">
    <div class="border shadow-sm bg-white h-100 d-flex flex-column">
      <!-- Header with tournament name -->
      <div class="position-relative">
        <!-- Image with lazy loading -->
        <img
          :src="getImageSource"
          :alt="item.tenGiaiDau"
          class="w-100  lazy-image"
          :class="{ 'image-loaded': imageLoaded, 'image-error': imageError }"
          style="height: 140px; object-fit: cover"
          loading="lazy"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        
        <!-- Loading overlay (optional) -->
        <div v-if="!imageLoaded && item.anhMinhHoa" class="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex align-items-center justify-content-center">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>
        
        <div class="position-absolute bottom-0 start-0 w-100 p-3 text-white">
          <h5 class="fw-bold mb-1">{{ item.tenGiaiDau }}</h5>
          <div class="d-flex align-items-center small">
            <FontAwesomeIcon :icon="['fas', 'calendar']" class="me-2" />
            <span>{{ item.namThanhLap || "Chưa có thông tin năm thành lập" }}</span>
          </div>
        </div>
      </div>

      <!-- Tournament details -->
      <div class="card-body p-3 flex-grow-1">
        <div class="tournament-info">
          <p class="text-muted small mb-3">
            {{ item.moTa || "Chưa có thông tin mô tả" }}
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

/* Image loading effects */
.lazy-image {
  transition: opacity 0.3s ease;
  opacity: 0;
}

.lazy-image.image-loaded {
  opacity: 1;
}

.lazy-image.image-error {
  opacity: 1;
}

/* Smooth loading animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lazy-image.image-loaded {
  animation: fadeIn 0.5s ease-in-out;
}

@media (max-width: 576px) {
  .tournament-card {
    margin-bottom: 1rem;
  }
}
</style>