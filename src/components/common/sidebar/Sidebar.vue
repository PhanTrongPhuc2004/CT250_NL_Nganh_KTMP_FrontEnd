<template>
  <aside
    class="d-flex flex-column bg-white p-3 position-fixed top-0 start-0 shadow-sm mt-5 border-end border-secondary-subtle"
    style="width: 250px; transition: transform 0.3s ease; height: calc(100vh - 80px);"
    :style="{
    }"
  >
    <!-- Logo + Tên CLB -->
    <div
      class="w-100 d-flex align-items-center pb-3 px-2 border-bottom border-secondary pt-3 flex-shrink-0"
      @click="() => router.push('/admin')"
      style="min-height: 80px;"
    >
      <img
        :src="clubInfor[0]?.logo || '/default-logo.png'"
        alt="Logo"
        class="me-3"
        style="width: 48px; height: 48px; object-fit: cover; cursor: pointer;"
      />
      <div class="d-flex flex-column">
        <h6 class="fw-bold mb-0 text-uppercase" style="color: #8b2c31; font-size: 0.9rem;">
          {{ clubInfor[0]?.ten || "Tên Câu Lạc Bộ" }}
        </h6>
        <small class="text-muted" style="font-size: 0.75rem;">Trang quản trị</small>
      </div>
    </div>


    <!-- Danh sách menu với scroll -->
    <div class="nav-container flex-grow-1" style="overflow-y: auto; overflow-x: hidden;">
      <ul class="nav flex-column gap-2 mt-2">
        <li v-for="(item, index) in visibleItems" :key="index" class="nav-item w-100">
          <!-- Dropdown Menu -->
          <div v-if="item.meta?.isDropdown" class="dropdown-container">
            <div
              class="nav-link d-flex align-items-center justify-content-between gap-3 text-dark px-3 py-2 fs-6 dropdown-toggle "
              :class="{ 
                'active': isDropdownActive(item),
                'dropdown-open': openDropdown === item.name 
              }"
              @click="toggleDropdown(item.name)"
              style="cursor: pointer;"
            >
              <div class="d-flex align-items-center gap-3">
                <font-awesome-icon
                  v-if="item.icon"
                  :icon="item.icon"
                  class="fs-5"
                  style="width: 15px"
                />
                <span class="fw-semibold" style="font-size: 0.875rem;">{{ item.name }}</span>
              </div>
              <font-awesome-icon
                :icon="['fas', openDropdown === item.name ? 'chevron-up' : 'chevron-down']"
                class="fs-6 transition-all"
                style="width: 12px;"
              />
            </div>
            
            <!-- Dropdown Content -->
            <div 
              v-if="openDropdown === item.name && item.children" 
              class="dropdown-content ps-3 mt-1"
            >
              <RouterLink
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                class="nav-link d-flex align-items-center gap-3 text-dark px-3 py-2 fs-6 child-item"
                active-class="active"
                :class="{ active: isItemActive(child) }"
                @click="handleItemClick(child)"
              >
                <font-awesome-icon
                  v-if="child.icon"
                  :icon="child.icon"
                  class="fs-6"
                  style="width: 12px"
                />
                <span class="fw-semibold" style="font-size: 0.8rem;">{{ child.name }}</span>
              </RouterLink>
            </div>
          </div>

          <!-- Normal Menu Item -->
          <RouterLink
            v-else
            :to="item.path"
            class="nav-link d-flex align-items-center gap-3 text-dark px-3 py-2 fs-6"
            active-class="active"
            :class="{ active: isItemActive(item) }"
            @click="handleItemClick(item)" 
          >
            <font-awesome-icon
              v-if="item.icon"
              :icon="item.icon"
              class="fs-5"
              style="width: 15px"
            />
            <span class="fw-semibold" style="font-size: 0.875rem;">{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- User info hoặc footer -->
    
  </aside>

  <!-- Overlay cho mobile -->
  <div
    v-if="isOpen && screenWidth < 768"
    class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
    @click="toggleSidebar"
    style="z-index: 1040"
  ></div>
</template>

<script setup>
import { fetchClubInfo } from "@/utils";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps({
  items: { type: Array, required: true },
});

const route = useRoute();
const router = useRouter();
const isOpen = ref(false);
const screenWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1024
);
const clubInfor = ref([]);
const openDropdown = ref(null);

