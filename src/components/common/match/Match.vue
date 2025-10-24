<script setup>
import classNames from "classnames/bind";
import styles from "./match.module.scss";
const cx = classNames.bind(styles);

defineProps({
  match: {
    type: Object,
    required: true,
    validator(value) {
      return (
        Array.isArray(value.capDau) && typeof value.thoiGianDienRa === "string"
      );
    },
  },
});
</script>

<template>
  <div :class="cx('match-card')">
    <div :class="cx('teams')">
      <div :class="cx('team')">
        <div :class="cx('team-logo')">⚽</div>
        <p>{{ match.capDau[0] }}</p>
      </div>

      <span :class="cx('vs')">VS</span>

      <div :class="cx('team')">
        <div :class="cx('team-logo')">🏆</div>
        <p>{{ match.capDau[1] }}</p>
      </div>
    </div>

    <!-- Nếu đã diễn ra thì hiện tỉ số -->
    <div v-if="match.ketQua" :class="cx('result')">
      <p>
        {{ match.capDau[0] }}: <strong>{{ match.ketQua[0] }}</strong>
      </p>
      <p>
        {{ match.capDau[1] }}: <strong>{{ match.ketQua[1] }}</strong>
      </p>
    </div>

    <!-- Nếu chưa diễn ra thì hiện thời gian, địa điểm -->
    <div v-else :class="cx('info')">
      <p :class="cx('time')">{{ match.thoiGianDienRa }}</p>
      <p :class="cx('place')">{{ match.diaDiem }}</p>
    </div>
  </div>
</template>
