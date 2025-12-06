<template>
  <div class="container my-5">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <!-- <button class="btn btn-outline-primary">
        <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
      </button> -->
    </div>

    <div class="row g-4">
      <h1 class="text-danger fw-bold mb-4 title-heading">
        Tin tức bóng đá mới nhất
      </h1>

      <!-- Tin tức bóng đá tự động (component) -->
      <hr class="my-4" />
      <News />

      <!-- Danh sách thông báo từ API -->
      <div
        v-for="(item, index) in thongBaoList"
        :key="index"
        class="col-md-6 col-lg-4"
      >
        <div class="card shadow-sm h-100 news-card">
          <img
            :src="item.image || fallbackImage"
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
                rel="noopener"
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

      <!-- Thông báo nếu không có dữ liệu -->
      <div v-if="!loading && thongBaoList.length === 0" class="text-center mt-4">
        <p class="text-muted">Không có tin tức.</p>
      </div>

      <div v-if="loading" class="text-center mt-4">
        <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>

      <div v-if="error" class="text-center text-danger mt-3">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// import component News — chỉnh đúng đường dẫn nếu cần
import News from "@/pages/admin/component/News.vue";

// reactive state
const thongBaoList = ref([]);
const loading = ref(false);
const error = ref(null);
const fallbackImage = "/placeholder-300x200.png"; // hoặc 1 URL placeholder hợp lệ

// Lấy dữ liệu khi component mount
onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    // sửa URL nếu API của bạn khác
    const res = await axios.get("http://localhost:5000/tintuc");
    // đảm bảo res.data là mảng
    if (Array.isArray(res.data)) {
      thongBaoList.value = res.data;
    } else {
      // nếu API trả object chứa field data
      thongBaoList.value = res.data.data || [];
    }
  } catch (err) {
    console.error("Lỗi khi fetch tintuc:", err);
    error.value = "Không thể tải danh sách tin tức. Vui lòng kiểm tra server.";
  } finally {
    loading.value = false;
  }
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
