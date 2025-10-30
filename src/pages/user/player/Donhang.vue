<template>
  <div class="orders-page">
    <h1>Đơn hàng của bạn</h1>

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
                :src="resolveImage(item.anhMinhHoa)"
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
import { useUserStore } from "@/stores/userStore";

export default {
  name: "OrdersPage",
  data() {
    const userStore = useUserStore();
    let user = userStore.user;

    // Nếu Pinia chưa có user (reload trang)
    if (!user) {
      user = JSON.parse(localStorage.getItem("user"));
    }

    return {
      user,
      orders: [],
      loading: true,
    };
  },

  async mounted() {
    const userStore = useUserStore();

    // Nếu chưa có user trong Pinia → kiểm tra lại session
    if (!userStore.user) {
      if (userStore.checkAuth) {
        await userStore.checkAuth();
      }
      this.user = userStore.user || JSON.parse(localStorage.getItem("user"));
    }

    await this.fetchOrders();
  },

  methods: {
    async fetchOrders() {
      console.log("📦 USER object:", this.user);

      const username = this.user?.tenDangNhap || this.user?.username;
      console.log("🔑 Username dùng để fetch:", username);

      if (!username) {
        this.loading = false;
        alert("⚠️ Vui lòng đăng nhập để xem đơn hàng của bạn!");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/donhang/${username}`);
        console.log("📦 Dữ liệu đơn hàng nhận được:", res.data);

        this.orders = res.data;
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
        alert("Không thể tải dữ liệu đơn hàng!");
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    // ✅ Hàm xử lý hiển thị ảnh linh hoạt
    resolveImage(anh) {
      if (!anh) return "/default-player.jpg"; // ảnh mặc định
      if (anh.startsWith("http") || anh.startsWith("data:image")) return anh;
      return anh; // nếu là đường dẫn /data/... thì Vue sẽ tự lấy từ public/
    },
  },
};
</script>

<style scoped>
.orders-page {
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
  color: #2c3e50;
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
