<script setup>
import { defineProps, defineEmits } from "vue";
import classNames from "classnames/bind";
import styles from "./seasonCard.module.scss";
const cx = classNames.bind(styles);
const props = defineProps({
  season: Object,
  isActive: Boolean,
});

const emits = defineEmits(["select"]);

const handleClick = () => {
  emits("select", props.season);
};
</script>

<template>
  <div
    class="card season-card text-center shadow-sm"
    :class="{ active: isActive }"
    @click="handleClick"
  >
    <div class="card-body">
      <h5 class="fw-bold mb-1">
        {{ season.namBatDau }} - {{ season.namKetThuc }}
      </h5>
      <small class="text-muted">Mùa giải</small>
    </div>
    <router-link
      :to="`/admin/compete/seasons/${season._id}`"
      class="text-decoration-none"
    >
      <button class="btn btn-primary w-100">Xem chi tiết</button>
    </router-link>
  </div>
</template>

<style scoped>
.season-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
}

.season-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.season-card.active {
  border-color: #007bff;
  background-color: #e7f0ff;
}
</style>
