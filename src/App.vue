<script setup>
import GlobalStyles from "./components/globalStyle/GlobalStyles.vue";
import DefaultLayout from "./components/layout/defaultLayout/DefaultLayout.vue";
import { useUserStore } from "./stores/userStore";
import { onMounted, ref } from "vue";
import { getMe } from "./utils";


const userStore = useUserStore();
const appReady = ref(false);



onMounted(async () => {

  try {
    await userStore.initialize();
  } catch (error) {
    console.error("❌ App initialization failed:", error);
  } finally {
    appReady.value = true;
  }
});
</script>

<template>
  <GlobalStyles>
    <DefaultLayout :user="userStore?.user">
      <router-view />
    </DefaultLayout>
  </GlobalStyles>
</template>

<style scoped>
.app-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f9fa;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
