<script setup>
import GlobalStyles from "./components/globalStyle/GlobalStyles.vue";
import DefaultLayout from "./components/layout/defaultLayout/DefaultLayout.vue";
import { useUserStore } from "./stores/userStore";
import { ref, onMounted } from "vue";
import Header from "./components/layout/header/Header.vue";
const userStore = useUserStore();
const user = ref(null);

onMounted(async () => {
  await userStore.checkAuth();
  user.value = userStore.user; // reactive
});
</script>

<template>
  <GlobalStyles>
    <!-- Chỉ render DefaultLayout khi user đã có giá trị -->
    <DefaultLayout :user="user">
      <router-view />
    </DefaultLayout>
  </GlobalStyles>
</template>
