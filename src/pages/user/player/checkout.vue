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

      <button type="submit" class="confirm-btn">✅ Xác nhận thanh toán</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CheckoutPage",
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.tenDangNhap || "guest";
    return {
      username,
      order: { name: "", phone: "", address: "" },
      cart: JSON.parse(localStorage.getItem(`cart_${username}`)) || [],
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
    confirmOrder() {
      if (!this.cart.length) return;

      const orders = JSON.parse(localStorage.getItem(`orders_${this.username}`)) || [];

      const newOrder = {
        id: Date.now(),
        ...this.order,
        cart: this.cart,
        total: this.totalAmount,
        date: new Date().toLocaleString(),
      };

      orders.push(newOrder);
      localStorage.setItem(`orders_${this.username}`, JSON.stringify(orders));
      localStorage.removeItem(`cart_${this.username}`);

      alert("🎉 Đơn hàng của bạn đã được thanh toán thành công!");
      this.$router.push("/orders");
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
}
</style>
