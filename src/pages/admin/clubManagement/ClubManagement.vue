<template>
  <div class="container py-4" style="max-width: 900px">
    <!-- Tiêu đề -->
    <div class="text-center mb-4">
      <img
        :src="getLogoUrl"
        alt="Logo CLB"
        class="rounded-circle border shadow-sm"
        style="width: 100px; height: 100px; object-fit: cover"
      />
      <h4 class="mt-3 fw-bold text-uppercase text-primary">
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
      :class="messageType"
    >
      {{ message }}
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-4">
      <!-- Thông tin cơ bản -->
      <FormSection title="Thông tin cơ bản" icon="info-circle">
        <div class="row g-3">
          <div class="col-md-6">
            <FormField
              label="Mã câu lạc bộ"
              v-model="club.maCauLacBo"
              readonly
            />
          </div>
          <div class="col-md-6">
            <FormField label="Tên câu lạc bộ *" v-model="club.ten" required />
          </div>
          <div class="col-md-6">
            <FormField
              label="Năm thành lập"
              type="number"
              v-model="club.namThanhLap"
            />
          </div>
          <div class="col-md-6">
            <FormField label="Địa chỉ" v-model="club.diaChi" />
          </div>
        </div>
      </FormSection>

      <!-- Thông tin liên hệ -->
      <FormSection title="Thông tin liên hệ" icon="envelope-at">
        <div class="row g-3">
          <div class="col-md-4">
            <FormField label="Email" type="email" v-model="club.lienHe.email" />
          </div>
          <div class="col-md-4">
            <FormField
              label="Số điện thoại"
              v-model="club.lienHe.soDienThoai"
            />
          </div>
          <div class="col-md-4">
            <FormField label="Website" v-model="club.lienHe.website" />
          </div>
        </div>
      </FormSection>

      <!-- Thông tin sân nhà -->
      <FormSection title="Thông tin sân nhà" icon="building">
        <div class="row g-3">
          <div class="col-md-6">
            <FormField label="Tên sân" v-model="club.sanNha.ten" />
          </div>
          <div class="col-md-6">
            <FormField
              label="Sức chứa"
              type="number"
              v-model="club.sanNha.sucChua"
            />
          </div>
          <div class="col-12">
            <FormField label="Địa chỉ sân" v-model="club.sanNha.diaChi" />
          </div>
        </div>
      </FormSection>

      <!-- Thông tin bổ sung -->
      <FormSection title="Thông tin bổ sung" icon="quote">
        <div class="mb-3">
          <FormField label="Slogan" v-model="club.slogan" />
        </div>
        <div class="mb-3">
          <FormField
            label="Mô tả"
            type="textarea"
            v-model="club.moTa"
            rows="3"
          />
        </div>
      </FormSection>

      <!-- Nhà tài trợ -->
      <FormSection title="Nhà tài trợ" icon="people-fill">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span
            v-for="(sponsor, index) in club.nhaTaiTro"
            :key="index"
            class="badge rounded-pill bg-primary px-3 py-2"
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
          <button class="btn btn-primary" type="button" @click="addSponsor">
            <i class="bi bi-plus-circle"></i>
          </button>
        </div>
      </FormSection>

      <!-- Logo -->
      <FormSection title="Logo câu lạc bộ" icon="image">
        <div class="d-flex align-items-center gap-3">
          <input
            type="file"
            class="form-control"
            @change="handleLogoUpload"
            accept="image/*"
            ref="fileInput"
          />
          <div v-if="logoPreview" class="logo-preview">
            <img :src="logoPreview" alt="Logo Preview" class="border rounded" />
            <small class="text-muted d-block mt-1">Preview</small>
          </div>
          <div v-else-if="club.logo" class="logo-preview">
            <img :src="club.logo" alt="Current Logo" class="border rounded" />
            <small class="text-muted d-block mt-1">Current</small>
          </div>
        </div>
      </FormSection>

      <!-- Nút hành động -->
      <div class="text-end">
        <SubmitButton :loading="loading" :disabled="loading">
          {{ loading ? "Đang lưu..." : "Lưu thay đổi" }}
        </SubmitButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { uploadToCloudinary } from "@/config/cloudinary.conf";
