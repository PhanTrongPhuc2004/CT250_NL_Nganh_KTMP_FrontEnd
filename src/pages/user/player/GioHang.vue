<template>
  <div class="cart-page">
    <h1>Giỏ hàng của bạn</h1>

    <div v-if="cart.length">
      <!-- TABLE -->
      <table class="cart-table table table-bordered align-middle">
        <thead class="table-light">
          <tr>
            <th>Hình ảnh</th>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in cart" :key="item._id">
            <td>
              <img
                :src="item.anhMinhHoa.startsWith('http') ? item.anhMinhHoa : `/${item.anhMinhHoa}`"
                alt=""
                class="cart-item-img"
              />
            </td>

            <td>{{ item.tenQuaLuuNiem }}</td>
            <td>{{ item.gia.toLocaleString() }} VND</td>
            <td>{{ item.quantity }}</td>
            <td>{{ (item.gia * item.quantity).toLocaleString() }} VND</td>

            <td>
              <button class="btn btn-danger btn-sm" @click="removeItem(index)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- TỔNG TIỀN -->
      <h3 class="total">
        Tổng cộng: {{ totalAmount.toLocaleString() }} VND
      </h3>

      <!-- AUTO VOUCHER -->
      <div class="voucher-auto mt-3 p-3 border rounded bg-light">
        <h5>
          <i class="bi bi-ticket-perforated text-danger"></i>
          Voucher:
        </h5>

        <p v-if="bestVoucher" class="text-success fw-bold">
          ✔ Áp dụng: {{ bestVoucher.label }}  
          <br />
          <span class="small text-dark">{{ bestVoucher.info }}</span>
        </p>

        <p v-else class="text-muted">
          Không có voucher phù hợp với đơn hàng.
        </p>
      </div>

      <!-- GIẢM GIÁ -->
      <div v-if="discountAmount > 0" class="text-success fw-bold mt-2">
        Giảm giá: -{{ discountAmount.toLocaleString() }} VND
      </div>

      <!-- THÀNH TIỀN -->
      <h3 class="mt-2 text-primary fw-bold">
        Thành tiền: {{ finalAmount.toLocaleString() }} VND
      </h3>

      <!-- BUTTONS -->
      <div class="action-buttons mt-4">
        <button class="btn btn-outline-danger me-2" @click="clearCart">
          <i class="bi bi-trash me-1"></i> Xóa giỏ hàng
        </button>

        <button class="btn btn-success" @click="goToCheckout">
          <i class="bi bi-credit-card me-1"></i> Thanh toán
        </button>
      </div>
    </div>

    <p v-else>Giỏ hàng của bạn đang trống.</p>

    <button class="btn btn-outline-primary" @click="$router.push('/shop')">
      <i class="bi bi-arrow-left-circle me-1"></i> Tiếp tục mua hàng
    </button>
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

      vouchers: [
        {
          code: "VOUCHER30K",
          label: "Giảm 30.000₫",
          min: 250000,
          type: "fixed",
          amount: 30000,
          info: "Áp dụng cho đơn từ 250.000₫",
        },
        {
          code: "VOUCHER50K",
          label: "Giảm 50.000₫",
          min: 500000,
          type: "fixed",
          amount: 50000,
          info: "Áp dụng cho đơn từ 500.000₫",
        },
        {
          code: "VOUCHER15P",
          label: "Giảm 15%",
          min: 1000000,
          type: "percent",
          amount: 15,
          info: "Áp dụng cho đơn từ 1.000.000₫",
        },
      ],
    };
  },

  computed: {
    totalAmount() {
      return this.cart.reduce(
        (sum, item) => sum + item.gia * item.quantity,
        0
      );
    },

    // 👉 Tự tìm voucher tốt nhất
    bestVoucher() {
      const total = this.totalAmount;

      // Lọc voucher đủ điều kiện
      const valid = this.vouchers.filter((v) => total >= v.min);

      if (!valid.length) return null;

      // Tính số tiền giảm của từng voucher
      const calcDiscount = (v) =>
        v.type === "fixed"
          ? v.amount
          : Math.floor((total * v.amount) / 100);

      // Trả về voucher giảm nhiều nhất
      return valid.reduce((best, v) =>
        calcDiscount(v) > calcDiscount(best) ? v : best
      );
    },

    discountAmount() {
      if (!this.bestVoucher) return 0;

      const v = this.bestVoucher;

      if (v.type === "fixed") return v.amount;

      return Math.floor((this.totalAmount * v.amount) / 100);
    },

    finalAmount() {
      return Math.max(this.totalAmount - this.discountAmount, 0);
    },
  },

  methods: {
    saveCart() {
      localStorage.setItem(
        `cart_${this.username}`,
        JSON.stringify(this.cart)
      );
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
      if (!this.cart.length) {
        alert("Giỏ hàng trống!");
        return;
      }

      this.$router.push("/checkout");
    },
  },
};
</script>

<style scoped>
.cart-page {
  width: 80%;
   margin: 0 auto 30px auto; /* Căn giữa bảng */
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
.back-btn {
  background: linear-gradient(90deg, #36b9cc, #4e73df);
  color: white;
  border: none;
  padding: 12px 26px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  box-shadow: 0 4px 10px rgba(78, 115, 223, 0.2);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(78, 115, 223, 0.3);
  opacity: 0.95;
}
.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}


</style>

