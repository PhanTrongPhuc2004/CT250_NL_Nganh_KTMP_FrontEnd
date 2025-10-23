<template>
  <div class="cart-page">
    <h1>🛒 Giỏ hàng của bạn</h1>

    <div v-if="cart.length">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="item._id">
            <td>{{ item.tenQuaLuuNiem }}</td>
            <td>{{ item.gia.toLocaleString() }}₫</td>
            <td>{{ item.quantity }}</td>
            <td>{{ (item.gia * item.quantity).toLocaleString() }}₫</td>
            <td>
              <button class="delete-btn" @click="removeItem(index)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="total">Tổng cộng: {{ totalAmount.toLocaleString() }}₫</h3>

      <div class="action-buttons">
        <button class="clear-btn" @click="clearCart">🧹 Xóa giỏ hàng</button>
        <button class="checkout-btn" @click="goToCheckout">💳 Thanh toán</button>
      </div>
    </div>

    <p v-else>Giỏ hàng của bạn đang trống.</p>
  </div>
</template>

<script>
export default {
  name: "CartPage",
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.tenDangNhap || "guest";
    return {
      username,
      cart: JSON.parse(localStorage.getItem(`cart_${username}`)) || [],
    };
  },
  computed: {
    totalAmount() {
      return this.cart.reduce((sum, item) => sum + item.gia * item.quantity, 0);
    },
  },
  methods: {
    saveCart() {
      localStorage.setItem(`cart_${this.username}`, JSON.stringify(this.cart));
    },
    removeItem(index) {
      this.cart.splice(index, 1);
      this.saveCart();
    },
    clearCart() {
      if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
        this.cart = [];
        localStorage.removeItem(`cart_${this.username}`);
      }
    },
    goToCheckout() {
      if (!this.cart.length) return alert("Giỏ hàng trống!");
      this.$router.push("/checkout");
    },
  },
};
</script>

<style scoped>
.cart-page {
  padding: 40px;
  background: linear-gradient(135deg, #42275a, #734b6d);
  color: white;
  min-height: 100vh;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.cart-table th, .cart-table td {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
.total {
  text-align: right;
  font-size: 1.3rem;
  color: #ffe57f;
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.checkout-btn {
  background: linear-gradient(90deg, #00c853, #b2ff59);
  border: none;
  color: black;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
.clear-btn {
  background: #ff5252;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
