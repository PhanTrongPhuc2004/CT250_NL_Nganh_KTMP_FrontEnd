<template>
  <div class="container py-4" style="max-width: 900px">
    <!-- Tiêu đề -->
    <div class="text-center mb-4">
      <img
        :src="club.logo || '/default-logo.png'"
        alt="Logo CLB"
        class="rounded-circle border shadow-sm"
        style="width: 100px; height: 100px; object-fit: cover"
      />
      <h4 class="mt-3 fw-bold text-uppercase" style="color: #8b2c31">
        {{ club.ten || "Tên Câu Lạc Bộ" }}
      </h4>
      <p class="text-muted small">
        Trang quản trị — Cập nhật thông tin câu lạc bộ
      </p>
    </div>

    <!-- Thông báo -->
    <div
      v-if="message"
      class="alert text-center rounded-3"
      :class="message.includes('✅') ? 'alert-success' : 'alert-danger'"
    >
      {{ message }}
    </div>

    <!-- Form -->
    <form @submit.prevent="updateClub" class="d-flex flex-column gap-4">
      <!-- 🟥 Thông tin cơ bản -->
      <div class="card border-0 shadow-sm">
        <div
          class="card-header bg-white border-bottom fw-bold"
          style="color: #8b2c31"
        >
          <i class="bi bi-info-circle me-2"></i>Thông tin cơ bản
        </div>
        <div class="card-body row g-3">
          <div class="col-md-6">
            <label class="form-label">Mã câu lạc bộ</label>
            <input
              type="text"
              class="form-control"
              v-model="club.maCauLacBo"
              readonly
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-danger">Tên câu lạc bộ *</label>
            <input
              type="text"
              class="form-control"
              v-model="club.ten"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Năm thành lập</label>
            <input
              type="number"
              class="form-control"
              v-model="club.namThanhLap"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Địa chỉ</label>
            <input type="text" class="form-control" v-model="club.diaChi" />
          </div>
        </div>
      </div>

      <!-- 🟩 Liên hệ -->
      <div class="card border-0 shadow-sm">
        <div
          class="card-header bg-white border-bottom fw-bold"
          style="color: #8b2c31"
        >
          <i class="bi bi-envelope-at me-2"></i>Thông tin liên hệ
        </div>
        <div class="card-body row g-3">
          <div class="col-md-4">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              v-model="club.lienHe.email"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Số điện thoại</label>
            <input
              type="text"
              class="form-control"
              v-model="club.lienHe.soDienThoai"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Website</label>
            <input
              type="text"
              class="form-control"
              v-model="club.lienHe.website"
            />
          </div>
        </div>
      </div>

      <!-- 🟦 Sân nhà -->
      <div class="card border-0 shadow-sm">
        <div
          class="card-header bg-white border-bottom fw-bold"
          style="color: #8b2c31"
        >
          <i class="bi bi-building me-2"></i>Thông tin sân nhà
        </div>
        <div class="card-body row g-3">
          <div class="col-md-6">
            <label class="form-label">Tên sân</label>
            <input type="text" class="form-control" v-model="club.sanNha.ten" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Sức chứa</label>
            <input
              type="number"
              class="form-control"
              v-model="club.sanNha.sucChua"
            />
          </div>
          <div class="col-12">
            <label class="form-label">Địa chỉ sân</label>
            <input
              type="text"
              class="form-control"
              v-model="club.sanNha.diaChi"
            />
          </div>
        </div>
      </div>

      <!-- 🟨 Thông tin bổ sung -->
      <div class="card border-0 shadow-sm">
        <div
          class="card-header bg-white border-bottom fw-bold"
          style="color: #8b2c31"
        >
          <i class="bi bi-quote me-2"></i>Thông tin bổ sung
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Slogan</label>
            <input type="text" class="form-control" v-model="club.slogan" />
          </div>
          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea
              class="form-control"
              rows="3"
              v-model="club.moTa"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 🟧 Nhà tài trợ -->
      <div class="card border-0 shadow-sm">
        <div
          class="card-header bg-white border-bottom fw-bold"
          style="color: #8b2c31"
        >
          <i class="bi bi-people-fill me-2"></i>Nhà tài trợ
        </div>
        <div class="card-body">
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span
              v-for="(sponsor, index) in club.nhaTaiTro"
              :key="index"
              class="badge rounded-pill text-bg-danger px-3 py-2"
              style="background-color: #8b2c31"
            >
              {{ sponsor }}
              <i
                class="bi bi-x-circle ms-2"
                @click="removeSponsor(index)"
                style="cursor: pointer"
              ></i>
            </span>
          </div>
          <div class="input-group">
            <input
              v-model="newSponsor"
              type="text"
              class="form-control"
              placeholder="Nhập tên nhà tài trợ..."
              @keyup.enter="addSponsor"
            />
            <button
              class="btn text-white"
              style="background-color: #8b2c31"
              @click="addSponsor"
            >
              <i class="bi bi-plus-circle"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 🟪 Logo -->
      <div class="card border-0 shadow-sm">
        <div
          class="card-header bg-white border-bottom fw-bold"
          style="color: #8b2c31"
        >
          <i class="bi bi-image me-2"></i>Logo câu lạc bộ
        </div>
        <div class="card-body d-flex align-items-center gap-3">
          <input
            type="text"
            class="form-control"
            placeholder="Nhập đường dẫn hình ảnh..."
            v-model="club.logo"
          />
          <img
            v-if="club.logo"
            :src="club.logo"
            alt="Logo Preview"
            class="border rounded p-1 bg-light"
            style="width: 60px; height: 60px; object-fit: cover"
          />
        </div>
      </div>

      <!-- Nút hành động -->
      <div class="text-end">
        <button
          type="submit"
          class="btn text-white px-4 py-2"
          :disabled="loading"
          style="background-color: #8b2c31"
        >
          <i class="bi bi-save me-1"></i>
          {{ loading ? "Đang lưu..." : "Lưu thay đổi" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const club = ref({
  maCauLacBo: "",
  ten: "",
  namThanhLap: "",
  diaChi: "",
  lienHe: { email: "", soDienThoai: "", website: "" },
  moTa: "",
  slogan: "",
  logo: "",
  nhaTaiTro: [],
  sanNha: { ten: "", diaChi: "", sucChua: "" },
});

const loading = ref(false);
const message = ref("");
const newSponsor = ref("");

// 🧩 Fetch thông tin
onMounted(async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/caulacbo/`
    );
    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    club.value = {
      ...club.value,
      ...data,
      lienHe: { ...club.value.lienHe, ...(data.lienHe || {}) },
      sanNha: { ...club.value.sanNha, ...(data.sanNha || {}) },
    };
  } catch (err) {
    message.value = "❌ Không thể tải thông tin câu lạc bộ.";
  }
});

// 🧩 Cập nhật
const updateClub = async () => {
  loading.value = true;
  message.value = "";
  try {
    await axios.put(
      `${import.meta.env.VITE_API_BE_BASE_URL}/caulacbo/${club.value._id}`,
      club.value
    );
    message.value = "✅ Cập nhật thông tin thành công!";
  } catch {
    message.value = "❌ Có lỗi khi cập nhật.";
  } finally {
    loading.value = false;
  }
};

// 🧩 Quản lý nhà tài trợ
const addSponsor = () => {
  if (newSponsor.value.trim()) {
    club.value.nhaTaiTro.push(newSponsor.value.trim());
    newSponsor.value = "";
  }
};
const removeSponsor = (index) => {
  club.value.nhaTaiTro.splice(index, 1);
};
</script>

<style scoped>
input:focus,
textarea:focus {
  border-color: #8b2c31 !important;
  box-shadow: 0 0 0 0.25rem rgba(139, 44, 49, 0.2);
}
.card {
  border-radius: 12px;
}
.card-header {
  font-size: 0.95rem;
  background: #fff;
}
</style>
