<script setup>
import classNames from "classnames/bind";
import styles from "./souvenirCard.module.scss";

const cx = classNames.bind(styles);

const props = defineProps({
  quaLuuNiem: {
    type: Object,
    required: true,
    validator(value) {
      return (
        "maQuaLuuNiem" in value &&
        "tenQuaLuuNiem" in value &&
        "gia" in value &&
        "anhMinhHoa" in value
      );
    },
  },
});
</script>

<template>
  <div :class="cx('souvenir-card col-md-3 col-sm-6')">
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
