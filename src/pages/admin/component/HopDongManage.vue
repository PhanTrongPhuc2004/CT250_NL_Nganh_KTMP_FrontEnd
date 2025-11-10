<template>
  <div class="contracts-page">
    <h1>
      <i class="bi bi-file-earmark-text me-2"></i>
      Danh sách Hợp Đồng Cầu Thủ
    </h1>


    <div class="actions">
      <button class="btn btn-primary btn-add" @click="moFormTaoMoi">
        <i class="bi bi-plus-circle me-1"></i> Tạo hợp đồng mới
      </button>

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
              <button class="btn btn-info btn-detail" @click="xemChiTiet(hd)">
                <i class="bi bi-eye me-1"></i> Xem
              </button>

              <button class="btn btn-warning btn-edit" @click="moFormSua(hd)">
                <i class="bi bi-pencil-square me-1"></i> Sửa
              </button>

              <button class="btn btn-danger btn-delete" @click="xoaHopDong(hd._id)">
                <i class="bi bi-trash3 me-1"></i> Xóa
              </button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>Không có hợp đồng nào.</p>

    <!-- Chi tiết hợp đồng (hiển thị như hợp đồng thật) -->
    <div v-if="selectedHopDong && !isEditing && !isCreating" class="modal">
      <div class="modal-content contract-detail" id="printArea">
        <div class="contract-header">
          <!-- <img src="/public/logo-club.png" alt="Logo CLB" class="club-logo" /> -->
          <div class="contract-title">
            <h2>HỢP ĐỒNG CHO THUÊ CẦU THỦ</h2>
            <p>Số: {{ selectedHopDong.maHopDong }}</p>
          </div>
        </div>

        <div class="contract-body">
          <p><b>Căn cứ:</b> Bộ luật Dân sự và các quy định hiện hành về lao động, thể thao chuyên nghiệp.</p>
          <p><b>Hôm nay, ngày {{ new Date().toLocaleDateString("vi-VN") }}, chúng tôi gồm:</b></p>

          <h3>BÊN A: CLB CHỦ QUẢN</h3>
          <p><b>Tên CLB:</b> {{ selectedHopDong.tenCLBChuQuan || "Không có" }}</p>
          <p><b>Người đại diện:</b> {{ selectedHopDong.nguoiDaiDien }}</p>

          <h3>BÊN B: CLB THUÊ</h3>
          <p><b>Tên CLB:</b> {{ selectedHopDong.tenCLBThue }}</p>

          <h3>THÔNG TIN CẦU THỦ</h3>
          <p><b>Họ và tên:</b> {{ selectedHopDong.tenCauThu }}</p>
          <p><b>Quốc tịch:</b> {{ selectedHopDong.quocTichCauThu }}</p>
          <p><b>Vị trí thi đấu:</b> {{ selectedHopDong.viTriCauThu }}</p>

          <h3>ĐIỀU KHOẢN HỢP ĐỒNG</h3>
          <ul>
            <li>Thời hạn hợp đồng: từ
              <b>{{ formatDate(selectedHopDong.ngayBatDau) }}</b>
              đến
              <b>{{ formatDate(selectedHopDong.ngayKetThuc) }}</b>
            </li>
            <li>Phí thuê cầu thủ: <b>{{ formatMoney(selectedHopDong.phiThue) }}</b></li>
            <li>Lương cầu thủ (mỗi tháng): <b>{{ formatMoney(selectedHopDong.luongCauThu) }}</b></li>
            <li>Tiền thưởng (nếu có): <b>{{ formatMoney(selectedHopDong.tienThuong) }}</b></li>
            <li>Các điều khoản khác: {{ selectedHopDong.dieuKhoan || "—" }}</li>
          </ul>

          <p><b>Trạng thái hợp đồng:</b> {{ selectedHopDong.trangThai }}</p>

          <p style="margin-top:20px;">Hợp đồng này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>
        </div>

        <div class="contract-footer">
          <div class="sign-section">
            <div>
              <b>ĐẠI DIỆN BÊN A</b><br />
              (Ký, ghi rõ họ tên)
              <div class="sign-placeholder"></div>
            </div>
            <div>
              <b>ĐẠI DIỆN BÊN B</b><br />
              (Ký, ghi rõ họ tên)
              <div class="sign-placeholder"></div>
            </div>
          </div>
        </div>

        <div class="actions no-print">
        <button @click="inHopDong" class="btn btn-primary">
          <i class="bi bi-printer"></i> In hợp đồng
        </button>
        <button @click="selectedHopDong = null" class="btn btn-secondary">
          <i class="bi bi-arrow-left-circle me-1"></i> Quay lại
        </button>
        </div>

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
    inHopDong() {
      const printContent = document.getElementById("printArea").innerHTML;
      const win = window.open("", "", "width=900,height=700");

      win.document.write(`
        <html>
          <head>
            <title>----------</title>
            <style>
              body {
                font-family: 'Times New Roman', serif;
                padding: 40px 60px;
                line-height: 1.3;
              }

              h2, h3 {
                text-align: center;
                margin: 0;
              }

              p, li {
                font-size: 15px;
                line-height: 1.5;
                text-align: justify;
                margin: 5px 0;
              }

              ul {
                list-style-type: none;
                padding-left: 0;
              }

              .quoc-hieu {
                text-align: center;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 16px;
              }

              .tieu-ngu {
                text-align: center;
                font-weight: bold;
                font-size: 15px;
                margin-top: 4px;
              }

              .gach-chan {
                width: 240px;
                height: 1px;
                background-color: #000;
                margin: 4px auto 20px auto;
              }

              .ngay-thang {
                text-align: right;       /* 🔹 căn phải */
                font-style: italic;
                font-size: 14px;
                margin-bottom: 20px;
                margin-right: 40px;      /* 🔹 đẩy vào trong một chút cho đẹp */
              }

              .contract-title {
                text-align: center;
                margin: 20px 0 25px 0;
                font-weight: bold;
                font-size: 18px;
                text-transform: uppercase;
              }

              .sign-section {
                display: flex;
                justify-content: space-around;
                margin-top: 60px;
                text-align: center;
              }

              .sign-block {
                width: 45%;
              }

              .sign-block p {
                text-align: center;
                line-height: 1.4;
              }

              .sign-placeholder {
                margin: 30px 0 5px 0;
              }

              /* Dòng chấm để ký tên */
              .dots {
                letter-spacing: 3px;
              }

              /* Ẩn nút in/xóa khi in */
              @media print {
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            <!-- Quốc hiệu - tiêu ngữ -->
            <div class="quoc-hieu">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div class="tieu-ngu">Độc lập - Tự do - Hạnh phúc</div>
            <div class="gach-chan"></div>

            <!-- Ngày tháng năm -->
            <div class="ngay-thang">
              ......., ngày ...... tháng ...... năm 20......
            </div>

            ${printContent}

            <!-- Khu vực ký tên -->

          </body>
        </html>
      `);

      win.document.close();
      win.print();
    }

,



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
  background: whitesmoke;
  color: #2c3e50;
  padding: 40px;
  min-height: 100vh;
}

h1 {
  margin-bottom: 30px;
}
h1 {
  text-align: center;
  color: #8B2C31; /* xanh Bootstrap */
  margin-bottom: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

h1 i {
  color: #8B2C31;
  font-size: 2rem;
}

h3{
  margin-top: 10px;
}
p{
  margin-bottom: 0.5rem;
}
li{
  margin-bottom: 0.5rem;
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
.contract-detail {
  font-family: "Times New Roman", serif;
  background: #fff;
  color: #000;
  line-height: 1.6;
  padding: 20px 40px;
}

.contract-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
}

.club-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.contract-title h2 {
  margin: 0;
  text-transform: uppercase;
}

.contract-body h3 {
  margin-top: 20px;
  color: #2c3e50;
  text-transform: uppercase;
  font-size: 16px;
}

.sign-section {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  text-align: center;
}

.sign-placeholder {
  height: 80px;
  border-bottom: 1px dotted #333;
  width: 200px;
  margin: 10px auto;
}

.btn-print {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 10px;
}
.btn-print:hover {
  transform: translateY(-2px);
}

</style>
