<template>
  <div class="product-detail">

    <div class="detail-card" v-if="product">
          <!-- Nút Giỏ hàng góc phải trên -->
      <!-- Nút Giỏ hàng góc phải trên -->
      <button class="btn btn-primary cart-btn" @click="$router.push('/cart')">
        <i class="bi bi-cart-fill me-1"></i> Giỏ hàng
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </button>
      <img
        :src="getImageUrl(product.anhMinhHoa)"
        alt="Ảnh sản phẩm"
        class="detail-image"
      />
      <div class="detail-info">
        <h1>{{ product.tenQuaLuuNiem }}</h1>
        
  <!-- 💰 GIÁ / GIÁ GIẢM -->
    <div class="price-box">
      <span
        v-if="product.giaGiam"
        class="price-discount"
      >
        {{ product.gia.toLocaleString() }} VND
      </span>
      <span v-if="product.giaGiam" 
      class="price-original text-decoration-line-through"
      >
        {{ product.giaGiam.toLocaleString() }} VND
      </span>

      <span v-else class="price">
        {{ product.gia.toLocaleString() }} VND
      </span>
    </div>

    <!-- ⭐ ĐÁNH GIÁ -->
    <div class="rating-box">
      <div class="stars">
        <i
          v-for="star in 5"
          :key="star"
          class="bi"
          :class="
            star <= Math.round(product.soSaoTrungBinh || 0)
              ? 'bi-star-fill text-warning'
              : 'bi-star text-secondary'
          "
        ></i>
      </div>
      <span class="rating-text">
        {{ product.soSaoTrungBinh }} / 5 ({{ product.luotDanhGia }} đánh giá)
      </span>
    </div>

    <!-- 🔥 LƯỢT BÁN -->
    <p class="sold-count">🔥 Đã bán: {{ product.luotBan }}</p>

    <p class="desc">{{ product.moTa || "Không có mô tả" }}</p>

    <!-- SỐ LƯỢNG -->
    <div class="quantity">
      <label>Số lượng:</label>
      <input type="number" v-model="quantity" min="1" />
    </div>
        

        <button
          @click="muaNgay"
          class="btn btn-success btn-lg shadow-sm d-flex align-items-center justify-content-center gap-2 px-4 py-2"
        >
          <i class="bi bi-cart-plus"></i>
          Thêm vào giỏ hàng
        </button>

          <button 
            class="btn btn-outline-primary" 
            style="margin-top: 10px;" 
            @click="$router.push('/shop')"
          >
            <i class="bi bi-arrow-left-circle me-1"></i> Tiếp tục mua hàng
          </button>


      </div>
    </div>

    <div v-else class="loading">Đang tải thông tin sản phẩm...</div>
      <!-- 👇 Phần bình luận -->
      <div class="binhluan-wrapper">
        <BinhLuan v-if="product" :productId="product._id" />
      </div>
  </div>

</template>

<script>
import axios from "axios";
import BinhLuan from "@/pages/user/player/BinhLuan.vue"

export default {
  name: "ProductDetail",
  components: { BinhLuan },
  data() {
    return {
      product: null,
      quantity: 1,
      cart: [], // Lưu giỏ hàng hiện tại
    };
  },
  computed: {
    // Tính tổng số lượng sản phẩm trong giỏ để hiển thị badge
    cartCount() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  },
  async mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.tenDangNhap || "guest";

    // Load giỏ hàng hiện tại
    this.cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];

    // Load thông tin sản phẩm
    const id = this.$route.params.id;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem/${id}`
      );
      this.product = res.data;
    } catch (err) {
      console.error("❌ Lỗi tải sản phẩm:", err);
    }
  },
  methods: {
    // Hàm xử lý ảnh linh hoạt
    getImageUrl(path) {
      if (!path) return "https://via.placeholder.com/200x180?text=No+Image"; 
      if (path.startsWith("http") || path.startsWith("data:image")) return path;
      return `/${path}`; 
    },

    muaNgay() {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.tenDangNhap || "guest";
      const cartKey = `cart_${username}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const existing = cart.find(item => item._id === this.product._id);
      if (existing) existing.quantity += this.quantity;
      else cart.push({
        _id: this.product._id,
        tenQuaLuuNiem: this.product.tenQuaLuuNiem,
        gia: this.product.gia,
        anhMinhHoa: this.product.anhMinhHoa,
        quantity: this.quantity,
      });

      localStorage.setItem(cartKey, JSON.stringify(cart));
      this.cart = cart; // cập nhật badge
      alert(`✅ Đã thêm ${this.quantity} x ${this.product.tenQuaLuuNiem} vào giỏ hàng.`);
    },
  },
};
</script>

<style scoped>
/* 🎯 VÙNG BÌNH LUẬN — tách biệt, rõ ràng, nền trắng */
.binhluan-wrapper {
  width: 90%;
  max-width: 1000px;
  margin: 40px auto 20px auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

/* Tiêu đề */
.binhluan-wrapper h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 18px;
}



/* ===================== */
/*      CHI TIẾT SP      */
/* ===================== */

.product-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #dfe9f3, #ffffff);
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Card sản phẩm */
.detail-card {
  display: flex;
  gap: 35px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(18px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  width: 90%;
  max-width: 1100px;
  margin-bottom: 40px;
}

.detail-image {
  width: 45%;
  height: 420px;
  object-fit: cover;
  border-radius: 15px;
}

.detail-info {
  flex: 1;
}

/* Tiêu đề sản phẩm */
h1 {
  font-size: 2.4rem;
  font-weight: 800;
  background: brown;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1.5px;
  margin-bottom: 18px;
}



/* ===================== */
/*         GIÁ SP        */
/* ===================== */

.price-box {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #e60000;
}

.price-discount {
  font-size: 2rem;
  font-weight: bold;
  color: #e60000;
}

.price-original {
  font-size: 1.2rem;
  color: #888;
}



/* ===================== */
/*        ĐÁNH GIÁ       */
/* ===================== */

.rating-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.rating-text {
  font-size: 1rem;
  color: #444;
}

.sold-count {
  font-size: 1rem;
  margin-bottom: 15px;
  color: #444;
}



.quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 15px 0 25px 0;
}

.quantity label {
  font-weight: bold;
  color: #333;
}

.quantity input[type="number"] {
  width: 70px;
  padding: 6px;
  border: 1px solid #bbb;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
}



.cart-btn {
  position: fixed;
  top: 12px;
  right: 28px;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Badge */
.cart-badge {
  position: absolute;
  top: -8px;
  left: -10px;
  background: red;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  padding: 3px 7px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}



.desc {
  margin-bottom: 18px;
  font-size: 1.15rem;
  color: #222;
}


@media (max-width: 850px) {
  .detail-card {
    flex-direction: column;
    text-align: center;
  }

  .detail-image {
    width: 100%;
    height: 300px;
  }
}


</style>
