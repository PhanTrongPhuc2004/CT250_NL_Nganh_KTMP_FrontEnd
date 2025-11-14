<template>
  <div class="shop-page">
    <div class="shop-container">
      <!-- Header -->
      <div class="shop-header">
          <h1 class="shop-title">
            <i class="bi bi-gift me-2"></i> Cửa hàng Quà Lưu Niệm
          </h1>
        <div>
          <button class="btn btn-outline-primary me-2" @click="$router.push('/orders')">
            <i class="bi bi-box-seam-fill me-2"></i> Đơn hàng
          </button>

          <button class="btn btn-primary position-relative" @click="$router.push('/cart')">
            <i class="bi bi-cart-fill me-1"></i> Giỏ hàng
          </button>
        </div>
      </div>

      <!-- Bộ lọc -->
      <div class="filter-bar card shadow-sm p-3 mb-4">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search text-secondary"></i>
              </span>
              <input
                v-model="searchText"
                type="text"
                class="form-control border-start-0"
                placeholder="Tìm theo tên quà lưu niệm..."
              />
            </div>
          </div>

          <div class="col-md-4">
            <select v-model="priceRange" class="form-select">
              <option value=""><i class="bi bi-cash-coin"></i> Tất cả mức giá</option>
              <option value="low">Dưới 100.000 VND</option>
              <option value="mid">100.000 VND - 300.000 VND</option>
              <option value="high">Trên 300.000 VND</option>
            </select>
          </div>

          <div class="col-md-2 text-end">
            <button class="btn btn-outline-danger w-100" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Đặt lại
            </button>
          </div>
        </div>
      </div>

      <!-- Nội dung -->
      <div v-if="loading" class="loading text-center mt-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">⏳ Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="error" class="error text-danger text-center">
        {{ error }}
      </div>

      <div v-else class="product-grid">
        <div
          v-for="(item, index) in filteredProducts"
          :key="index"
          class="product-card"
          @click="goToDetail(item._id)"
        >
          <img
            :src="getImageUrl(item.anhMinhHoa)"
            alt="Ảnh quà"
            class="product-image"
          />
          <h3 class="product-name">{{ item.tenQuaLuuNiem }}</h3>
          <!-- <p class="product-category">
            <i class="bi bi-tags-fill me-1 text-secondary"></i>
            {{ item.danhMuc || "Chưa phân loại" }}
          </p> -->
          <p class="product-price">
            <i class="bi bi-cash-coin me-1"></i> {{ item.gia.toLocaleString() }} VND
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

export default {
  name: "Shop",
  data() {
    return {
      products: [],
      searchText: "",
      priceRange: "",
      loading: true,
      error: null,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((item) => {
        const matchName = item.tenQuaLuuNiem
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
        const matchPrice =
          this.priceRange === "low"
            ? item.gia < 100000
            : this.priceRange === "mid"
            ? item.gia >= 100000 && item.gia <= 300000
            : this.priceRange === "high"
            ? item.gia > 300000
            : true;
        return matchName && matchPrice;
      });
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem`
        );
        this.products = res.data;
      } catch (err) {
        this.error = "Không thể tải danh sách quà lưu niệm.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(path) {
      if (!path) return "https://via.placeholder.com/200x180?text=No+Image";
      if (path.startsWith("http") || path.startsWith("data:image")) return path;
      return `/${path}`;
    },
    goToDetail(id) {
      this.$router.push(`/shop/${id}`);
    },
    resetFilters() {
      this.searchText = "";
      this.priceRange = "";
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #dfe9f3, #ffffff);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
}

.shop-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 40px;
  width: 95%;
  max-width: 1300px;
  color: #333;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.3rem;
  font-weight: bold;
  color: #8B2C31;
  display: flex;
  align-items: center;
}

/* Bộ lọc */
.filter-bar {
  background: #f8f9fa;
  border-radius: 12px;
  transition: box-shadow 0.3s ease;
}
.filter-bar:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}

/* Lưới sản phẩm */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 25px;
}

/* Thẻ sản phẩm */
.product-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: 0.3s ease;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #08175a;
}

.product-category {
  font-size: 0.9rem;
  color: #555;
}

.product-price {
  font-size: 1.1rem;
  color: #a01616;
  font-weight: bold;
}
</style>
