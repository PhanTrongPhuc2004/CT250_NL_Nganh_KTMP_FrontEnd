<template>
  <div class="checkout-page">
    <h1>💳 Thanh toán</h1>

    <form @submit.prevent="confirmOrder" class="checkout-form">
      <label>Họ và tên người nhận:</label>
      <input type="text" v-model="order.name" required />

      <label>Số điện thoại:</label>
      <input type="tel" v-model="order.phone" required />

      <label>Địa chỉ giao hàng:</label>
      <textarea v-model="order.address" required></textarea>

      <h3>Tổng thanh toán: {{ totalAmount.toLocaleString() }}₫</h3>

      <button type="submit" class="confirm-btn" :disabled="loading">
        {{ loading ? "⏳ Đang xử lý..." : "✅ Xác nhận thanh toán" }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CheckoutPage",
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.tenDangNhap || "guest";
    return {
      username,
      order: { name: "", phone: "", address: "" },
      cart: JSON.parse(localStorage.getItem(`cart_${username}`)) || [],
      loading: false,
    };
  },
  computed: {
    totalAmount() {
      return this.cart.reduce((sum, item) => sum + item.gia * item.quantity, 0);
    },
  },
  mounted() {
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
        username: this.username,
        ...this.order,
        cart: this.cart,
        total: this.totalAmount,
        date: new Date(),
      };

      try {
        // 🧩 Gửi dữ liệu lên backend (API Node/Express)
        await axios.post("http://localhost:5000/donhang", newOrder);

        // 🧹 Xóa giỏ hàng localStorage sau khi lưu thành công
        localStorage.removeItem(`cart_${this.username}`);

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
  background: linear-gradient(135deg, #42275a, #734b6d);
  color: white;
  padding: 50px;
  min-height: 100vh;
}
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
}
.checkout-form input,
.checkout-form textarea {
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
}
.confirm-btn {
  background: linear-gradient(90deg, #00c853, #b2ff59);
  color: black;
  font-weight: 600;
  padding: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.confirm-btn:hover {
  opacity: 0.9;
}
.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
