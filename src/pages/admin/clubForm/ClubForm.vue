<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="text-center mb-4">
      <img
        :src="form.logo || '/default-logo.png'"
        alt="Logo"
        class="rounded-circle border border-2"
        style="width: 100px; height: 100px; object-fit: cover"
      />
      <h4 class="mt-3 fw-bold text-uppercase" style="color: #8b2c31">
        {{ form.ten || "Tên Câu Lạc Bộ" }}
      </h4>
      <p class="text-muted small mb-0">Admin Panel — Update Club Info</p>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="bg-white shadow-sm p-4 rounded-4 border-top border-3"
      style="border-color: #8b2c31"
    >
      <!-- Club Info -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label fw-semibold"
            ><i class="bi bi-hash me-2"></i>Club Code</label
          >
          <input
            type="text"
            class="form-control"
            v-model="form.maCauLacBo"
            readonly
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-semibold text-danger"
            ><i class="bi bi-building me-2"></i>Club Name *</label
          >
          <input type="text" class="form-control" v-model="form.ten" required />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label fw-semibold"
            ><i class="bi bi-calendar me-2"></i>Year Founded</label
          >
          <input
            type="number"
            class="form-control"
            v-model="form.namThanhLap"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-semibold"
            ><i class="bi bi-geo-alt me-2"></i>Address</label
          >
          <input type="text" class="form-control" v-model="form.diaChi" />
        </div>
      </div>

      <!-- Contact Info -->
      <h6 class="mt-4 border-bottom pb-2 fw-bold" style="color: #8b2c31">
        <i class="bi bi-envelope-at me-2"></i>Contact Information
      </h6>

      <div class="row mb-3 mt-2">
        <div class="col-md-4">
          <label class="form-label"
            ><i class="bi bi-envelope me-2"></i>Email</label
          >
          <input
            type="email"
            class="form-control"
            v-model="form.lienHe.email"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label"
            ><i class="bi bi-telephone me-2"></i>Phone</label
          >
          <input
            type="text"
            class="form-control"
            v-model="form.lienHe.soDienThoai"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label"
            ><i class="bi bi-globe me-2"></i>Website</label
          >
          <input
            type="text"
            class="form-control"
            v-model="form.lienHe.website"
          />
        </div>
      </div>

      <!-- Stadium Info -->
      <h6 class="mt-4 border-bottom pb-2 fw-bold" style="color: #8b2c31">
        <i class="bi bi-building-fill me-2"></i>Stadium Information
      </h6>

      <div class="row mb-3 mt-2">
        <div class="col-md-6">
          <label class="form-label"
            ><i class="bi bi-geo me-2"></i>Stadium Name</label
          >
          <input type="text" class="form-control" v-model="form.sanNha.ten" />
        </div>
        <div class="col-md-6">
          <label class="form-label"
            ><i class="bi bi-people me-2"></i>Capacity</label
          >
          <input
            type="number"
            class="form-control"
            v-model="form.sanNha.sucChua"
          />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label"
          ><i class="bi bi-map me-2"></i>Stadium Address</label
        >
        <input type="text" class="form-control" v-model="form.sanNha.diaChi" />
      </div>

      <!-- Other Info -->
      <div class="mb-3">
        <label class="form-label"><i class="bi bi-quote me-2"></i>Slogan</label>
        <input type="text" class="form-control" v-model="form.slogan" />
      </div>

      <div class="mb-3">
        <label class="form-label"
          ><i class="bi bi-chat-left-text me-2"></i>Description</label
        >
        <textarea class="form-control" rows="3" v-model="form.moTa"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label"
          ><i class="bi bi-tags me-2"></i>Sponsors</label
        >
        <input
          type="text"
          class="form-control"
          placeholder="Add sponsor names separated by commas..."
          v-model="sponsorsInput"
          @change="updateSponsors"
        />
        <div class="mt-2">
          <span
            v-for="(sponsor, index) in form.nhaTaiTro"
            :key="index"
            class="badge rounded-pill me-2"
            style="background-color: #8b2c31"
          >
            {{ sponsor }}
          </span>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label"
          ><i class="bi bi-image me-2"></i>Club Logo</label
        >
        <input
          type="text"
          class="form-control"
          v-model="form.logo"
          placeholder="Enter logo URL"
        />
      </div>

      <!-- Buttons -->
      <div class="text-end mt-4">
        <button type="button" class="btn btn-outline-secondary me-2">
          <i class="bi bi-x-circle me-1"></i>Cancel
        </button>
        <button
          type="submit"
          class="btn text-white"
          style="background-color: #8b2c31"
        >
          <i class="bi bi-save me-1"></i>Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  maCauLacBo: "CLB-2025-001",
  ten: "",
  namThanhLap: "",
  diaChi: "",
  lienHe: { email: "", soDienThoai: "", website: "" },
  sanNha: { ten: "", diaChi: "", sucChua: "" },
  slogan: "",
  moTa: "",
  nhaTaiTro: [],
  logo: "",
});

const sponsorsInput = ref("");

const updateSponsors = () => {
  form.value.nhaTaiTro = sponsorsInput.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
};

const handleSubmit = () => {
  alert("Club information saved successfully!");
};
</script>

<style scoped>
input:focus,
textarea:focus {
  border-color: #8b2c31;
  box-shadow: 0 0 0 0.25rem rgba(139, 44, 49, 0.25);
}

h6 i {
  color: #8b2c31;
}
</style>
