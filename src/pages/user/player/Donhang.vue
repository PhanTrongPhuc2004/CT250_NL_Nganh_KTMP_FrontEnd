<template>
  <div class="orders-page">
    <h1 class="orders-title mb-4">
      <i class="bi bi-box-seam-fill me-2"></i> Đơn hàng của bạn
    </h1>

    <div v-if="loading" class="loading">⏳ Đang tải dữ liệu...</div>

    <div v-else-if="orders.length">
      <div
        v-for="order in orders"
        :key="order._id"
        class="order-card mb-4 p-3 border rounded"
        :class="{
          'confirmed-card': order.status === 'Đã xác nhận',
          'waiting-card': order.status === 'Chờ xác nhận'
        }"
      >
        <!-- Tiêu đề hóa đơn -->
        <div class="invoice-header text-center mb-3">
          <h3 class="text-primary fw-bold">THÔNG TIN ĐƠN HÀNG</h3>
          <p class="text-muted">Mã đơn hàng: <b>#{{ order._id.slice(-6).toUpperCase() }}</b></p>
        </div>

        <!-- Thông tin người nhận -->
        <div class="invoice-info mb-3">
          <p><b>Người nhận:</b> {{ order.name }}</p>
          <p><b>SĐT:</b> {{ order.phone }}</p>
          <p><b>Địa chỉ:</b> {{ order.address }}</p>
          <p><b>Ngày đặt:</b> {{ formatDate(order.date || order.createdAt) }}</p>
        </div>

        <!-- Danh sách sản phẩm -->
        <table class="table table-bordered mt-3">
          <thead class="table-light">
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá (VND)</th>
              <th>Thành tiền (VND)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.cart" :key="item._id || item.maSanPham">
              <td>
                <img
                  v-if="item.anhMinhHoa"
                  :src="resolveImage(item.anhMinhHoa)"
                  alt="Ảnh quà"
                  class="item-img me-2"
                  style="width:50px; height:50px; object-fit:cover; border-radius:6px;"
                />
                {{ item.tenQuaLuuNiem }}
              </td>
              <td>{{ item.soLuong }}</td>
              <td>{{ item.gia.toLocaleString() }}</td>
              <td>{{ (item.gia * item.soLuong).toLocaleString() }}</td>
            </tr>
            <tr v-if="order.cart.length === 0">
              <td colspan="4" class="text-center text-muted">Chưa có sản phẩm</td>
            </tr>
          </tbody>
        </table>

        <!-- Tổng tiền + QR -->
        <div class="total-section d-flex align-items-center justify-content-between mt-3">
          <div>
            <b>Tổng cộng:</b>
            <span class="text-danger fw-bold fs-5">{{ order.total.toLocaleString() }} VND</span>
          </div>
          <div>
            <img
              :src="generateQR(order)"
              alt="QR Code"
              class="qr-code"
              style="width:120px; height:120px;"
            />
          </div>
        </div>

        <!-- Trạng thái -->
        <div class="status-section mt-3">
          <b>Trạng thái:</b>
          <span
            class="badge"
            :class="order.status === 'Đã xác nhận' ? 'bg-success' : 'bg-warning text-dark'"
          >
            {{ order.status }}
          </span>
        </div>

                <!-- Nút xóa đơn hàng -->
        <!-- Nút xóa đơn hàng (chỉ hiển thị khi chưa xác nhận) -->
        <div class="mt-3 text-end" v-if="order.status === 'Chờ xác nhận'">
          <button
            class="btn btn-danger btn-sm"
            @click="deleteOrder(order._id)"
          >
            <i class="bi bi-trash3 me-1"></i> Hủy đơn hàng
          </button>
        </div>

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
        alert("⚠️ Vui lòng đăng nhập để xem đơn hàng!");
        return;
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang/${username}`
        );
        this.orders = res.data.map(order => {
          const cart = order.cart.map(item => ({
            ...item,
            soLuong: Number(item.soLuong ?? item.quantity ?? 1),
            gia: Number(item.gia ?? 0)
          }));
          const total = cart.reduce((sum, i) => sum + i.gia * i.soLuong, 0);
          return { ...order, cart, total };
        });
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
        alert("Không thể tải dữ liệu đơn hàng!");
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(id) {
      if (confirm("Bạn có chắc muốn xóa hoàn toàn đơn hàng này?")) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BE_BASE_URL}/donhang/${id}`);
          alert("🗑️ Đơn hàng đã được xóa!");
          this.orders = this.orders.filter(order => order._id !== id); // Xóa ngay khỏi state
        } catch (err) {
          console.error("❌ Lỗi khi xóa đơn hàng:", err);
          alert("Không thể xóa đơn hàng!");
        }
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

    generateQR(order) {
      const data = encodeURIComponent(`
Mã đơn: ${order._id}
Người nhận: ${order.name}
Tổng tiền: ${order.total.toLocaleString()} VND
Trạng thái: ${order.status}
Sản phẩm: ${order.cart.map(i => `${i.tenQuaLuuNiem} x${i.soLuong}`).join(", ")}
      `);
      return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${data}`;
    },
  },
};
</script>

<style scoped>
.orders-title{
  color: #8B2C31;
  font-weight: 700;
}
.orders-title i {
  color: #8B2C31;
}
.orders-page {
  padding: 20px;
  font-family: "Poppins", sans-serif;
}

.order-card {
  background: #f8f9fa;
}

.item-img {
  vertical-align: middle;
}
</style>
