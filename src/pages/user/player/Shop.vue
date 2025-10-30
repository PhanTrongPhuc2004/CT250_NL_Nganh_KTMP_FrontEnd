<template>
  <div class="shop-page">
    <div class="shop-container">
      <div class="shop-header">
        <h1>Cửa hàng Quà Lưu Niệm</h1>
        <button class="cart-btn" @click="$router.push('/orders')">
          📋 Đơn hàng
        </button>
        <button class="cart-btn" @click="$router.push('/cart')">
          🛒 Giỏ Hàng
        </button>
      </div>

      <div v-if="loading" class="loading">Đang tải dữ liệu...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="product-grid">
        <div
          v-for="(item, index) in products"
          :key="index"
          class="product-card"
          @click="goToDetail(item._id)"
        >
          <img :src="getImageUrl(item.anhMinhHoa)" alt="Ảnh quà" class="product-image" />
          <h3 class="product-name">{{ item.tenQuaLuuNiem }}</h3>
          <p class="product-price">{{ item.gia.toLocaleString() }}₫</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Shop",
  data() {
    return {
      products: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get("http://localhost:5000/qualuuniem");
        this.products = res.data;
      } catch (err) {
        this.error = "Không thể tải danh sách quà lưu niệm.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // ✅ Hàm xử lý ảnh linh hoạt
    getImageUrl(path) {
      if (!path) return "https://via.placeholder.com/200x180?text=No+Image";
      if (path.startsWith("http") || path.startsWith("data:image")) return path;
      // Nếu ảnh nằm trong public/data
      return `/${path}`;
    },

    goToDetail(id) {
      this.$router.push(`/shop/${id}`);
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>


<style scoped>
.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Nút giỏ hàng: nghiêm túc, hiện đại */
.cart-btn {
  background: linear-gradient(90deg, #2c3e50, #4ca1af); /* Xanh than -> xanh xám */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.cart-btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Nền trang tổng thể */
.shop-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #dfe9f3, #ffffff); /* Xanh nhạt -> trắng */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

/* Container chính */
.shop-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  width: 95%;
  max-width: 1200px;
  color: #333;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Tiêu đề trang */
h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #2c3e50; /* xanh than nghiêm túc */
  font-weight: bold;
  text-align: center;
}

/* Lưới sản phẩm */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 25px;
}

/* Thẻ sản phẩm */
.product-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: 0.3s;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}
.product-card:hover {
  transform: translateY(-5px);
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Ảnh sản phẩm */
.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

/* Tên sản phẩm */
.product-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #08175a;
}

/* Giá sản phẩm */
.product-price {
  font-size: 1.1rem;
  color: #a01616; /* xanh ngọc đậm, nổi bật nhưng vẫn nghiêm túc */
}
</style>

