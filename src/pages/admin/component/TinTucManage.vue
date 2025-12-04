<template>
  <div class="tintuc-page">
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="mb-4 text-primary fw-bold d-flex align-items-center justify-content-center">
              <i class="bi bi-newspaper me-2"></i>
              Quản lý Tin Tức
            </h1>
        <button v-if="!showForm" class="btn btn-primary" @click="showAddForm">
          + Thêm mới
        </button>
      </div>

      <!-- Thanh tìm kiếm và sắp xếp -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div class="input-group w-50">
          <span class="input-group-text bg-light">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Tìm kiếm theo tiêu đề hoặc nguồn tin..."
          />
        </div>

        <div class="input-group w-auto">
          <span class="input-group-text bg-light">
            <i class="bi bi-sort-alpha-down"></i>
          </span>
          <select v-model="sortOption" class="form-select">
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="title">Theo tiêu đề (A–Z)</option>
          </select>
        </div>
      </div>


      <!-- Overlay -->
      <div v-if="showForm" class="modal-backdrop fade show"></div>

      <!-- Form thêm / sửa -->
      <div v-if="showForm" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditing ? "Cập nhật Tin Tức" : "Thêm Tin Tức Mới" }}
              </h5>
              <button type="button" class="btn-close" @click="cancelEdit"></button>
            </div>

            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Tiêu đề</label>
                    <input
                      v-model="form.title"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Nguồn tin</label>
                    <input
                      v-model="form.source"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>

                  <div class="col-md-12">
                    <label class="form-label">Mô tả</label>
                    <textarea
                      v-model="form.desc"
                      class="form-control"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Link bài viết</label>
                    <input
                      v-model="form.link"
                      type="url"
                      class="form-control"
                      required
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">URL hình ảnh</label>
                    <input
                      v-model="form.image"
                      type="text"
                      class="form-control"
                      placeholder="https://..."
                      required
                    />
                  </div>
                </div>

                <div class="d-flex gap-2 mt-4">
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

      <!-- Danh sách tin tức -->
      <div class="news-list mt-4">
        <!-- Tin tức bóng đá tự động -->
        <hr class="my-4">
        <News />
        
        <div v-if="filteredNews.length === 0" class="text-center text-muted py-5">
          Không tìm thấy tin tức nào phù hợp.
        </div>

        <div v-else class="row g-4">
          <div
            v-for="item in filteredNews"
            :key="item._id"
            class="col-12 col-sm-6 col-lg-4"
          >
            <div class="card h-100">
              <img
                :src="getImage(item.image)"
                :alt="item.title"
                class="card-img-top"
                style="height: 200px; object-fit: cover"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate" :title="item.title">
                  {{ item.title }}
                </h5>
                <p class="card-text small flex-grow-1">
                  {{ truncateText(item.desc, 100) }}
                </p>
                <p class="text-muted small mb-2">Nguồn: {{ item.source }}</p>
                <div class="d-flex gap-2">
                  <a
                    :href="item.link"
                    target="_blank"
                    class="btn btn-sm btn-outline-info flex-fill"
                  >
                    Xem bài
                  </a>
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
import News from "@/pages/admin/component/News.vue"
export default {
  name: "AdminTintucPage",
  components: { News }, 
  data() {
    return {
      items: [],
      form: { title: "", desc: "", image: "", link: "", source: "" },
      isEditing: false,
      editId: null,
      showForm: false,
      searchQuery: "",
      sortOption: "newest",
    };
  },
  created() {
    this.fetchItems();
  },
  computed: {
    filteredNews() {
      let result = this.items.filter(
        (item) =>
          item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.source.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.sortOption === "newest")
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      else if (this.sortOption === "oldest")
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      else if (this.sortOption === "title")
        result.sort((a, b) => a.title.localeCompare(b.title));

      return result;
    },
  },
  methods: {
    async fetchItems() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BE_BASE_URL}/tintuc`);
        this.items = res.data;
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tin tức:", err);
      }
    },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await axios.put(
            `${import.meta.env.VITE_API_BE_BASE_URL}/tintuc/${this.editId}`,
            this.form
          );
          alert("Cập nhật tin tức thành công!");
        } else {
          await axios.post(`${import.meta.env.VITE_API_BE_BASE_URL}/tintuc`, this.form);
          alert("Thêm tin tức thành công!");
        }
        this.resetForm();
        this.fetchItems();
      } catch (err) {
        console.error("Lỗi khi lưu tin tức:", err);
        alert("Không thể lưu tin tức!");
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
      this.showForm = false;
      this.resetForm();
    },
    async deleteItem(id) {
      if (!confirm("Bạn có chắc muốn xóa tin tức này?")) return;
      try {
        await axios.delete(`${import.meta.env.VITE_API_BE_BASE_URL}/tintuc/${id}`);
        alert("Đã xóa tin tức!");
        this.fetchItems();
      } catch (err) {
        console.error("Lỗi khi xóa tin tức:", err);
      }
    },
    resetForm() {
      this.isEditing = false;
      this.editId = null;
      this.form = { title: "", desc: "", image: "", link: "", source: "" };
    },
    getImage(url) {
      if (!url) return "https://via.placeholder.com/300x200?text=No+Image";
      if (url.startsWith("http")) return url;
      return `/${url}`;
    },
    truncateText(text, length) {
      return text && text.length > length ? text.slice(0, length) + "..." : text;
    },
  },
};
</script>

<style scoped>
.text-primary{
  color: #8B2C31 !important;
  font-weight: 700;
}
.tintuc-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.card {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
