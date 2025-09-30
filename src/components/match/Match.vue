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
        typeof value.capDau === "string" &&
        typeof value.thoiGianDienRa === "string"
      );
    },
  },
});
</script>

<template>
  <div :class="cx('match-card')">
    <h3 :class="cx('match-title')">{{ match.capDau }}</h3>
    <p :class="cx('match-time')">
      {{ match.thoiGianDienRa }}
    </p>
    <p :class="cx('match-place')">{{ match.diaDiem }}</p>
  </div>
</template>
