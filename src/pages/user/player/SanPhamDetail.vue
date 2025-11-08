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
        <p class="price">{{ product.gia.toLocaleString() }} VND</p>
        <p class="desc">{{ product.moTa || "Không có mô tả" }}</p>

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
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "ProductDetail",
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
/* Nút Giỏ hàng góc phải trên */
.cart-btn {
  position: fixed;
  top: 10px;
  margin-bottom: 10px;
  right: 30px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 5px;
}
.product-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #dfe9f3, #ffffff);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  color: white;
}
.detail-card {
  display: flex;
  gap: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 1000px;
}
.detail-image {
  width: 45%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
}
.detail-info {
  flex: 1;
}
h1 {
  font-size: 2.3rem;
  font-weight: 800;
  background: brown;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #e60000;
  text-shadow: 0 2px 6px rgba(230, 0, 0, 0.4);
  letter-spacing: 1px;
  margin-bottom: 12px;
  font-family: "Poppins", sans-serif;
}

.desc {
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: black;
}
.quantity {
  margin-bottom: 25px;
}
.quantity input {
  width: 70px;
  padding: 6px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  text-align: center;
}
.buy-btn {
  background: linear-gradient(90deg, #ff6a00, #ee0979);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
}
.buy-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #ee0979, #ff6a00);
}
.quantity {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-family: sans-serif;
}

.quantity label {
  font-weight: bold;
  color: #333;
}

.quantity input[type="number"] {
  width: 60px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}
/* Nút giỏ hàng góc phải trên */


/* Badge số lượng */
.cart-badge {
  position: absolute;
  top: -10px;   /* di chuyển lên trên nút */
  left: -12px; /* di chuyển sang phải nút */
  background-color: red; /* màu đỏ */
  color: white;          /* chữ màu trắng */
  font-weight: bold;
  font-size: 0.85rem;    /* kích thước chữ nhỏ hơn */
  padding: 3px 8px;      /* khoảng cách bên trong badge */
  border-radius: 50%;    /* làm tròn badge */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;           /* luôn hiển thị trên icon */
}

</style>
