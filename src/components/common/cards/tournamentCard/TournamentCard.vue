<script setup>
import { ref } from "vue";
import classNames from "classnames/bind";
import styles from "./tournamentCard.module.scss";
import Menu from "@/components/common/menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Form from "../../form/Form.vue";
const cx = classNames.bind(styles);

const menuItems = [
  { name: "Xem chi tiết", link: "#" },
  { name: "Chỉnh sửa", link: "#" },
  { name: "Xóa", action: () => alert("Xóa giải đấu") },
];

defineProps({
  tournament: {
    type: Object,
    required: true,
    default: () => ({
      _id: "",
      tenGiaiDau: "",
      moTa: "",
      ngayBatDau: "",
      ngayKetThuc: "",
    }),
  },
});

// State để show/hide menu
const showMenu = ref(false);

// Hàm toggle menu
function toggleMenu() {
  showMenu.value = !showMenu.value;
}

// Ẩn menu khi click ra ngoài
function handleClickOutside(event) {
  const card = event.target.closest(`.${cx("card")}`);
  if (!card) showMenu.value = false;
}
document.addEventListener("click", handleClickOutside);
</script>

<template>
  <div :class="cx('card', 'shadow-sm', 'border-0', 'rounded-3', 'mb-3')">
    <div :class="cx('card-body')">
      <!-- Tiêu đề giải đấu -->
      <h5 :class="cx('fw-bold', 'mb-2')">
        🏆 {{ tournament.tenGiaiDau || "Giải đấu chưa đặt tên" }}
      </h5>

      <!-- Mô tả -->
      <p :class="cx('text-secondary', 'mb-2')">
        {{ tournament.moTa || "Chưa có mô tả cho giải đấu này." }}
      </p>

      <!-- Ngày diễn ra -->
      <div v-if="tournament.ngayBatDau || tournament.ngayKetThuc" class="mt-2">
        <small class="text-muted">
          ⏰ {{ tournament.ngayBatDau || "?" }} -
          {{ tournament.ngayKetThuc || "?" }}
        </small>
      </div>

      <!-- Nút chi tiết -->
      <div :class="cx('more')" @click.stop="toggleMenu">
        <FontAwesomeIcon
          :icon="['fas', 'ellipsis-v']"
          :class="cx('more-btn')"
        />
        <!-- Menu chỉ hiển thị khi showMenu = true -->
        <Menu v-if="showMenu" :menuItems="menuItems" />
      </div>
    </div>
  </div>
  <!--Cac modal-->
</template>

<style scoped lang="scss">
.card {
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.card-body {
  padding: 1rem 1.25rem;
}

.more {
  cursor: pointer;
  display: inline-block;
  position: relative;
}
</style>
