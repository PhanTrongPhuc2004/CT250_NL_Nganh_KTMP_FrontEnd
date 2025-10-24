<template> 
  <div class="orders-admin-page">
    <h1>📦 Quản lý Đơn hàng</h1>

    <!-- Bộ lọc hiển thị -->
    <div class="filter-container">
      <select v-model="filterOption" class="filter-select">
        <option value="all">📋 Tất cả đơn hàng</option>
        <option value="waiting">🟡 Xác nhận đơn</option>
        <option value="confirmed">✅ Đã xác nhận</option>
      </select>
    </div>

    <!-- Danh sách Chờ xác nhận -->
    <section v-if="filterOption === 'waiting' || filterOption === 'all'" class="order-section">
      <h2>🟡 Xác nhận đơn</h2>

      <div v-if="waitingOrders.length" class="orders-list">
        <div
          v-for="order in waitingOrders"
          :key="order._id"
          class="order-card waiting-card"
        >
          <h3>🧾 Đơn hàng #{{ order._id }}</h3>
          <p><b>Người nhận:</b> {{ order.name }}</p>
          <p><b>Điện thoại:</b> {{ order.phone }}</p>
          <p><b>Địa chỉ:</b> {{ order.address }}</p>
          <p><b>Tổng tiền:</b> {{ order.total.toLocaleString() }}₫</p>

          <div class="order-items">
            <p><b>Danh sách sản phẩm:</b></p>
            <ul>
              <li v-for="item in order.cart" :key="item.tenQuaLuuNiem">
                <img v-if="item.anhMinhHoa" :src="getImageUrl(item.anhMinhHoa)" />
                {{ item.tenQuaLuuNiem }} - {{ item.quantity }} x
                {{ item.gia.toLocaleString() }}₫
              </li>
            </ul>
          </div>

          <button class="confirm-btn" @click="xacNhan(order._id)">
            ✅ Xác nhận đơn
          </button>
        </div>
      </div>

      <p v-else>Không có đơn hàng cần xác nhận.</p>
    </section>

    <!-- Danh sách Đã xác nhận -->
    <section v-if="filterOption === 'confirmed' || filterOption === 'all'" class="order-section">
      <h2>✅ Đã xác nhận</h2>

      <div v-if="confirmedOrders.length" class="orders-list">
        <div
          v-for="order in confirmedOrders"
          :key="order._id"
          class="order-card confirmed-card"
        >
          <h3>🧾 Đơn hàng #{{ order._id }}</h3>
          <p><b>Người nhận:</b> {{ order.name }}</p>
          <p><b>Điện thoại:</b> {{ order.phone }}</p>
          <p><b>Địa chỉ:</b> {{ order.address }}</p>
          <p><b>Tổng tiền:</b> {{ order.total.toLocaleString() }}₫</p>

          <div class="order-items">
            <p><b>Danh sách sản phẩm:</b></p>
            <ul>
              <li v-for="item in order.cart" :key="item.tenQuaLuuNiem">
                <img v-if="item.anhMinhHoa" :src="getImageUrl(item.anhMinhHoa)" />
                {{ item.tenQuaLuuNiem }} - {{ item.quantity }} x
                {{ item.gia.toLocaleString() }}₫
              </li>
            </ul>
          </div>

          <button class="cancel-btn" @click="huyXacNhan(order._id)">
            🔁 Hủy xác nhận
          </button>
        </div>
      </div>

      <p v-else>Không có đơn hàng đã xác nhận.</p>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminOrders",
  data() {
    return {
      orders: [],
      filterOption: "all", // 'all', 'waiting', 'confirmed'
    };
  },
  computed: {
    waitingOrders() {
      return this.orders.filter((o) => o.status === "Chờ xác nhận");
    },
    confirmedOrders() {
      return this.orders.filter((o) => o.status === "Đã xác nhận");
    },
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await axios.get("http://localhost:5000/donhang");
        this.orders = res.data.map((o) => ({
          ...o,
          status: "Chờ xác nhận", // mặc định
        }));
      } catch (err) {
        console.error("Lỗi tải đơn hàng:", err);
      }
    },
    xacNhan(id) {
      const order = this.orders.find((o) => o._id === id);
      if (order) order.status = "Đã xác nhận";
    },
    huyXacNhan(id) {
      const order = this.orders.find((o) => o._id === id);
      if (order) order.status = "Chờ xác nhận";
    },
    getImageUrl(path) {
      return `http://localhost:3000/uploads/${path}`;
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.orders-admin-page {
  padding: 40px;
  background: #f3f4f6;
  color: #333;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 20px;
  text-align: center;
}

/* Bộ lọc hiển thị */
.filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  gap: 10px;
}

.filter-container label {
  font-weight: 600;
  color: #333;
}

.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}
.filter-select:hover {
  border-color: #007bff;
}

/* Các phần danh sách */
.order-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 25px 30px;
  margin-bottom: 40px;
}

.order-section h2 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #222;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.order-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.waiting-card {
  border-left: 6px solid #ffb300;
}
.confirmed-card {
  border-left: 6px solid #2ecc71;
}

.order-card h3 {
  font-size: 1.1rem;
  color: #111;
  margin-bottom: 8px;
}

.order-card p {
  margin: 4px 0;
  font-size: 0.95rem;
}

.order-items {
  margin-top: 10px;
  background: #fafafa;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.order-items p {
  font-weight: 600;
  margin-bottom: 6px;
}

.order-items ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.order-items li {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin: 6px 0;
}

.order-items img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* Nút hành động */
.confirm-btn,
.cancel-btn {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-weight: 600;
  color: white;
  margin-top: 14px;
  width: 100%;
}

.confirm-btn {
  background: linear-gradient(135deg, #28a745, #2ecc71);
}
.confirm-btn:hover {
  background: linear-gradient(135deg, #218838, #27ae60);
}

.cancel-btn {
  background: linear-gradient(135deg, #e53935, #f44336);
}
.cancel-btn:hover {
  background: linear-gradient(135deg, #c62828, #e53935);
}

/* Trạng thái rỗng */
.order-section > p {
  text-align: center;
  font-style: italic;
  color: #777;
  padding: 15px 0;
}
</style>
