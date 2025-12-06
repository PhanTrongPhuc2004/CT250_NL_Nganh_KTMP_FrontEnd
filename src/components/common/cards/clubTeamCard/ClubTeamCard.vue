<!-- src/components/common/cards/clubTeamCard/ClubTeamCard.vue -->
<template>
  <div class=" h-100 club-team-card position-relative p-3">
    <div class="card-body">
      <!-- Team Header with Logo and Menu -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <!-- Team Logo and Name -->
        <div class="d-flex align-items-center">
          <div v-if="showLogo && item.anhMinhHoa" class="team-logo me-3">
            <img
              :src="item?.anhMinhHoa || item.logoUrl"
              :alt="item.tenDoiBong"
              class="team-logo-img"
              @error="handleImageError"
            />
          </div>
          <h5 class="card-title mb-0">{{ item.tenDoiBong }}</h5>
        </div>

        <!-- Menu Button -->
        <div class="position-relative">
          

          <!-- Dropdown Menu -->
          <div
            v-if="isMenuOpen(item._id)"
          >
            <!-- <button
              v-for="menuItem in menuItems"
              :key="menuItem.action"
              class="dropdown-item d-flex align-items-center"
              :class="menuItem.class"
              @click="handleMenuItemClick(menuItem.action, item)"
            >
              
              {{ menuItem.label }}
            </button> -->
            <Menu
              class="custom-dropdown"
              :menu-items="currentMenuItems"
              :on-select="(action) => handleMenuItemClick(action, item)"
              :on-close="() => toggleMenu(null)"
            />
          </div>
        </div>
      </div>

      <!-- Team Details -->
      <div v-if="showDetails" class="team-details">
        <div class="d-flex justify-content-between align-items-center mb-2">
          
          <div v-if="item.sanNha" class="detail-item">
            <FontAwesomeIcon
              icon="fa-solid fa-location-dot"
              class="me-2 text-muted"
            />
            <small class="text-muted">{{ item.sanNha }}</small>
          </div>
          <button
            v-if="shouldShowMenu"
            class="btn btn-sm btn-outline-secondary menu-button"
            @click.stop="toggleMenu(item._id)"
            aria-label="Tùy chọn"
          >
            <FontAwesomeIcon :icon="['fas', 'ellipsis-v']" />
          </button>
        </div>

        <div v-if="item.soThanhVien !== undefined" class="detail-item">
          <FontAwesomeIcon icon="fa-solid fa-users" class="me-2 text-muted" />
          <small class="text-muted">{{ item.soThanhVien }} thành viên</small>
        </div>

        <!-- Add more details as needed -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Menu from "../../menu/Menu.vue";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  menuItems: {
    type: Array,
    default: () => [],
  },
  showDetails: {
    type: Boolean,
    default: true,
  },
  showLogo: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["menu-action"]);

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

// Menu state
const activeMenuId = ref(null);

// Computed
const shouldShowMenu = computed(() => {
  return props.menuItems && props.menuItems.length > 0;
});

// Methods
const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

const isMenuOpen = (id) => {
  return activeMenuId.value === id;
};

const handleMenuItemClick = (action, item) => {
  activeMenuId.value = null; // Close menu
  emit("menu-action", { action, item });
};

const handleImageError = (event) => {
  event.target.style.display = "none";
};

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (
    !event.target.closest(".menu-button") &&
    !event.target.closest(".custom-dropdown")
  ) {
    activeMenuId.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.club-team-card {
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.club-team-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.team-logo {
  width: 50px;
  height: 50px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-title {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
}

.menu-button {
  border: none;
  background: transparent;
  padding: 4px 8px;
  border-radius: 4px;
}

.menu-button:hover {
  background-color: #f8f9fa;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 160px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
}

.dropdown-item {
  padding: 8px 16px;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.team-details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f8f9fa;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.text-primary {
  color: #007bff !important;
}
.text-info {
  color: #17a2b8 !important;
}
.text-danger {
  color: #dc3545 !important;
}
</style>
