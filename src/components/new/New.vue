<script setup>
import classNames from "classnames/bind";
import styles from "./new.module.scss";
const cx = classNames.bind(styles);

defineProps({
  baiDang: {
    type: Object,
    required: true,
    validator(value) {
      return (
        typeof value.MaBaiDang === "string" &&
        typeof value.tieuDe === "string" &&
        typeof value.noiDung === "string" &&
        typeof value.ngayDang === "string" &&
        typeof value.anhMinhHoa === "string"
      );
    },
  },
});
</script>

<template>
  <div :class="cx('news-card')">
    <img
      :src="baiDang.anhMinhHoa"
      alt="Ảnh minh họa"
      :class="cx('thumbnail')"
    />

    <div :class="cx('content')">
      <h3 :class="cx('title')">{{ baiDang.tieuDe }}</h3>
      <p :class="cx('date')">
        {{ new Date(baiDang.ngayDang).toLocaleDateString() }}
      </p>
      <p :class="cx('excerpt')">
        {{
          baiDang.noiDung.length > 120
            ? baiDang.noiDung.substring(0, 120) + "..."
            : baiDang.noiDung
        }}
      </p>
    </div>
  </div>
</template>
