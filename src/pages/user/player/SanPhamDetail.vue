<template>
  <div class="product-detail">
    <div class="detail-card" v-if="product">
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

        <button @click="muaNgay" class="btn btn-success btn-lg shadow-sm d-flex align-items-center justify-content-center gap-2 px-4 py-2">
          <i class="bi bi-cart-plus"></i>
          Thêm vào giỏ hàng
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
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const res = await axios.get(`http://localhost:5000/qualuuniem/${id}`);
      this.product = res.data;
    } catch (err) {
      console.error("❌ Lỗi tải sản phẩm:", err);
    }
  },
  methods: {
    // ✅ Hàm xử lý ảnh linh hoạt
    getImageUrl(path) {
      if (!path) return "https://via.placeholder.com/200x180?text=No+Image"; // ảnh mặc định
      if (path.startsWith("http") || path.startsWith("data:image")) return path;
      return `/${path}`; // ảnh từ public/data
    },

    muaNgay() {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.tenDangNhap || "guest";
      const cartKey = `cart_${username}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const existing = cart.find((item) => item._id === this.product._id);

      if (existing) {
        existing.quantity += this.quantity;
      } else {
        cart.push({
          _id: this.product._id,
          tenQuaLuuNiem: this.product.tenQuaLuuNiem,
          gia: this.product.gia,
          anhMinhHoa: this.product.anhMinhHoa,
          quantity: this.quantity,
        });
      }

      localStorage.setItem(cartKey, JSON.stringify(cart));

      alert(`✅ Đã thêm ${this.quantity} x ${this.product.tenQuaLuuNiem} vào giỏ hàng.`);
    },
  },
};
</script>


<style scoped>
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
  padding: 40px;
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

</style>
