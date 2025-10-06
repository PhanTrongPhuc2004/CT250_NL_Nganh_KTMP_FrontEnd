<script setup>
import classNames from "classnames/bind";
import styles from "./playerCard.module.scss";
const cx = classNames.bind(styles);

const props = defineProps({
  ten: { type: String, required: true },
  viTri: { type: String, required: true },
  quocTich: { type: String, required: true }, // đường dẫn ảnh cờ quốc gia
  anhMinhHoa: { type: String, required: true }, // ảnh đại diện cầu thủ
  soAo: { type: Number, default: null }, // số áo (optional)
});
</script>

<template>
  <div :class="cx('player-card')">
    <!-- Ảnh cầu thủ -->
    <img :src="props.anhMinhHoa" alt="player" :class="cx('player-img')" />

    <!-- Thông tin dưới -->
    <div :class="cx('info')">
      <span v-if="props.soAo" :class="cx('number')">#{{ props.soAo }}</span>
      <h3 :class="cx('name')">{{ props.ten }}</h3>
      <p :class="cx('sub')">{{ props.viTri }}</p>
    </div>
  </div>
</template>
