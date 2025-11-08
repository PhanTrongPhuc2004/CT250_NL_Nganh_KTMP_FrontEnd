<template>
  <div class="orders-page">
    <h1>Đơn hàng của bạn</h1>

    <div v-if="loading" class="loading">⏳ Đang tải dữ liệu...</div>

    <div v-else-if="orders.length">
      <div
        v-for="order in orders"
        :key="order._id"
        class="order-card"
        :class="{
          'confirmed-card': order.status === 'Đã xác nhận',
          'waiting-card': order.status === 'Chờ xác nhận'
        }"
      >
        <h3 class="text-info fw-bold my-3">
          <i class="bi bi-box-seam-fill me-2"></i>
          Đơn hàng #{{ order._id.slice(-6).toUpperCase() }}
        </h3>

        <p><b>Người nhận:</b> {{ order.name }}</p>
        <p><b>SĐT:</b> {{ order.phone }}</p>
        <p><b>Địa chỉ:</b> {{ order.address }}</p>
        <p><b>Ngày đặt:</b> {{ formatDate(order.date || order.createdAt) }}</p>
        <p><b>Tổng tiền:</b> {{ order.total.toLocaleString() }} VND</p>

        <!-- Trạng thái -->
        <div class="status-section my-2">
          <p>
            <b>Trạng thái:</b>
            <span
              class="badge"
              :class="order.status === 'Đã xác nhận' ? 'bg-success' : 'bg-warning text-dark'"
            >
              {{ order.status }}
            </span>
          </p>
        </div>

        <!-- Nút thao tác (demo đồng bộ) -->
        <!-- <div class="status-buttons d-flex gap-2">
          <button
            class="btn btn-warning"
            :disabled="order.status === 'Chờ xác nhận'"
            @click="updateStatus(order._id, 'Chờ xác nhận')"
          >
            Chờ xác nhận
          </button>
          <button
            class="btn btn-success"
            :disabled="order.status === 'Đã xác nhận'"
            @click="updateStatus(order._id, 'Đã xác nhận')"
          >
            Đã xác nhận
          </button>
        </div> -->

        <details class="mt-3">
          <summary>📋 Chi tiết sản phẩm</summary>
          <ul>
            <li
              v-for="item in order.cart"
              :key="item.tenQuaLuuNiem"
              class="order-item"
            >
              <img
                v-if="item.anhMinhHoa"
                :src="resolveImage(item.anhMinhHoa)"
                alt="Ảnh quà"
              />
              {{ item.tenQuaLuuNiem }} × {{ item.quantity }} — 
              {{ (item.gia * item.quantity).toLocaleString() }} VND
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
    let user = userStore.user || JSON.parse(localStorage.getItem("user"));
    return {
      user,
      orders: [],
      loading: true,
    };
  },

  async mounted() {
    const userStore = useUserStore();
    if (!userStore.user && userStore.checkAuth) {
      await userStore.checkAuth();
      this.user = userStore.user || JSON.parse(localStorage.getItem("user"));
    }
    await this.fetchOrders();
  },

  methods: {
    async fetchOrders() {
      const username = this.user?.tenDangNhap || this.user?.username;
      if (!username) {
        this.loading = false;
        alert("⚠️ Vui lòng đăng nhập để xem đơn hàng của bạn!");
        return;
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang/${username}`
        );
        this.orders = res.data;
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
        alert("Không thể tải dữ liệu đơn hàng!");
      } finally {
        this.loading = false;
      }
    },

    // ✅ Cập nhật trạng thái đơn hàng (đồng bộ với admin)
    async updateStatus(id, newStatus) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang/${id}`,
          { status: newStatus }
        );
        this.fetchOrders();
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật trạng thái:", err);
        alert("Không thể cập nhật trạng thái đơn hàng!");
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

    resolveImage(anh) {
      if (!anh) return "/default-player.jpg";
      if (anh.startsWith("http") || anh.startsWith("data:image")) return anh;
      return anh;
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
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdde1;
  transition: 0.3s;
}

.order-card:hover {
  transform: translateY(-4px);
}

.waiting-card {
  border-left: 6px solid #f1c40f;
}
.confirmed-card {
  border-left: 6px solid #2ecc71;
}

.order-item {
  margin: 6px 0;
  display: flex;
  align-items: center;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
}

.status-buttons button {
  flex: 1;
  font-weight: 600;
  border-radius: 10px;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 30px;
  color: #34495e;
}
</style>
