<template>
  <div class="qua-luu-niem-page">
    <h1>Quản lý Quà Lưu Niệm</h1>
        <button class="order-btn" @click="$router.push('/admin/qualuuniem/donhang')">
          Đơn hàng
        </button>
    <!-- Form thêm / cập nhật -->
    <div class="form-card">
      <h3>{{ isEditing ? " Cập nhật Quà Lưu Niệm" : " Thêm Quà Lưu Niệm" }}</h3>
      <form @submit.prevent="handleSubmit">
        <input v-model="form.tenQuaLuuNiem" placeholder="Tên quà lưu niệm" required />
        <input v-model.number="form.gia" type="number" placeholder="Giá (VNĐ)" required />
        <textarea v-model="form.moTa" placeholder="Mô tả"></textarea>
        <input v-model="form.anhMinhHoa" placeholder="URL ảnh minh họa (tùy chọn)" />

        <button type="submit" class="btn btn-primary">
          {{ isEditing ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button v-if="isEditing" @click="cancelEdit" type="button" class="btn btn-secondary">
          Hủy
        </button>
      </form>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="product-list">
      <h3> Danh sách Quà Lưu Niệm</h3>

      <div v-if="items.length === 0">Chưa có quà lưu niệm nào.</div>

      <div class="product-grid">
        <div v-for="item in items" :key="item._id" class="product-card">
          <img :src="getImage(item.anhMinhHoa)" alt="Ảnh quà lưu niệm" />
          <h4>{{ item.tenQuaLuuNiem }}</h4>
          <p><b>Giá:</b> {{ item.gia.toLocaleString() }} VNĐ</p>
          <p class="desc">{{ item.moTa }}</p>

          <div class="actions">
            <button @click="editItem(item)" class="btn btn-warning">Sửa</button>
            <button @click="deleteItem(item._id)" class="btn btn-danger">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "QuaLuuNiemPage",
  data() {
    return {
      items: [],
      form: {
        tenQuaLuuNiem: "",
        gia: "",
        moTa: "",
        anhMinhHoa: "",
      },
      isEditing: false,
      editId: null,
    };
  },
  created() {
    this.fetchItems();
  },
  methods: {
    // Lấy danh sách
    async fetchItems() {
      try {
        const res = await axios.get("http://localhost:5000/qualuuniem");
        this.items = res.data;
      } catch (err) {
        console.error("Lỗi khi lấy danh sách:", err);
      }
    },

    // Thêm hoặc cập nhật
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await axios.put(`http://localhost:5000/qualuuniem/${this.editId}`, this.form);
          alert("Cập nhật thành công!");
        } else {
          await axios.post("http://localhost:5000/qualuuniem", this.form);
          alert("Thêm mới thành công!");
        }
        this.resetForm();
        this.fetchItems();
      } catch (err) {
        alert("Lỗi khi lưu quà lưu niệm!");
        console.error(err);
      }
    },

    // Sửa
    editItem(item) {
      this.isEditing = true;
      this.editId = item._id;
      this.form = { ...item };
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    // Hủy chỉnh sửa
    cancelEdit() {
      this.resetForm();
    },

    // Xóa
    async deleteItem(id) {
      if (!confirm("Bạn có chắc muốn xóa quà lưu niệm này?")) return;
      try {
        await axios.delete(`http://localhost:5000/qualuuniem/${id}`);
        alert("Xóa thành công!");
        this.fetchItems();
      } catch (err) {
        alert("Lỗi khi xóa!");
        console.error(err);
      }
    },

    // Reset form
    resetForm() {
      this.isEditing = false;
      this.editId = null;
      this.form = { tenQuaLuuNiem: "", gia: "", moTa: "", anhMinhHoa: "" };
    },

    // ✅ Hàm xử lý ảnh linh hoạt
    getImage(url) {
      if (!url || url.trim() === "") {
        return "https://via.placeholder.com/200x150?text=No+Image"; // ảnh fallback
      }
      if (url.startsWith("http") || url.startsWith("data:image")) {
        return url; // URL hoặc Base64
      }
      // ảnh từ public/data
      return `/${url}`;
    },
  },
};
</script>


<style scoped>
.qua-luu-niem-page {
  padding: 30px;
  max-width: 1000px;
  margin: auto;
}

.form-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.form-card form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-card input,
.form-card textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-warning {
  background: #ffc107;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 15px;
  text-align: center;
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.product-card .desc {
  color: #666;
  font-size: 14px;
  min-height: 40px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}
.order-btn {
  background: linear-gradient(90deg, #3d76b7, #63679f);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
