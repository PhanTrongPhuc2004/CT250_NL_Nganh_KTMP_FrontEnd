<template>
  <div class="cart-page">
    <h1> Giỏ hàng của bạn</h1>

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
  padding: 50px 30px;
  background: linear-gradient(135deg, #f0f2f5, #e8ecf1);
  color: #333;
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
}

.cart-page h1 {

  font-size: 2.2rem;
  font-weight: 700;
  color: #2e3b55;
  margin-bottom: 40px;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.cart-table th {
  background: #4e73df;
  color: white;
  padding: 14px;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cart-table td {
  border-bottom: 1px solid #ddd;
  padding: 14px;
  text-align: center;
  font-size: 1rem;
  color: #444;
}

.cart-table tr:last-child td {
  border-bottom: none;
}

.cart-table tr:hover {
  background: #f8f9fc;
  transition: 0.2s ease;
}

.total {
  text-align: right;
  font-size: 1.3rem;
  color: #2e3b55;
  font-weight: 700;
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
}

.checkout-btn {
  background: linear-gradient(90deg, #1cc88a, #4e73df);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.25s ease;
}

.checkout-btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.clear-btn {
  background: #e74a3b;
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s ease;
}

.clear-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>

