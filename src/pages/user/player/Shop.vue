<template>
  <div class="shop-page">
    <div class="shop-container">
      <div class="shop-header">
        <h1>🛒 Cửa hàng Quà Lưu Niệm</h1>
        <button class="order-btn" @click="$router.push('/orders')">
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
        // ✅ Luôn lấy dữ liệu từ backend
        const res = await axios.get("http://localhost:5000/qualuuniem");
        this.products = res.data;
      } catch (err) {
        this.error = "Không thể tải danh sách quà lưu niệm.";
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(path) {
      if (!path) return "https://via.placeholder.com/200x180?text=No+Image";
      if (path.startsWith("http")) return path;
      return `http://localhost:5000/${path}`;
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

.cart-btn {
  background: linear-gradient(90deg, #ff6a00, #ee0979);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.cart-btn:hover {
  transform: scale(1.05);
}
.shop-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #360808, #6d1b30);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.shop-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  width: 95%;
  max-width: 1200px;
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #ffeb3b, #ff4081);
  background-clip: text;
  color: transparent;
  text-align: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 25px;
}

.product-card {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.3);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #fff;
}

.product-price {
  font-size: 1.1rem;
  color: #ffe57f;
}
.order-btn {
  background: linear-gradient(90deg, #3d76b7, #63679f);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.order-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #e91e63, #7b1fa2);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.order-btn:active {
  transform: scale(0.97);
}

</style>
