<template>
  <div class="contracts-page">
    <h1>Danh sách hợp đồng cầu thủ</h1>

    <div v-if="loading" class="loading">⏳ Đang tải dữ liệu...</div>

    <div v-else-if="hopDongs.length">
      <table class="contracts-table">
        <thead>
          <tr>
            <th>Mã HĐ</th>
            <th>Tên cầu thủ</th>
            <th>Vị trí</th>
            <th>CLB thuê</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Người quản lý</th>
            <th>Chi tiết</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="hd in hopDongs" :key="hd._id">
            <td>{{ hd.maHopDong }}</td>
            <td>{{ hd.tenCauThu }}</td>
            <td>{{ hd.viTriCauThu }}</td>
            <td>{{ hd.tenCLBThue }}</td>
            <td>{{ formatDate(hd.ngayBatDau) }}</td>
            <td>{{ formatDate(hd.ngayKetThuc) }}</td>
            <td :class="statusClass(hd.trangThai)">{{ hd.trangThai }}</td>
            <td>{{ hd.nguoiDaiDien }}</td>
            <td>
              <button class="btn-detail" @click="xemChiTiet(hd)">Xem</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>Không có hợp đồng nào.</p>

    <!-- Hộp chi tiết hợp đồng -->
    <div v-if="selectedHopDong" class="modal">
      <div class="modal-content">
        <h2>Chi tiết hợp đồng {{ selectedHopDong.maHopDong }}</h2>
        <p><b>Tên cầu thủ:</b> {{ selectedHopDong.tenCauThu }}</p>
        <p><b>Quốc tịch:</b> {{ selectedHopDong.quocTichCauThu }}</p>
        <p><b>Vị trí:</b> {{ selectedHopDong.viTriCauThu }}</p>
        <p><b>CLB thuê:</b> {{ selectedHopDong.tenCLBThue }}</p>
        <p><b>CLB chủ quản:</b> {{ selectedHopDong.tenCLBChuQuan || "Không có" }}</p>
        <p><b>Thời hạn:</b> 
          {{ formatDate(selectedHopDong.ngayBatDau) }} → 
          {{ formatDate(selectedHopDong.ngayKetThuc) }}
        </p>
        <p><b>Phí thuê:</b> {{ formatMoney(selectedHopDong.phiThue) }}</p>
        <p><b>Lương:</b> {{ formatMoney(selectedHopDong.luongCauThu) }}</p>
        <p><b>Tiền thưởng:</b> {{ formatMoney(selectedHopDong.tienThuong) }}</p>
        <p><b>Điều khoản:</b> {{ selectedHopDong.dieuKhoan }}</p>
        <p><b>Người đại diện:</b> {{ selectedHopDong.nguoiDaiDien }}</p>
        <p><b>Trạng thái:</b> {{ selectedHopDong.trangThai }}</p>

        <button class="btn-close" @click="selectedHopDong = null">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HopDongList",
  data() {
    return {
      hopDongs: [],
      loading: true,
      selectedHopDong: null,
    };
  },
  async mounted() {
    await this.fetchHopDongs();
  },
  methods: {
    async fetchHopDongs() {
      try {
        const res = await axios.get("http://localhost:5000/hopdong");
        this.hopDongs = res.data;
      } catch (err) {
        console.error("❌ Lỗi tải hợp đồng:", err);
        alert("Không thể tải dữ liệu hợp đồng!");
      } finally {
        this.loading = false;
      }
    },
    xemChiTiet(hd) {
      this.selectedHopDong = hd;
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    formatMoney(num) {
      return num?.toLocaleString("vi-VN") + "₫";
    },
    statusClass(status) {
      return {
        "status-active": status === "Đang hiệu lực",
        "status-expired": status === "Hết hạn",
        "status-pending": status === "Chưa ký",
      };
    },
  },
};
</script>

<style scoped>
.contracts-page {
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
  color: #2c3e50;
  padding: 40px;
  min-height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.contracts-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contracts-table th,
.contracts-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.contracts-table th {
  background-color: #2c3e50;
  color: #fff;
}

.btn-detail {
  background-color: #3498db;
  border: none;
  color: white;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-detail:hover {
  background-color: #2980b9;
}

.status-active {
  color: green;
  font-weight: bold;
}

.status-expired {
  color: red;
  font-weight: bold;
}

.status-pending {
  color: orange;
  font-weight: bold;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 30px;
  color: #34495e;
}

/* Modal chi tiết */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-close {
  background: linear-gradient(135deg, #ff4e50, #f13c3c); /* đỏ gradient đẹp */
  color: #fff;
  border: none;
  width: 40px;
  margin-bottom: 50px;
  padding: 5px 10px 12px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
  transition: all 0.25s ease;
}

.btn-close:hover {
  background: linear-gradient(135deg, #ff1e2d, #d12f2f);
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(192, 57, 43, 0.5);
}
</style>
