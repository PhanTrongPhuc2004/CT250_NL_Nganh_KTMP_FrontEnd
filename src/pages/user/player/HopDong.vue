<template>
  <div class="contract-page">
    <div class="contract-paper">
      <h1 class="title">HỢP ĐỒNG CẦU THỦ</h1>
      <p class="contract-code">Mã hợp đồng: {{ hopDong.maHopDong }}</p>
      <hr />

      <!-- Thông tin cầu thủ -->
      <section class="section">
        <h2>1️⃣ Thông tin cầu thủ</h2>
        <p><strong>Họ và tên:</strong> {{ hopDong.tenCauThu || "—" }}</p>
        <p><strong>Quốc tịch:</strong> {{ hopDong.quocTichCauThu || "—" }}</p>
        <p><strong>Vị trí:</strong> {{ hopDong.viTriCauThu || "—" }}</p>
        <p><strong>Ngày sinh:</strong> {{ formatDate(hopDong.ngaySinhCauThu) }}</p>
        <p><strong>Địa chỉ:</strong> {{ hopDong.diaChiCauThu || "—" }}</p>
        <p><strong>Số điện thoại:</strong> {{ hopDong.sdtCauThu || "—" }}</p>
      </section>

      <!-- Thông tin CLB thuê -->
      <section class="section">
        <h2>2️⃣ Câu lạc bộ thuê</h2>
        <p><strong>Tên CLB:</strong> {{ hopDong.tenCLBThue || "—" }}</p>
        <p><strong>Quốc gia:</strong> {{ hopDong.quocGiaCLBThue || "—" }}</p>
        <p><strong>Địa chỉ:</strong> {{ hopDong.diaChiCLBThue || "—" }}</p>
      </section>

      <!-- Thông tin CLB chủ quản -->
      <section class="section" v-if="hopDong.tenCLBChuQuan">
        <h2>3️⃣ Câu lạc bộ chủ quản (nếu cho mượn)</h2>
        <p><strong>Tên CLB:</strong> {{ hopDong.tenCLBChuQuan || "—" }}</p>
        <p><strong>Quốc gia:</strong> {{ hopDong.quocGiaCLBChuQuan || "—" }}</p>
        <p><strong>Giải đấu:</strong> {{ hopDong.giaiDauCLBChuQuan || "—" }}</p>
      </section>

      <!-- Thông tin hợp đồng -->
      <section class="section">
        <h2>4️⃣ Chi tiết hợp đồng</h2>
        <p><strong>Ngày ký:</strong> {{ formatDate(hopDong.ngayKy) }}</p>
        <p><strong>Ngày bắt đầu:</strong> {{ formatDate(hopDong.ngayBatDau) }}</p>
        <p><strong>Ngày kết thúc:</strong> {{ formatDate(hopDong.ngayKetThuc) }}</p>
        <p><strong>Phí thuê:</strong> {{ formatCurrency(hopDong.phiThue) }}</p>
        <p><strong>Lương cầu thủ:</strong> {{ formatCurrency(hopDong.luongCauThu) }}</p>
        <p><strong>Tiền thưởng:</strong> {{ formatCurrency(hopDong.tienThuong) }}</p>
        <p><strong>Người đại diện:</strong> {{ hopDong.nguoiDaiDien || "—" }}</p>
        <p><strong>Điều khoản:</strong> {{ hopDong.dieuKhoan || "—" }}</p>
        <p><strong>Ghi chú:</strong> {{ hopDong.ghiChu || "—" }}</p>
        <p><strong>Trạng thái:</strong>
          <span :class="['status', hopDong.trangThai?.toLowerCase().replace(' ', '-')]">
            {{ hopDong.trangThai }}
          </span>
        </p>
      </section>

      <!-- Footer -->
      <footer>
        <p>Người quản lý: <strong>{{ hopDong.tenDangNhap }}</strong></p>
        <p>Ngày tạo: {{ formatDate(hopDong.createdAt) }}</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  name: "HopDong",
  setup() {
    const route = useRoute();
    const hopDong = ref({});

    const fetchHopDong = async () => {
      const { id } = route.params;
      if (!id) return;
      try {
        const res = await axios.get(`http://localhost:5000/hopdong/${id}`);
        hopDong.value = res.data;
      } catch (err) {
        console.error("Lỗi khi tải hợp đồng:", err.response?.data || err);
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleDateString("vi-VN");
    };

    const formatCurrency = (num) => {
      if (!num && num !== 0) return "—";
      return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    onMounted(fetchHopDong);

    return { hopDong, formatDate, formatCurrency };
  },
};
</script>

<style scoped>
.contract-page {
  display: flex;
  justify-content: center;
  padding: 40px;
  background: #f5f2e9;
  min-height: 100vh;
}

.contract-paper {
  width: 800px;
  background: white;
  padding: 40px 60px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  font-family: "Times New Roman", serif;
  color: #333;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.contract-code {
  text-align: center;
  font-style: italic;
  color: #555;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 25px;
}

.section h2 {
  font-size: 18px;
  background: #f0f0f0;
  padding: 6px 10px;
  border-left: 5px solid #2c3e50;
  margin-bottom: 10px;
}

.status {
  padding: 4px 10px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}

.status.chưa-ký {
  background: #999;
}

.status.đang-hiệu-lực {
  background: #27ae60;
}

.status.hết-hạn {
  background: #c0392b;
}

footer {
  margin-top: 30px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  text-align: right;
  color: #777;
  font-style: italic;
}
</style>