// Active item state
const activeItemPath = ref(route.path);

// Watch route changes
watch(() => route.path, (newPath) => {
  activeItemPath.value = newPath;
  
  const parentRoute = props.items.find(item => 
    item.children?.some(child => child.path === newPath)
  );
  if (parentRoute) {
    openDropdown.value = parentRoute.name;
  }
});

// Hàm kiểm tra active state
const isItemActive = (item) => {
  const isActive = activeItemPath.value.startsWith(item.path);
  return isActive;
};

// Check if dropdown should be marked as active
const isDropdownActive = (dropdownItem) => {
  return dropdownItem.children?.some(child => isItemActive(child));
};

// Toggle dropdown
const toggleDropdown = (dropdownName) => {
  if (openDropdown.value === dropdownName) {
    openDropdown.value = null;
  } else {
    openDropdown.value = dropdownName;
  }
};

// Cập nhật chiều rộng khi resize
const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(async () => {
  window.addEventListener("resize", updateWidth);
  console.log("sidebar mouted")
  clubInfor.value = await fetchClubInfo();
  
  activeItemPath.value = route.path;
  
  const parentRoute = props.items.find(item => 
    item.children?.some(child => child.path === route.path)
  );
  if (parentRoute) {
    openDropdown.value = parentRoute.name;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidth);
});

// Sidebar visibility
const isSidebarVisible = computed(
  () => isOpen.value || screenWidth.value >= 768
);

// Lọc menu hiển thị
const visibleItems = computed(() =>
  props.items.filter((item) => !item.meta || !item.meta.hidden)
);

const toggleSidebar = () => (isOpen.value = !isOpen.value);

const handleItemClick = (item) => {
  activeItemPath.value = item.path;
  
  if (screenWidth.value < 768) {
    isOpen.value = false;
  }
};
</script>

<style scoped>
/* Custom scrollbar cho menu */
.nav-container::-webkit-scrollbar {
  width: 4px;
}

.nav-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.nav-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
}

.nav-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Ẩn thanh cuộn ngang */
.nav-container {
  overflow-x: hidden !important;
}

.nav-link {
  color: #212529;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #8b2c31;
}

.nav-link.active {
  background-color: #8b2c31 !important;
  color: #fff !important;
}

.nav-link.active svg {
  color: #fff !important;
}

.nav-link svg {
  color: #6c757d;
  transition: color 0.2s ease;
}

/* Dropdown Styles */
.dropdown-container {
  position: relative;
}

.dropdown-toggle {
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.dropdown-toggle.dropdown-open {
  background-color: #f8f9fa;
  color: #8b2c31;
}

.dropdown-toggle.dropdown-open svg {
  color: #8b2c31;
}

.dropdown-content {
  background-color: transparent;
  margin-top: 0.25rem;
  animation: slideDown 0.3s ease;
  max-height: 200px;
  overflow-y: auto;
  /* Ẩn thanh cuộn ngang cho dropdown */
  overflow-x: hidden !important;
}

.dropdown-content .child-item {
  padding-left: 1rem;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  min-height: 36px;
  margin-bottom: 0.125rem;
}

.dropdown-content .child-item:hover {
  background-color: #f8f9fa;
  color: #8b2c31;
}

.dropdown-content .child-item.active {
  background-color: #8b2c31 !important;
  color: #fff !important;
}

.transition-all {
  transition: all 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Đảm bảo không bị tràn trên mobile */
@media (max-width: 768px) {
  aside {
    height: 100vh !important;
    margin-top: 0 !important;
    z-index: 1050;
  }
  
  .dropdown-content {
    position: static;
    max-height: 150px;
  }
}

/* Đảm bảo các phần tử không bị co lại */
.flex-shrink-0 {
  flex-shrink: 0;
}

.flex-grow-1 {
  flex-grow: 1;
}

.mt-auto {
  margin-top: auto;
}
</style>