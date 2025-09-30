<script setup>
import classNames from "classnames/bind";
import styles from "./globalStyles.module.scss";

const cx = classNames.bind(styles);
</script>

<template>
  <div :class="cx('global-wrapper')">
    <!-- Children sẽ được inject vào đây -->
    <slot />
  </div>
</template>
