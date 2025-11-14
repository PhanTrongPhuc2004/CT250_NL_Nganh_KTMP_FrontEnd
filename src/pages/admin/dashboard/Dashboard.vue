<template>
  <div class="dashboard-container">
    <div class="content">
      <h1>Dashboard</h1>
      <p>Nhấn nút bên dưới để xem hiệu ứng loading</p>

      <button @click="showLoading" class="btn-primary">Hiển thị Loading</button>
    </div>

    <!-- Loading Component -->
    <Loading
      v-model:active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="true"
      :loader="spinner"
      :color="'#007bff'"
      :height="128"
      :width="128"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const isLoading = ref(false);
const spinner = "dots"; // có thể thay đổi: 'spinner', 'dots', 'bars'

// Hàm hiển thị loading
const showLoading = () => {
  isLoading.value = true;

  // Giả lập API call hoặc xử lý dữ liệu
  setTimeout(() => {
    isLoading.value = false;
  }, 3000); // Loading sẽ tắt sau 3 giây
};

// Hàm khi người dùng cancel loading
const onCancel = () => {};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  background: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-primary:active {
  transform: translateY(0);
}
</style>
