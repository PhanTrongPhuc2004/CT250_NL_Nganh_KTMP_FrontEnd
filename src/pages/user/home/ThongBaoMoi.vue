<template>
  <div class="container my-5">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <!-- <button class="btn btn-outline-primary">
        <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
      </button> -->
    </div>

    <div class="row g-4">
      <h1 class="text-danger fw-bold mb-4 title-heading">
        <i class="bi bi-megaphone-fill me-2"></i>
        Tin tức bóng đá mới nhất
      </h1>
      <div
        v-for="(item, index) in thongBaoList"
        :key="index"
        class="col-md-6 col-lg-4"
      >
        <div class="card shadow-sm h-100 news-card">
          <img
            :src="item.image"
            class="card-img-top news-image"
            :alt="item.title"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark">{{ item.title }}</h5>
            <p class="card-text text-muted">{{ item.desc }}</p>
            <div
              class="mt-auto d-flex justify-content-between align-items-center"
            >
              <a
                :href="item.link"
                target="_blank"
                class="btn btn-sm btn-danger"
              >
                <i class="bi bi-box-arrow-up-right me-1"></i> Đọc ngay
              </a>
              <small class="text-secondary">
                <i class="bi bi-newspaper me-1"></i>{{ item.source }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const thongBaoList = ref([]);

onMounted(async () => {
  const res = await axios.get("http://localhost:5000/tintuc");
  thongBaoList.value = res.data;
});

</script>

<style scoped>
.news-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.news-image {
  height: 200px;
  object-fit: cover;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-danger:hover {
  background-color: #bb2d3b;
}

@media (max-width: 768px) {
  .news-image {
    height: 180px;
  }
}
</style>

<!-- ✅ Thêm Bootstrap và Icons (chỉ cần thêm 1 lần trong main.js hoặc index.html) -->
<!--
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
  rel="stylesheet"
/>
-->
