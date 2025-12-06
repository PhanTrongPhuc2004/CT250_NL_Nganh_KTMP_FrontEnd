<script setup>
import classNames from "classnames/bind";
import styles from "./playerCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import Menu from "../../menu/Menu.vue";
import { useRouter } from "vue-router";
import { getMe } from "@/utils";
import { onMounted } from "vue";

const cx = classNames.bind(styles);
const router = useRouter();
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
  height: {
      type: String,
      default: "300px",
    }
});

const emit = defineEmits(["menu-action"]);

const userInfor = ref(null);
onMounted(async () => {
  userInfor.value = await getMe();
});

// Menu state
const showMenu = ref(false);

const toggleMenu = (event) => {
  event.stopPropagation();
  event.preventDefault();
  
  showMenu.value = !showMenu.value;
};

const closeMenu = () => {
  showMenu.value = false;
};

const handleMenuItemClick = (menuItem) => {
  closeMenu();

  
  // Emit event lên component cha
  if (typeof menuItem.action === "function") {
    emit("menu-action", { action: menuItem.action, item: props.item });
  }
};

const handleClickCard = () => {
  if (event.target.closest('button') || event.target.closest('.menu-container')) {
    return;
  }

  if (showMenu.value) {
    return;
  }


  router.push(`/cauthu/${props.item._id}`);
};
</script>

<template>
  <!-- Player Card -->
  <div
    :class="cx('player-card')"
    class="border  shadow-sm overflow-hidden position-relative cursor-pointer col-md-12 text-center"
    @click="handleClickCard"
    :style="{ height: height }"
  >
    <!-- Player Image and Info -->
    <img :src="item.anhMinhHoa" alt="player" :class="cx('player-img')" class=""/>
    <div :class="cx('info')">
      <h5
        class="fw-bold text-center"
      >
        {{`${item.soAo} ${item.hoVaTen}` }}
      </h5>
    </div>

    <!-- Menu Button (chỉ hiển thị khi có menu items) -->
    <div
      v-if="menuItems && menuItems.length > 0"
      class="position-absolute top-0 end-0 p-2"
    >
      <button
        class="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
        style="width: 32px; height: 32px;"
        @click="toggleMenu"
        aria-label="Tùy chọn"
      >
        <FontAwesomeIcon :icon="['fas', 'ellipsis-vertical']" />
      </button>

      <!-- Dropdown Menu -->
      <Menu
        v-if="showMenu && userInfor?.vaiTro == 'admin'"
        top="40px"
        right="0"
        :menu-items="menuItems"
        :on-close="closeMenu"
        @menu-item-click="handleMenuItemClick"
      />
    </div>
  </div>
</template>
