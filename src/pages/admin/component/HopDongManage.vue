<template>
  <div class="contracts-page">
    <h1>Danh sách Hợp Đồng Cầu Thủ</h1>

    <div class="actions">
      <button class="btn-add" @click="moFormTaoMoi">Tạo hợp đồng mới</button>
    </div>

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
            <th>Người đại diện</th>
            <th>Thao tác</th>
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
              <button class="btn-edit" @click="moFormSua(hd)">Sửa</button>
              <button class="btn-delete" @click="xoaHopDong(hd._id)">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>Không có hợp đồng nào.</p>

    <!-- Chi tiết -->
    <div v-if="selectedHopDong && !isEditing && !isCreating" class="modal">
      <div class="modal-content">
        <h2>Chi tiết hợp đồng {{ selectedHopDong.maHopDong }}</h2>
        <p><b>Tên cầu thủ:</b> {{ selectedHopDong.tenCauThu }}</p>
        <p><b>Quốc tịch:</b> {{ selectedHopDong.quocTichCauThu }}</p>
        <p><b>Vị trí:</b> {{ selectedHopDong.viTriCauThu }}</p>
        <p><b>CLB thuê:</b> {{ selectedHopDong.tenCLBThue }}</p>
        <p>
          <b>CLB chủ quản:</b> {{ selectedHopDong.tenCLBChuQuan || "Không có" }}
        </p>
        <p>
          <b>Thời hạn:</b> {{ formatDate(selectedHopDong.ngayBatDau) }} →
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

    <!-- Form tạo / sửa -->
    <div v-if="isEditing || isCreating" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? " Sửa hợp đồng" : " Tạo hợp đồng mới" }}</h2>

        <div
          class="form-group"
          v-for="(value, key) in editableHopDong"
          :key="key"
          v-if="key !== '_id'"
        >
          <label>{{ chuyenLabel(key) }}:</label>
          <input
            v-if="!['dieuKhoan', 'trangThai'].includes(key)"
            v-model="editableHopDong[key]"
            :type="
              isDateField(key) ? 'date' : isNumberField(key) ? 'number' : 'text'
            "
          />
          <textarea
            v-if="key === 'dieuKhoan'"
            v-model="editableHopDong[key]"
            rows="2"
          ></textarea>
          <select v-if="key === 'trangThai'" v-model="editableHopDong[key]">
            <option>Đang hiệu lực</option>
            <option>Hết hạn</option>
            <option>Chưa ký</option>
          </select>
        </div>

        <div class="btn-group">
          <button class="btn-save" @click="luuHopDong">Lưu</button>
          <button class="btn-close" @click="huyForm">✖ Hủy</button>
        </div>
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
      editableHopDong: {},
      isEditing: false,
      isCreating: false,
    };
  },
  async mounted() {
    await this.fetchHopDongs();
  },
  methods: {
    async fetchHopDongs() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/hopdong`
        );
        this.hopDongs = res.data;
      } catch (err) {
        alert("Lỗi tải hợp đồng!");
      } finally {
        this.loading = false;
      }
    },
    xemChiTiet(hd) {
      this.selectedHopDong = hd;
    },
    moFormSua(hd) {
      this.editableHopDong = { ...hd };
      this.isEditing = true;
      this.isCreating = false;
      this.selectedHopDong = null;
    },
    moFormTaoMoi() {
      this.editableHopDong = {
        maHopDong: "",
        tenCauThu: "",
        quocTichCauThu: "",
        viTriCauThu: "",
        tenCLBThue: "",
        tenCLBChuQuan: "",
        ngayBatDau: "",
        ngayKetThuc: "",
        phiThue: "",
        luongCauThu: "",
        tienThuong: "",
        dieuKhoan: "",
        nguoiDaiDien: "",
        trangThai: "Chưa ký",
      };
      this.isCreating = true;
      this.isEditing = false;
    },
    async luuHopDong() {
      try {
        if (this.isEditing) {
          await axios.put(
            `${import.meta.env.VITE_API_BE_BASE_URL}/hopdong/${
              this.editableHopDong._id
            }`,
            this.editableHopDong
          );
          alert("Cập nhật hợp đồng thành công!");
        } else if (this.isCreating) {
          await axios.post(
            `${import.meta.env.VITE_API_BE_BASE_URL}/hopdong`,
            this.editableHopDong
          );
          alert("Tạo hợp đồng mới thành công!");
        }
        await this.fetchHopDongs();
        this.huyForm();
      } catch (err) {
        alert("❌ Lỗi khi lưu hợp đồng!");
      }
    },
    async xoaHopDong(id) {
      if (confirm("Bạn có chắc muốn xóa hợp đồng này không?")) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_BE_BASE_URL}/hopdong/${id}`
          );
          alert(" Đã xóa hợp đồng!");
          await this.fetchHopDongs();
        } catch (err) {
          alert(" Lỗi khi xóa hợp đồng!");
        }
      }
    },
    huyForm() {
      this.isEditing = false;
      this.isCreating = false;
      this.editableHopDong = {};
    },
    chuyenLabel(key) {
      const map = {
        maHopDong: "Mã hợp đồng",
        tenCauThu: "Tên cầu thủ",
        quocTichCauThu: "Quốc tịch",
        viTriCauThu: "Vị trí",
        tenCLBThue: "CLB thuê",
        tenCLBChuQuan: "CLB chủ quản",
        ngayBatDau: "Ngày bắt đầu",
        ngayKetThuc: "Ngày kết thúc",
        phiThue: "Phí thuê",
        luongCauThu: "Lương cầu thủ",
        tienThuong: "Tiền thưởng",
        dieuKhoan: "Điều khoản",
        nguoiDaiDien: "Người đại diện",
        trangThai: "Trạng thái",
      };
      return map[key] || key;
    },
    isDateField(key) {
      return ["ngayBatDau", "ngayKetThuc"].includes(key);
    },
    isNumberField(key) {
      return ["phiThue", "luongCauThu", "tienThuong"].includes(key);
    },
    formatDate(d) {
      return new Date(d).toLocaleDateString("vi-VN");
    },
    formatMoney(n) {
      return n ? n.toLocaleString("vi-VN") + "₫" : "—";
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

.actions {
  text-align: right;
  margin-bottom: 15px;
}

.btn-add {
  background: linear-gradient(135deg, #1abc9c, #16a085);
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;
}
.btn-add:hover {
  transform: translateY(-2px);
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

.btn-detail,
.btn-edit,
.btn-delete {
  border: none;
  color: #fff;
  padding: 5px 9px;
  margin-right: 4px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-detail {
  background-color: #3498db;
}
.btn-edit {
  background-color: #f1c40f;
  color: #2c3e50;
}
.btn-delete {
  background-color: #e74c3c;
}
.btn-detail:hover {
  background-color: #2980b9;
}
.btn-edit:hover {
  background-color: #d4ac0d;
}
.btn-delete:hover {
  background-color: #c0392b;
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

/* Modal chi tiết / form */
.modal {
  position: fixed;
  inset: 0;
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

.form-group {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 600;
  margin-bottom: 4px;
}
.form-group input,
.form-group textarea,
.form-group select {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 8px;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #3498db;
}

.btn-group {
  text-align: right;
  margin-top: 10px;
}
.btn-save {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 6px;
  font-weight: 600;
}
.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(46, 204, 113, 0.5);
}
.btn-close {
  background: linear-gradient(135deg, #ff4e50, #f13c3c);
  color: #fff;
  border: none;
  width: 40px;
  height: 20px;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;
}
.btn-close:hover {
  background: linear-gradient(135deg, #ff1e2d, #d12f2f);
}
</style>
