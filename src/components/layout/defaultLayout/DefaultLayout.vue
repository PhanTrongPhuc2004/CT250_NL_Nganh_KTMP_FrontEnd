<script setup>
import Header from "../header/Header.vue";
import Footer from "../footer/Footer.vue";
</script>

<template>
  <div class="default-layout">
    <Header />
    <main class="content" style="margin-top: var(--header-height)">
      <slot />
    </main>
    <Footer />
  </div>
</template>
