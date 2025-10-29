<script setup>
import classNames from "classnames/bind";
import styles from "./souvenirCard.module.scss";

const cx = classNames.bind(styles);

const props = defineProps({
  quaLuuNiem: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div :class="cx('souvenir-card ')">
    <!-- Ảnh minh họa -->
    <img
      :src="props.quaLuuNiem.anhMinhHoa"
      alt="souvenir"
      :class="cx('souvenir-img')"
    />

    <!-- Nội dung -->
    <div :class="cx('info')">
      <h5 :class="cx('name')">{{ props.quaLuuNiem.tenQuaLuuNiem }}</h5>
      <p :class="cx('price')">
        {{ props.quaLuuNiem.gia.toLocaleString() }} VND
      </p>
      <p :class="cx('desc')">{{ props.quaLuuNiem.moTa }}</p>
      <button class="btn btn-danger btn-sm w-100 mt-2">Mua ngay</button>
    </div>
  </div>
</template>
