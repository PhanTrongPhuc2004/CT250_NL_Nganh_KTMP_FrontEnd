<template>
  <aside
    class="d-flex flex-column bg-white p-3 vh-100 position-fixed top-0 start-0 shadow-sm mt-5 border-end border-secondary-subtle shadow-sm"
    style="width: 250px; transition: transform 0.3s ease"
    :style="{
      transform: isSidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
    }"
  >
    <!-- Logo + Tên CLB -->
    <div
      class="w-100 d-flex align-items-center pb-4 px-2 border-bottom border-seccondary pt-3"
    >
      <img
        :src="clubInfor[0]?.logo || '/default-logo.png'"
        alt="Logo"
        class="me-3"
        style="width: 48px; height: 48px; object-fit: cover"
      />
      <div class="d-flex flex-column">
        <h6 class="fw-bold mb-0 text-uppercase" style="color: #8b2c31">
          {{ clubInfor[0]?.ten || "Tên Câu Lạc Bộ" }}
        </h6>
        <small class="text-muted">Trang quản trị</small>
      </div>
    </div>

    <!-- Nút toggle (mobile) -->
    <button
      class="btn btn-outline-secondary d-md-none mb-3"
      type="button"
      @click="toggleSidebar"
    >
      <i class="bi" :class="isOpen ? 'bi-x-lg' : 'bi-list'"></i>
      <span class="ms-2 fw-semibold">Menu</span>
    </button>

    <!-- Danh sách menu -->
    <ul class="nav flex-column gap-1 mt-2">
      <li v-for="(item, index) in visibleItems" :key="index" class="nav-item">
        <RouterLink
          :to="item.path"
          class="nav-link d-flex align-items-center gap-3 text-dark px-3 py-2 rounded-3 fs-6"
          active-class="active"
          @click="handleItemClick"
        >
          <font-awesome-icon
            v-if="item.icon"
            :icon="item.icon"
            class="fs-5"
            style="width: 15px"
          />

          <span class="fw-semibold">{{ item.name }}</span>
        </RouterLink>
      </li>
    </ul>
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { RouterLink } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps({
  items: { type: Array, required: true },
});

const isOpen = ref(false);
const screenWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1024
);
const clubInfor = ref([]);

// Cập nhật chiều rộng khi resize
const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(async () => {
  window.addEventListener("resize", updateWidth);
  clubInfor.value = await fetchClubInfo();
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

const handleItemClick = () => {
  if (screenWidth.value < 768) isOpen.value = false;
};
</script>

<style scoped>
.nav-link {
  color: #212529;
  font-weight: 500;
  transition: all 0.25s ease;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #8b2c31;
  transform: translateX(3px);
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
  transition: color 0.25s ease;
}
</style>
