<script setup>
import classNames from "classnames/bind";
import styles from "./playerCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import Menu from "../../menu/Menu.vue";

const cx = classNames.bind(styles);

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  type: {
    type: String,
    default: "default",
  },
  class: {
    type: String,
    default: "",
  },
  menuItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["menu-action"]);

// Menu state
const showMenu = ref(false);

const toggleMenu = (event) => {
  event.stopPropagation();
  showMenu.value = !showMenu.value;
};

const closeMenu = () => {
  showMenu.value = false;
};

const handleMenuItemClick = (menuItem) => {
  console.log("Menu item clicked:", menuItem, props.item);
  closeMenu();

  // Emit event lên component cha
  if (typeof menuItem.action === "function") {
    emit("menu-action", { action: menuItem.action, item: props.item });
  }
};
</script>

<template>
  <!-- Player Card -->
  <div
    :class="cx('player-card')"
    class="border rounded-4 shadow-sm overflow-hidden position-relative"
  >
    <!-- Player Image and Info -->
    <img :src="item.anhMinhHoa" alt="player" :class="cx('player-img')" />
    <div :class="cx('info')">
      <span v-if="item.soAo" :class="cx('number')">#{{ item.soAo }}</span>
      <h3
        class="fw-bold w-50"
        style="font-size: 30px; white-space: normal; overflow-wrap: normal"
      >
        {{ item.hoVaTen }}
      </h3>
      <p :class="cx('sub')">{{ item.viTri }}</p>
    </div>

    <!-- Menu Button (chỉ hiển thị khi có menu items) -->
    <div
      v-if="menuItems && menuItems.length > 0"
      class="position-absolute top-0 end-0 p-2"
    >
      <button
        class="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
        style="width: 32px; height: 32px; border-radius: 50%"
        @click="toggleMenu"
        aria-label="Tùy chọn"
      >
        <FontAwesomeIcon :icon="['fas', 'ellipsis-vertical']" />
      </button>

      <!-- Dropdown Menu -->
      <Menu
        v-if="showMenu"
        top="40px"
        right="0"
        :menu-items="menuItems"
        :on-close="closeMenu"
        @menu-item-click="handleMenuItemClick"
      />
    </div>
  </div>
</template>
