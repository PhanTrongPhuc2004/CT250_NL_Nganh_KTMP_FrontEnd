<template>
  <div class="checkout-page">
    <h1>Thanh toán</h1>

    <!-- 🛍 Danh sách sản phẩm -->
    <div v-if="cart.length" class="cart-summary">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.maSanPham">
            <td>
              <img
                :src="item.anhMinhHoa?.startsWith('http') ? item.anhMinhHoa : `/${item.anhMinhHoa}`"
                alt="Ảnh sản phẩm"
                class="checkout-item-img"
              />
            </td>
            <td>{{ item.tenQuaLuuNiem }}</td>
            <td>{{ item.gia.toLocaleString() }} VND</td>
            <td>{{ item.soLuong }}</td>
            <td>{{ (item.gia * item.soLuong).toLocaleString() }} VND</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>Không có sản phẩm nào để thanh toán.</p>

    <!-- 🧾 Form thanh toán -->
    <form v-if="cart.length" @submit.prevent="confirmOrder" class="checkout-form">
      <label>Họ và tên người nhận:</label>
      <input type="text" v-model="order.name" required />

      <label>Số điện thoại:</label>
      <input type="tel" v-model="order.phone" required />

      <label>Địa chỉ giao hàng:</label>
      <textarea v-model="order.address" required></textarea>

      <h3>Tổng thanh toán: {{ totalAmount.toLocaleString() }} VND</h3>

      <button type="submit" class="btn btn-success w-100" :disabled="loading">
        <i v-if="!loading" class="bi bi-check-circle me-1"></i>
        <span v-if="!loading">Xác nhận thanh toán</span>
        <span v-else>
          <i class="bi bi-hourglass-split me-1"></i> Đang xử lý...
        </span>
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "../../../stores/userStore";

export default {
  name: "CheckoutPage",
  data() {
    return {
      order: { name: "", phone: "", address: "" },
      cart: [],
      tenDangNhap: "guest",
      loading: false,
    };
  },
  computed: {
    totalAmount() {
      return this.cart.reduce(
        (sum, item) => sum + Number(item.gia) * Number(item.soLuong),
        0
      );
    },
  },
  mounted() {
  const userStore = useUserStore();
  this.tenDangNhap = userStore.user?.tenDangNhap || "guest";

  const userCartKey = `cart_${this.tenDangNhap}`;
  let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

  // Nếu user đã đăng nhập nhưng chưa có cart, thử lấy từ guest cart
  if (!cart.length && this.tenDangNhap !== "guest") {
    const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
    if (guestCart.length) {
      cart = guestCart;
      // Tự động chuyển guest cart thành user cart
      localStorage.setItem(userCartKey, JSON.stringify(cart));
      localStorage.removeItem("cart_guest");
    }
  }

  // Fallback: nếu vẫn không có cart, thử guest cart
  if (!cart.length) {
    cart = JSON.parse(localStorage.getItem("cart_guest")) || [];
  }

  // Chuẩn hóa giỏ hàng
  this.cart = cart.map((item) => ({
    maSanPham: item.maSanPham,
    tenQuaLuuNiem: item.tenQuaLuuNiem,
    gia: Number(item.gia) || 0,
    soLuong: Number(item.soLuong ?? item.quantity ?? 1),
    anhMinhHoa: item.anhMinhHoa || "",
  }));

  if (!this.cart.length) {
    alert("Giỏ hàng trống! Quay lại giỏ hàng.");
    this.$router.push("/cart");
  }
},
  methods: {
    async confirmOrder() {
      if (!this.cart.length) return;

      this.loading = true;

      // 🔧 Chuẩn hóa lại mảng cart đúng key 'quantity'
      const normalizedCart = this.cart.map(item => ({
        tenQuaLuuNiem: item.tenQuaLuuNiem,
        gia: item.gia,
        quantity: Number(item.soLuong), // ✅ đổi sang quantity
        anhMinhHoa: item.anhMinhHoa
      }));

      const newOrder = {
        tenDangNhap: this.tenDangNhap,
        ...this.order,
        cart: normalizedCart, // ✅ dùng cart đã chuẩn hóa
        total: this.totalAmount,
        date: new Date(),
      };

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang`,
          newOrder
        );

        localStorage.removeItem(`cart_${this.tenDangNhap}`);
        localStorage.removeItem("cart_guest");

        alert("🎉 Đơn hàng của bạn đã được thanh toán và lưu thành công!");
        this.$router.push("/orders");
      } catch (err) {
        console.error("❌ Lỗi khi gửi đơn hàng:", err);
        alert("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!");
      } finally {
        this.loading = false;
      }
    }
    ,
  },
};
</script>


<style scoped>
.checkout-page {
  background: linear-gradient(135deg, #f0f2f5, #e4ebf1);
  color: #333;
  font-family: "Poppins", sans-serif;
  padding: 40px 20px 80px;
  min-height: 100vh;
}

.checkout-page h1 {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #2e3b55;
  margin-bottom: 30px;
}

/* Bảng hiển thị sản phẩm */
.cart-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.cart-table th {
  background: #4e73df;
  color: white;
  padding: 14px;
  text-align: center;
  font-weight: 600;
}

.cart-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.checkout-item-img {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 30px 25px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.checkout-form label {
  font-weight: 600;
  color: #444;
  text-align: left;
}

.checkout-form input,
.checkout-form textarea {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  background: #fafafa;
}

.checkout-form input:focus,
.checkout-form textarea:focus {
  border-color: #4e73df;
  box-shadow: 0 0 6px rgba(78, 115, 223, 0.3);
  background: #fff;
}

.checkout-form textarea {
  min-height: 90px;
  resize: vertical;
}

.checkout-form h3 {
  text-align: right;
  color: #2e3b55;
  font-weight: 700;
  margin-top: 10px;
}
</style>
