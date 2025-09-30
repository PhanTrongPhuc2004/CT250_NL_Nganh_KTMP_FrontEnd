<script setup>
import Header from "../header/Header.vue";
</script>

<template>
  <div class="default-layout">
    <Header />
    <main class="content">
      <slot />
    </main>
  </div>
</template>
