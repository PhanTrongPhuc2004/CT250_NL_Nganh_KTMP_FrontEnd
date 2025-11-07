<template>
  <div class="qua-luu-niem-page">
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Quản lý Quà Lưu Niệm</h1>
        <div>
          <button
            class="btn btn-outline-primary me-2"
            @click="$router.push('/admin/qualuuniem/donhang')"
          >
            Đơn hàng
          </button>
          <button v-if="!showForm" class="btn btn-primary" @click="showAddForm">
            + Thêm mới
          </button>
        </div>
      </div>

      <!-- Overlay -->
      <div v-if="showForm" class="modal-backdrop fade show"></div>

      <!-- Form thêm / cập nhật -->
      <div v-if="showForm" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditing ? "Cập nhật Quà Lưu Niệm" : "Thêm Quà Lưu Niệm" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="cancelEdit"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label">Tên quà lưu niệm</label>
                  <input
                    v-model="form.tenQuaLuuNiem"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Giá (VNĐ)</label>
                  <input
                    v-model.number="form.gia"
                    type="number"
                    class="form-control"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Mô tả</label>
                  <textarea
                    v-model="form.moTa"
                    class="form-control"
                    rows="3"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label">URL ảnh minh họa</label>
                  <input
                    v-model="form.anhMinhHoa"
                    type="text"
                    class="form-control"
                  />
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary flex-fill">
                    {{ isEditing ? "Cập nhật" : "Thêm mới" }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary flex-fill"
                    @click="cancelEdit"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="product-list">
        <div v-if="items.length === 0" class="text-center text-muted py-5">
          Chưa có quà lưu niệm nào.
        </div>

        <div v-else class="row g-4">
          <div
            v-for="item in items"
            :key="item._id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <div class="card h-100">
              <img
                :src="getImage(item.anhMinhHoa)"
                :alt="item.tenQuaLuuNiem"
                class="card-img-top"
                style="height: 200px; object-fit: cover"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ item.tenQuaLuuNiem }}</h5>
                <p class="card-text text-danger fw-bold fs-5">
                  {{ formatPrice(item.gia) }} VNĐ
                </p>
                <p class="card-text text-muted small flex-grow-1">
                  {{ item.moTa || "Không có mô tả" }}
                </p>
                <div class="d-flex gap-2 mt-2">
                  <button
                    @click="editItem(item)"
                    class="btn btn-sm btn-outline-warning flex-fill"
                  >
                    Sửa
                  </button>
                  <button
                    @click="deleteItem(item._id)"
                    class="btn btn-sm btn-outline-danger flex-fill"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
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
      showForm: false,
    };
  },
  created() {
    this.fetchItems();
  },
  methods: {
    // Lấy danh sách
    async fetchItems() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem`
        );
        this.items = res.data;
        console.log(this.items);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách:", err);
      }
    },

    // Thêm hoặc cập nhật
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await axios.put(
            `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem/${this.editId}`,
            this.form
          );
          alert("Cập nhật thành công!");
        } else {
          await axios.post(
            `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem`,
            this.form
          );
          alert("Thêm mới thành công!");
        }
        this.resetForm();
        this.fetchItems();
      } catch (err) {
        alert("Lỗi khi lưu quà lưu niệm!");
        console.error(err);
      }
    },

    // Hiển thị form thêm mới
    showAddForm() {
      this.showForm = true;
      this.isEditing = false;
      this.resetForm();
    },

    // Sửa
    editItem(item) {
      this.showForm = true;
      this.isEditing = true;
      this.editId = item._id;
      this.form = { ...item };
    },

    // Hủy chỉnh sửa
    cancelEdit() {
      this.resetForm();
      this.showForm = false;
    },

    // Xóa
    async deleteItem(id) {
      if (!confirm("Bạn có chắc muốn xóa quà lưu niệm này?")) return;
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem/${id}`
        );
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

    // Hàm xử lý ảnh linh hoạt
    getImage(url) {
      if (!url || url.trim() === "") {
        return "https://via.placeholder.com/200x150?text=No+Image";
      }
      if (url.startsWith("http") || url.startsWith("data:image")) {
        return url;
      }
      return `/${url}`;
    },

    // Format giá tiền
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN").format(price);
    },
  },
};
</script>

<style scoped>
.qua-luu-niem-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>
