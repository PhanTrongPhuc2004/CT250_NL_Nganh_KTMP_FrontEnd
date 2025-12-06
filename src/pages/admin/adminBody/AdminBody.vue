<script setup>
import Sidebar from "@/components/common/sidebar/Sidebar.vue";
import classNames from "classnames/bind";
import styles from "./adminBody.module.scss";
import { onMounted, onUnmounted, ref } from "vue";
import { adminRoutes } from "@/router";
const cx = classNames.bind(styles);
const isSidebarOpen = ref(false);
const isMobile = ref(false);


const checkScreenSize = () => {
  const mobileBreakpoint = 768;
  isMobile.value = window.innerWidth <= mobileBreakpoint;
  
  // Trên laptop/desktop: sidebar luôn mở
  // Trên mobile: sidebar đóng
  isSidebarOpen.value = !isMobile.value;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div class="dashboard-wrapper position-relative d-flex" :style="{ minHeight: '100vh' }">
    <!-- Nút toggle sidebar - chỉ hiển thị trên mobile -->
    <button 
      v-if="isMobile"
      class="toggle-sidebar btn text-white position-fixed"
      :style="{ top: '10px', left: '10px', zIndex: 1100 }"
      @click="toggleSidebar"
    >
      {{ isSidebarOpen ? '✕' : '☰' }}
    </button>
    
    <!-- Overlay - chỉ hiển thị trên mobile khi sidebar mở -->
    <div 
      v-if="isMobile && isSidebarOpen"
      class="overlay position-fixed"
      :style="{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999
      }"
      @click="isSidebarOpen = false"
    ></div>
    
    <!-- Sidebar -->
    <div 
      class="sidebar-container position-relative"
      :class="{ 'd-block': isSidebarOpen, 'd-none': !isSidebarOpen && isMobile }"
      :style="{
        width: '250px',
        ...(isMobile && {
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }),
        ...(!isMobile && {
          display: 'block'
        })
      }"
    >
      <Sidebar :items="adminRoutes" />
    </div>
    
    <!-- Nội dung chính -->
    <div 
      class="main-content flex-grow-1 p-4"
      :class="{ 'content-pushed': isMobile && isSidebarOpen }"
      :style="{
        ...(isMobile && isSidebarOpen && {
        })
      }"
    >
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
/* CSS internal - không cần file SCSS riêng */

.toggle-sidebar {
  display: none;
}

/* Mobile styles */
@media screen and (max-width: 768px) {
  .toggle-sidebar {
    display: block;
  }
  
  .sidebar-container {
    background: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
}

/* Desktop/Laptop styles */
@media screen and (min-width: 769px) {
  .main-content {
    width: calc(100% - 250px);
  }
}
</style>