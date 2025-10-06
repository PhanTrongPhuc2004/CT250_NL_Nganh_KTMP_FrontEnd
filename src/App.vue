<script setup>
import Home from "./pages/home/Home.vue";
import GlobalStyles from "./components/globalStyle/GlobalStyles.vue";
import DefaultLayout from "./components/layout/defaultLayout/DefaultLayout.vue";
import axios from "axios";
import { useUserStore } from "./stores/userStore";
import { onMounted } from "vue";

//Kiểm tra trạng thái đăng nhập
onMounted(() => {
  useUserStore().checkAuth();
});
</script>

<template>
  <GlobalStyles>
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
  </GlobalStyles>
</template>
