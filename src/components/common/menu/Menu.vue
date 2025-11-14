<script setup>
import classNames from "classnames/bind";
import styles from "./menu.module.scss";
import { ref, onMounted, onBeforeUnmount } from "vue";

const cx = classNames.bind(styles);
const root = ref(null);

// ✅ expose cho parent có thể truy cập ref (nếu cần)
defineExpose({
  el: root,
});

// Props
const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
  top: {
    type: String,
    default: "0",
  },
  right: {
    type: String,
    default: "0",
  },
  onClose: {
    // ✅ Thêm callback để đóng menu khi click ra ngoài
    type: Function,
    default: null,
  },
});
const isReady = ref(false);

const handleClickOutside = (event) => {
  if (!isReady.value) return; // ✅ Bỏ qua lần click đầu tiên
  if (root.value && !root.value.contains(event.target)) {
    props.onClose && props.onClose();
  }
};

onMounted(() => {
  setTimeout(() => (isReady.value = true), 0); // Kích hoạt sau 1 tick
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    ref="root"
    :class="cx('menu-wrapper')"
    :style="{ top: top, right: right, zIndex: 5 }"
  >
    <ul>
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        :class="cx('menu-item')"
        @click="item.action && item.action()"
      >
        <a v-if="item.link" :href="item.link" :class="cx('menu-link')">
          {{ item.label }}
        </a>
        <span v-else :class="cx('menu-link')">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>
