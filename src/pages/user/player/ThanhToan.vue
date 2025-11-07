
<template>
  <div class="checkout-page">
    <h1>Thanh toán</h1>

    <form @submit.prevent="confirmOrder" class="checkout-form">
      <label>Họ và tên người nhận:</label>
      <input type="text" v-model="order.name" required />

      <label>Số điện thoại:</label>
      <input type="tel" v-model="order.phone" required />

      <label>Địa chỉ giao hàng:</label>
      <textarea v-model="order.address" required></textarea>

      <h3>Tổng thanh toán: {{ totalAmount.toLocaleString() }}₫</h3>

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
      return this.cart.reduce((sum, item) => sum + item.gia * item.quantity, 0);
    },
  },
  mounted() {
    const userStore = useUserStore();

    // 1️⃣ Lấy user từ Pinia store
    this.tenDangNhap = userStore.user?.tenDangNhap || "guest";

    // 2️⃣ Merge giỏ hàng guest nếu vừa login
    const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
    const userCartKey = `cart_${this.tenDangNhap}`;
    const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    if (guestCart.length > 0 && this.tenDangNhap !== "guest") {
      // Nối guestCart vào userCart
      const mergedCart = [...userCart];

      guestCart.forEach((item) => {
        const index = mergedCart.findIndex((i) => i.maSanPham === item.maSanPham);
        if (index > -1) {
          mergedCart[index].quantity += item.quantity;
        } else {
          mergedCart.push(item);
        }
      });

      this.cart = mergedCart;
      localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
      localStorage.removeItem("cart_guest");
    } else {
      this.cart = userCart;
    }

    // 3️⃣ Chặn thanh toán nếu giỏ hàng trống
    if (!this.cart.length) {
      alert("Giỏ hàng trống! Quay lại giỏ hàng.");
      this.$router.push("/cart");
    }
  },
  methods: {
    async confirmOrder() {
      if (!this.cart.length) return;

      this.loading = true;

      const newOrder = {
        tenDangNhap: this.tenDangNhap,
        ...this.order,
        cart: this.cart,
        total: this.totalAmount,
        date: new Date(),
      };

      try {
        // Gửi đơn hàng lên backend
        await axios.post(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang`,
          newOrder
        );

        // Xóa giỏ hàng sau khi thanh toán
        localStorage.removeItem(`cart_${this.tenDangNhap}`);

        alert("🎉 Đơn hàng của bạn đã được thanh toán và lưu thành công!");
        this.$router.push("/orders");
      } catch (err) {
        console.error("❌ Lỗi khi gửi đơn hàng:", err);
        alert("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>
.checkout-page {
  background: linear-gradient(135deg, #f0f2f5, #e4ebf1);
  color: #333;
  font-family: "Poppins", sans-serif;
  padding: 60px 20px;
  min-height: 100vh;
}

.checkout-page h1 {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #2e3b55;
  margin-bottom: 30px;
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
  transition: 0.2s ease;
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

.confirm-btn {
  background: linear-gradient(90deg, #4e73df, #1cc88a);
  color: white;
  font-weight: 600;
  padding: 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.25s ease;
}

.confirm-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
