<script setup>
import Home from "./pages/home/Home.vue";
import GlobalStyles from "./components/globalStyle/GlobalStyles.vue";
import DefaultLayout from "./components/layout/defaultLayout/DefaultLayout.vue";
</script>

<template>
  <GlobalStyles>
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
  </GlobalStyles>
</template>