// Reactive data
const club = ref(createEmptyClub());
const loading = ref(false);
const message = ref("");
const newSponsor = ref("");
const logoPreview = ref("");
const fileInput = ref(null);

// Computed properties
const getLogoUrl = computed(() => {
  return logoPreview.value || club.value.logo || "/default-logo.png";
});

const messageType = computed(() => {
  return message.value.includes("✅") ? "alert-success" : "alert-danger";
});

// Utility functions
function createEmptyClub() {
  return {
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
    _id: "",
  };
}

function isFileObject(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    "name" in obj &&
    "size" in obj &&
    "type" in obj
  );
}

// API functions
async function fetchClubData() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/caulacbo/`
    );

    const data =
      Array.isArray(res.data) && res.data.length > 0
        ? res.data[0]
        : res.data || {};

    club.value = { ...createEmptyClub(), ...data };
  } catch (error) {
    console.error("Lỗi fetch club:", error);
    message.value = "❌ Không thể tải thông tin câu lạc bộ.";
  }
}

async function updateClubData() {
  try {
    let logoUrl = club.value.logo;

    // Upload new logo if exists
    if (isFileObject(club.value.logo)) {
      logoUrl = await uploadToCloudinary(club.value.logo);
    }

    const updateData = {
      ...club.value,
      logo: logoUrl,
    };

    // Remove _id from payload if not needed by server
    delete updateData._id;

    await axios.put(
      `${import.meta.env.VITE_API_BE_BASE_URL}/caulacbo/${club.value._id}`,
      updateData
    );

    return true;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

// Event handlers
const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      message.value = "❌ Vui lòng chọn file ảnh";
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.value = "❌ File ảnh không được vượt quá 5MB";
      return;
    }

    club.value.logo = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  // Validation
  if (!club.value.ten?.trim()) {
    message.value = "❌ Vui lòng nhập tên câu lạc bộ";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    await updateClubData();
    message.value = "✅ Cập nhật thông tin thành công!";

    // Reset file input and preview
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    logoPreview.value = "";
  } catch (error) {
    message.value =
      "❌ Có lỗi khi cập nhật: " +
      (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const addSponsor = () => {
  const sponsor = newSponsor.value.trim();
  if (sponsor) {
    club.value.nhaTaiTro.push(sponsor);
    newSponsor.value = "";
  }
};

const removeSponsor = (index) => {
  club.value.nhaTaiTro.splice(index, 1);
};

// Lifecycle
onMounted(() => {
  fetchClubData();
});
</script>

<style scoped>
.text-primary {
  color: #8b2c31 !important;
}

.bg-primary {
  background-color: #8b2c31 !important;
}

.btn-primary {
  background-color: #8b2c31;
  border-color: #8b2c31;
}

.btn-primary:hover {
  background-color: #7a2529;
  border-color: #7a2529;
}

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

.logo-preview img {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.badge {
  font-size: 0.875rem;
}
</style>

<!-- Components -->
<script>
// Form Section Component
const FormSection = {
  props: ["title", "icon"],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-bottom fw-bold text-primary">
        <i class="bi" :class="'bi-' + icon" class="me-2"></i>{{ title }}
      </div>
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  `,
};

// Form Field Component
const FormField = {
  props: ["label", "modelValue", "type", "required", "readonly", "rows"],
  emits: ["update:modelValue"],
  computed: {
    inputType() {
      return this.type || "text";
    },
  },
  template: `
    <div>
      <label class="form-label" :class="{ 'text-danger': required }">
        {{ label }}
      </label>
      <input
        v-if="inputType !== 'textarea'"
        :type="inputType"
        class="form-control"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :readonly="readonly"
      >
      <textarea
        v-else
        class="form-control"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :readonly="readonly"
        :rows="rows"
      ></textarea>
    </div>
  `,
};

// Submit Button Component
const SubmitButton = {
  props: ["loading", "disabled"],
  template: `
    <button
      type="submit"
      class="btn btn-primary px-4 py-2"
      :disabled="disabled"
    >
      <i class="bi" :class="loading ? 'bi-arrow-repeat' : 'bi-save'" class="me-1"></i>
      <slot></slot>
    </button>
  `,
};
</script>
