<template>
  <div class="orders-admin-page">
    <h1>Quản lý Đơn hàng</h1>

    <!-- Bộ lọc và công cụ -->
      <div class="toolbar d-flex flex-wrap align-items-center gap-2 mb-3">
        <!-- Bộ lọc trạng thái -->
        <div class="filter-group">
          <select v-model="filterOption" class="form-select">
            <option value="all">
              <i class="bi bi-list-task me-1"></i> Tất cả
            </option>
            <option value="waiting">
              <i class="bi bi-hourglass-split me-1 text-warning"></i> Chờ xác nhận
            </option>
            <option value="confirmed">
              <i class="bi bi-check-circle text-success me-1"></i> Đã xác nhận
            </option>
          </select>
        </div>

        <!-- Ô tìm kiếm -->
        <div class="position-relative flex-grow-1" style="max-width: 320px">
          <i
            class="bi bi-search position-absolute top-50 start-0 translate-middle-y text-muted ms-2"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo mã hoặc tên người nhận..."
            class="form-control ps-5"
          />
        </div>

        <!-- Sắp xếp -->
        <div class="sort-group">
          <select v-model="sortOption" class="form-select" style="max-width: 220px">
            <option value="newest">
              <i class="bi bi-clock-history me-1"></i> Ngày đặt mới nhất
            </option>
            <option value="oldest">
              <i class="bi bi-calendar-week me-1"></i> Ngày đặt cũ nhất
            </option>
            <option value="totalAsc">
              <i class="bi bi-sort-up me-1"></i> Tổng tiền tăng dần
            </option>
            <option value="totalDesc">
              <i class="bi bi-sort-down me-1"></i> Tổng tiền giảm dần
            </option>
          </select>
        </div>
      </div>


    <!-- Loading -->
    <div v-if="loading" class="loading">⏳ Đang tải đơn hàng...</div>

    <!-- Danh sách đơn hàng (sau khi lọc + sắp xếp) -->
    <section v-else class="order-section">
      <div v-if="filteredAndSortedOrders.length" class="orders-list">
        <div
          v-for="order in filteredAndSortedOrders"
          :key="order._id"
          class="order-card"
          :class="order.status === 'Đã xác nhận' ? 'confirmed-card' : 'waiting-card'"
        >
          <h3>
            🧾 Đơn hàng #{{ order._id.slice(-6).toUpperCase() }}
          </h3>
          <p><b>Tài khoản đặt hàng:</b> {{ order.tenDangNhap }}</p>
          <p><b>Người nhận:</b> {{ order.name }}</p>
          <p><b>Điện thoại:</b> {{ order.phone }}</p>
          <p><b>Địa chỉ:</b> {{ order.address }}</p>
          <p><b>Ngày đặt:</b> {{ formatDate(order.createdAt) }}</p>
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

          <button
            v-if="order.status === 'Chờ xác nhận'"
            class="confirm-btn"
            @click="xacNhan(order._id)"
          >
            Chờ nhận đơn
          </button>
          <button
            v-else
            class="cancel-btn"
            @click="huyXacNhan(order._id)"
          >
            Đã xác nhận
          </button>
        </div>
      </div>

      <p v-else>Không có đơn hàng phù hợp.</p>
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
      filterOption: "all",
      searchQuery: "",
      sortOption: "newest",
      loading: false,
    };
  },
  computed: {
    filteredAndSortedOrders() {
      let filtered = this.orders;

      // Lọc theo trạng thái
      if (this.filterOption === "waiting") {
        filtered = filtered.filter((o) => o.status === "Chờ xác nhận");
      } else if (this.filterOption === "confirmed") {
        filtered = filtered.filter((o) => o.status === "Đã xác nhận");
      }

      // Lọc theo từ khóa tìm kiếm
      if (this.searchQuery.trim() !== "") {
        const query = this.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (o) =>
            o._id.toLowerCase().includes(query) ||
            (o.name && o.name.toLowerCase().includes(query))
        );
      }

      // Sắp xếp
      switch (this.sortOption) {
        case "newest":
          filtered = [...filtered].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "oldest":
          filtered = [...filtered].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
        case "totalAsc":
          filtered = [...filtered].sort((a, b) => a.total - b.total);
          break;
        case "totalDesc":
          filtered = [...filtered].sort((a, b) => b.total - a.total);
          break;
      }

      return filtered;
    },
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang`
        );
        this.orders = res.data;
      } catch (err) {
        console.error("Lỗi tải đơn hàng:", err);
      } finally {
        this.loading = false;
      }
    },

    async xacNhan(id) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang/${id}`,
          { status: "Đã xác nhận" }
        );
        this.fetchOrders();
      } catch (err) {
        console.error("Lỗi khi xác nhận đơn:", err);
      }
    },

    async huyXacNhan(id) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang/${id}`,
          { status: "Chờ xác nhận" }
        );
        this.fetchOrders();
      } catch (err) {
        console.error("Lỗi khi hủy xác nhận:", err);
      }
    },

    getImageUrl(path) {
      if (!path || path.trim() === "") {
        return "https://via.placeholder.com/100x100?text=No+Image";
      }
      if (path.startsWith("http") || path.startsWith("data:image")) return path;
      return `/${path}`;
    },

    formatDate(dateStr) {
      if (!dateStr) return "—";
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN");
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
}

/* Bộ công cụ */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 30px;
}

.filter-select,
.sort-select,
.search-input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 1rem;
  transition: 0.3s;
}

.filter-select:hover,
.sort-select:hover,
.search-input:focus {
  border-color: #007bff;
}

.search-input {
  flex: 1;
  min-width: 240px;
}

/* Các phần danh sách */
.order-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 25px 30px;
  margin-bottom: 40px;
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
  border: 1px solid #eee;
  transition: all 0.3s ease;
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

.order-items {
  margin-top: 10px;
  background: #fafafa;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.order-items li {
  display: flex;
  align-items: center;
  margin: 6px 0;
  font-size: 0.9rem;
}

.order-items img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* Nút */
.confirm-btn,
.cancel-btn {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
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

.loading {
  text-align: center;
  font-style: italic;
  color: #555;
  padding: 20px;
}
</style>
