<template>
  <div class="orders-page">
    <h1>📦 Đơn hàng của bạn</h1>

    <div v-if="loading" class="loading">⏳ Đang tải dữ liệu...</div>

    <div v-else-if="orders.length">
      <div v-for="order in orders" :key="order._id" class="order-card">
        <h3>🧾 Đơn hàng #{{ order._id.slice(-6).toUpperCase() }}</h3>
        <p><b>Người nhận:</b> {{ order.name }}</p>
        <p><b>SĐT:</b> {{ order.phone }}</p>
        <p><b>Địa chỉ:</b> {{ order.address }}</p>
        <p><b>Ngày đặt:</b> {{ formatDate(order.date) }}</p>
        <p><b>Tổng tiền:</b> {{ order.total.toLocaleString() }}₫</p>

        <details>
          <summary>📋 Chi tiết sản phẩm</summary>
          <ul>
            <li
              v-for="item in order.cart"
              :key="item.tenQuaLuuNiem"
              style="margin-bottom: 10px;"
            >
              <img
                v-if="item.anhMinhHoa"
                :src="getImageUrl(item.anhMinhHoa)"
                alt="Ảnh quà"
                style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 8px;"
              />
              {{ item.tenQuaLuuNiem }} × {{ item.quantity }} — 
              {{ (item.gia * item.quantity).toLocaleString() }}₫
            </li>
          </ul>
        </details>
      </div>
    </div>

    <p v-else>Bạn chưa có đơn hàng nào.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OrdersPage",
  data() {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.tenDangNhap || "guest";
    return {
      username,
      orders: [],
      loading: true,
    };
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await axios.get(`http://localhost:5000/donhang/${this.username}`);
        this.orders = res.data;
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
        alert("Không thể tải dữ liệu đơn hàng!");
      } finally {
        this.loading = false;
      }
    },

    // ✅ Hàm xử lý ảnh linh hoạt
    getImageUrl(path) {
      if (!path) return "https://via.placeholder.com/100x100?text=No+Image"; // ảnh mặc định
      if (path.startsWith("http") || path.startsWith("data:image")) return path;
      return `/${path}`; // ảnh từ public/data
    },

    formatDate(date) {
      if (!date) return "Không rõ";
      const d = new Date(date);
      return d.toLocaleString("vi-VN");
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>


<style scoped>
.orders-page {
  background: linear-gradient(135deg, #e0eafc, #cfdef3); /* xanh nhạt nhẹ nhàng */
  color: #2c3e50; /* chữ xanh xám nghiêm túc */
  padding: 40px;
  min-height: 100vh;
}

.order-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdde1;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 30px;
  color: #34495e;
}
</style>

