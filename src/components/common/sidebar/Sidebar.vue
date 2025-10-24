<template>
  <aside
    :class="cx('sidebar', { open: isOpen })"
    class="d-flex flex-column col-md-2"
  >
    <button
      class="btn btn-outline-secondary d-md-none mb-3"
      type="button"
      @click="toggleSidebar"
    >
      <i class="fas" :class="isOpen ? 'fa-times' : 'fa-bars'"></i>
      <span class="ms-2">Menu</span>
    </button>

    <!-- Danh sách menu -->
    <ul :class="cx('menu', 'nav flex-column')">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="nav-item"
        :class="cx('menuItem')"
      >
        <RouterLink
          :to="item.to"
          class="nav-link"
          :class="cx('link')"
          active-class="active"
          @click="handleItemClick"
        >
          <span v-if="item.icon" :class="cx('icon')">
            <font-awesome-icon :icon="item.icon" />
          </span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import classNames from "classnames/bind";
import styles from "./sidebar.module.scss";

const cx = classNames.bind(styles);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const isOpen = ref(false);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

// Khi click vào item trên mobile, sidebar tự ẩn đi
const handleItemClick = () => {
  if (window.innerWidth < 768) isOpen.value = false;
};
</script>
