<template>
  <div class="qua-luu-niem-page">
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h1 class="mb-4 text-primary fw-bold d-flex align-items-center justify-content-center">
            <i class="bi bi-gift-fill me-2"></i>
            Quản lý Quà Lưu Niệm
          </h1>
          <div class="d-flex gap-2 flex-wrap">
            <button
              class="btn btn-outline-primary d-flex align-items-center"
              @click="$router.push('/admin/donhang')"
            >
             <i class="bi bi-journal-bookmark-fill"> </i> Đơn hàng
            </button>

            <button
              v-if="!showForm"
              class="btn btn-primary d-flex align-items-center"
              @click="showAddForm"
            >
              <i class="bi bi-plus-circle me-1"></i> Thêm mới
            </button>
          </div>
      </div>

      <!-- Bộ tìm kiếm và sắp xếp -->
      <div class="toolbar mb-4 d-flex flex-wrap gap-2 align-items-center">
        <!-- Ô tìm kiếm -->
        <div class="input-group" style="max-width: 320px">
          <span class="input-group-text bg-light">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Tìm theo tên hoặc mô tả..."
          />
        </div>

        <!-- Bộ chọn sắp xếp -->
        <div class="input-group" style="max-width: 220px">
          <span class="input-group-text bg-light">
            <i class="bi bi-funnel"></i>
          </span>
          <select v-model="sortOption" class="form-select">
            <option value="nameAsc">Tên A → Z</option>
            <option value="nameDesc">Tên Z → A</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
          </select>
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
              <button type="button" class="btn-close" @click="cancelEdit"></button>
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
                    min="0"
                    class="form-control"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Mô tả</label>
                  <textarea v-model="form.moTa" class="form-control" rows="3"></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label">URL ảnh minh họa</label>
                  <input v-model="form.anhMinhHoa" type="text" class="form-control" />
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
        <div v-if="filteredAndSortedItems.length === 0" class="text-center text-muted py-5">
           Không tìm thấy quà lưu niệm phù hợp.
        </div>

        <div v-else class="row g-4">
          <div
            v-for="item in filteredAndSortedItems"
            :key="item._id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <div class="card h-100 shadow-sm">
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
                      class="btn btn-sm btn-outline-warning flex-fill d-flex align-items-center justify-content-center"
                    >
                      <i class="bi bi-pencil-square me-1"></i> Sửa
                    </button>

                    <button
                      @click="deleteItem(item._id)"
                      class="btn btn-sm btn-outline-danger flex-fill d-flex align-items-center justify-content-center"
                    >
                      <i class="bi bi-trash3-fill me-1"></i> Xóa
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
      searchQuery: "",
      sortOption: "nameAsc",
    };
  },
  created() {
    this.fetchItems();
  },
  computed: {
    filteredAndSortedItems() {
      let result = this.items;

      // Lọc theo từ khóa
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(
          (item) =>
            item.tenQuaLuuNiem.toLowerCase().includes(q) ||
            (item.moTa && item.moTa.toLowerCase().includes(q))
        );
      }

      // Sắp xếp
      switch (this.sortOption) {
        case "nameAsc":
          result = [...result].sort((a, b) =>
            a.tenQuaLuuNiem.localeCompare(b.tenQuaLuuNiem, "vi")
          );
          break;
        case "nameDesc":
          result = [...result].sort((a, b) =>
            b.tenQuaLuuNiem.localeCompare(a.tenQuaLuuNiem, "vi")
          );
          break;
        case "priceAsc":
          result = [...result].sort((a, b) => a.gia - b.gia);
          break;
        case "priceDesc":
          result = [...result].sort((a, b) => b.gia - a.gia);
          break;
      }

      return result;
    },
  },
  methods: {
    async fetchItems() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem`
        );
        this.items = res.data;
      } catch (err) {
        console.error("Lỗi khi lấy danh sách:", err);
      }
    },

    async handleSubmit() {
      try {
        if (this.isEditing) {
          await axios.put(
            `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem/${this.editId}`,
            this.form
          );
          alert("✅ Cập nhật thành công!");
        } else {
          await axios.post(
            `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem`,
            this.form
          );
          alert("✅ Thêm mới thành công!");
        }
        this.resetForm();
        this.fetchItems();
      } catch (err) {
        alert("❌ Lỗi khi lưu quà lưu niệm!");
        console.error(err);
      }
    },

    showAddForm() {
      this.showForm = true;
      this.isEditing = false;
      this.resetForm();
    },

    editItem(item) {
      this.showForm = true;
      this.isEditing = true;
      this.editId = item._id;
      this.form = { ...item };
    },

    cancelEdit() {
      this.resetForm();
      this.showForm = false;
    },

    async deleteItem(id) {
      if (!confirm("Bạn có chắc muốn xóa quà lưu niệm này?")) return;
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem/${id}`
        );
        alert("🗑️ Xóa thành công!");
        this.fetchItems();
      } catch (err) {
        alert("❌ Lỗi khi xóa!");
        console.error(err);
      }
    },

    resetForm() {
      this.isEditing = false;
      this.editId = null;
      this.form = { tenQuaLuuNiem: "", gia: "", moTa: "", anhMinhHoa: "" };
    },

    getImage(url) {
      if (!url || url.trim() === "")
        return "https://via.placeholder.com/200x150?text=No+Image";
      if (url.startsWith("http") || url.startsWith("data:image")) return url;
      return `/${url}`;
    },

    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN").format(price);
    },
  },
};
</script>

<style scoped>
.text-primary {
  color: #8B2C31 !important; /* đỏ rượu vang nhẹ */
}

.qua-luu-niem-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
