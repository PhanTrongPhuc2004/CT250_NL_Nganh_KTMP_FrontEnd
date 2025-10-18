<script setup>
import Header from "../header/Header.vue";
import Footer from "../footer/Footer.vue";
import Dashboard from "@/pages/admin/dashboard/Dashboard.vue";
import AdminHeader from "../adminHeader/AdminHeader.vue";
import { useUserStore } from "@/stores/userStore";
import { watch } from "vue";
import { toRaw } from "vue";
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});
// log khi props.user thay đổi
watch(
  () => props.user,
  (newUser) => {
    console.log("user vừa nhận:", toRaw(newUser));
  },
  { immediate: true } // log luôn giá trị hiện tại nếu có
);
</script>

<template>
  <!-- Chờ user load xong -->
  <div v-if="props.user">
    <!-- Fan -->
    <div
      v-if="toRaw(props.user).vaiTro?.toLowerCase() === 'nguoihammo'"
      class="default-layout"
    >
      <Header />
      <main class="content" style="margin-top: var(--header-height)">
        <slot />
      </main>
      <Footer />
    </div>

    <!-- Admin -->
    <div
      v-else-if="toRaw(props.user).vaiTro?.toLowerCase() === 'admin'"
      class="default-layout"
    >
      <AdminHeader />
      <Dashboard />
    </div>
  </div>

  <!-- Nếu chưa có user thì hiển thị layout mặc định -->
  <div v-else class="default-layout">
    <Header />
    <main class="content" style="margin-top: var(--header-height)"></main>
    <Footer />
  </div>
</template>
