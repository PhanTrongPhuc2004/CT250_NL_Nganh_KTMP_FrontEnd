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
          <tr v-for="item in cart" :key="item._id">
            <td>
              <img
                :src="item.anhMinhHoa?.startsWith('http') ? item.anhMinhHoa : `/${item.anhMinhHoa}`"
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

    <!-- Form thanh toán -->
    <form v-if="cart.length" @submit.prevent="confirmOrder" class="checkout-form">
      <label>Họ và tên người nhận:</label>
      <input type="text" v-model="order.name" required />

      <label>Số điện thoại:</label>
      <input
        type="tel"
        v-model="order.phone"
        required
        pattern="^(0[3|5|7|8|9])[0-9]{8}$"
        @input="validatePhone"
      />
      <p v-if="phoneError" style="color:red; font-size:14px; margin-top:4px;">
        ⚠ Số điện thoại không hợp lệ (phải 10 số, bắt đầu bằng 03/05/07/08/09)
      </p>

      <label>Địa chỉ giao hàng:</label>
      <textarea v-model="order.address" required></textarea>

      <!--  Tổng tiền + Voucher -->
      <div class="voucher-box mt-3 p-3 border rounded bg-light">
        <p><strong>Tổng ban đầu:</strong> {{ totalAmount.toLocaleString() }} VND</p>

        <p v-if="discount > 0" class="text-success fw-bold">
          Giảm giá: -{{ discount.toLocaleString() }} VND
        </p>

        <p class="fs-4 fw-bold text-danger">
          Tổng thanh toán: {{ finalAmount.toLocaleString() }} VND
        </p>
      </div>

      <!--  Phương thức thanh toán -->
      <label>Phương thức thanh toán:</label>
      <div class="payment-methods">
        <label class="pm-item">
          <input type="radio" value="cash" v-model="order.paymentMethod" />
          Thanh toán trực tiếp
        </label>

        <label class="pm-item">
          <input type="radio" value="bank" v-model="order.paymentMethod" />
          Chuyển khoản ngân hàng
        </label>

        <!--  QR VietQR động -->
        <div v-if="order.paymentMethod === 'bank'" class="mt-2">
          <div class="card p-3 text-center shadow-sm" style="max-width: 300px;">
            <img
              :src="vietQrUrl"
              class="img-fluid rounded"
              alt="QR VietQR"
            />
            <p class="mt-2 fw-semibold">
              Quét mã VietQR để chuyển khoản
            </p>
          </div>
        </div>
      </div>

      <!--  Nút thanh toán chỉ hiển thị khi điền đủ thông tin -->
      <button
        v-if="isFormValid"
        type="submit"
        class="btn btn-success w-100 mt-3"
        :disabled="loading"
      >
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
      cart: [],
      tenDangNhap: "guest",
      loading: false,
      order: {
        name: "",
        phone: "",
        address: "",
        paymentMethod: "cash",
      },
      phoneError: false,
      vouchers: [
        { code: "VOUCHER30K", label: "Giảm 30.000₫", min: 250000, type: "fixed", amount: 30000 },
        { code: "VOUCHER50K", label: "Giảm 50.000₫", min: 500000, type: "fixed", amount: 50000 },
        { code: "VOUCHER15P", label: "Giảm 15%", min: 1000000, type: "percent", amount: 15 },
      ],
    };
  },

  computed: {
    totalAmount() {
      return this.cart.reduce((sum, item) => sum + item.gia * item.soLuong, 0);
    },

    bestVoucher() {
      const total = this.totalAmount;
      const valid = this.vouchers.filter(v => total >= v.min);
      if (!valid.length) return null;

      return valid.reduce((best, v) => {
        const discountV = v.type === "fixed" ? v.amount : Math.floor(total * v.amount / 100);
        const discountBest = best.type === "fixed" ? best.amount : Math.floor(total * best.amount / 100);
        return discountV > discountBest ? v : best;
      });
    },

    discount() {
      if (!this.bestVoucher) return 0;
      return this.bestVoucher.type === "fixed"
        ? this.bestVoucher.amount
        : Math.floor(this.totalAmount * this.bestVoucher.amount / 100);
    },

    finalAmount() {
      return Math.max(this.totalAmount - this.discount, 0);
    },

    vietQrUrl() {
      if (!this.finalAmount || this.finalAmount <= 0 || !this.order.phone || !this.order.name) return "";

      const bankCode = "vcb";             // Vietcombank
      const accountNumber = "1030670478"; // giữ nguyên tài khoản
      const accountName = "NGUYEN THIEN PHUC"; // giữ nguyên tên chủ TK

      // Nội dung chuyển khoản gồm tên + số điện thoại người nhận
      const transferInfo = `${this.order.name} - ${this.order.phone}`;

      const encodedInfo = encodeURIComponent(transferInfo);

      return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${this.finalAmount}&addInfo=${encodedInfo}&accountName=${encodeURIComponent(accountName)}`;
    },



    // Kiểm tra form đã điền đầy đủ
    isFormValid() {
      return this.order.name && this.order.phone && this.order.address;
    },
  },

  mounted() {
    const store = useUserStore();
    this.tenDangNhap = store.user?.tenDangNhap || "guest";

    let cart = JSON.parse(localStorage.getItem(`cart_${this.tenDangNhap}`)) || [];
    if (!cart.length) cart = JSON.parse(localStorage.getItem("cart_guest")) || [];

    this.cart = cart.map(item => ({
      _id: item._id,
      tenQuaLuuNiem: item.tenQuaLuuNiem,
      gia: Number(item.gia),
      soLuong: Number(item.soLuong ?? item.quantity ?? 1),
      anhMinhHoa: item.anhMinhHoa,
    }));

    if (!this.cart.length) {
      alert("Giỏ hàng trống!");
      this.$router.push("/cart");
    }
  },

  methods: {
    async confirmOrder() {
      this.loading = true;

      const normalizedCart = this.cart.map(item => ({
        _id: item._id,
        tenQuaLuuNiem: item.tenQuaLuuNiem,
        gia: item.gia,
        quantity: item.soLuong,
        anhMinhHoa: item.anhMinhHoa,
      }));

      const payload = {
        tenDangNhap: this.tenDangNhap,
        ...this.order,
        cart: normalizedCart,
        total: this.finalAmount,
        discount: this.discount,
        appliedVoucher: this.bestVoucher?.code || null,
        date: new Date(),
      };

      try {
        await axios.post(`${import.meta.env.VITE_API_BE_BASE_URL}/donhang`, payload);

        localStorage.removeItem(`cart_${this.tenDangNhap}`);
        localStorage.removeItem("cart_guest");

        alert("🎉 Đặt hàng thành công!");
        this.$router.push("/orders");
      } catch (err) {
        console.error(err);
        alert("Lỗi thanh toán!");
      } finally {
        this.loading = false;
      }
    },
      validatePhone() {
        const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        this.phoneError = !regex.test(this.order.phone);
      },
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
  width: 80%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto 30px auto; /* Căn giữa bảng */
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
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: -5px;
}

.pm-item {
  background: #f6f7fb;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d6d8e0;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.pm-item:hover {
  background: #eef1f7;
  border-color: #4e73df;
}
.card img {
  border-radius: 12px;
}

</style>
