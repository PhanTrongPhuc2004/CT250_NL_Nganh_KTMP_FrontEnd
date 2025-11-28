<!-- /src/components/common/form/Form.vue -->
<script setup>
import { onMounted, reactive, watch, ref } from "vue";
import classNames from "classnames/bind";
import styles from "./form.module.scss";
import { uploadToCloudinary } from "@/config/cloudinary.conf";
import { useFormStore } from "@/stores/formStore";
import instance from "@/utils/axios";
import GoogleLogin from "../GoogleLogin/GoogleLogin.vue";
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();
//debug
const debug = true;
const formStore = useFormStore();
const emit = defineEmits(["submitted", "updated", "deleted", "closed", "error"]);
const cx = classNames.bind(styles);
const allFields = ref([]);

const props = defineProps({
  inputFields: Array,
  ortherData: Object,
  inputData: Object,
  method: { type: String, default: "POST" },
  api: String,
  formName: String,
  ortherFields: Array,
});

const formData = reactive({});
const isSubmitting = ref(false);
const isUploading = ref(false);
const imageUrl = ref(""); // Lưu URL ảnh sau khi upload




// ================= INIT FORM DATA =================
const initFormData = () => {
  if (!props.inputFields) return;

  Object.keys(formData).forEach((key) => delete formData[key]);

  allFields.value = props.ortherFields
    ? [...props.inputFields, ...props.ortherFields]
    : props.inputFields;

  allFields.value.forEach((field) => {
    if (field.type === "divider" || !field.name) return;

    let value = props.inputData?.[field.name] ?? "";

    if (field.type === "date" && typeof value === "string" && value.includes("T")) {
      value = value.split("T")[0];
    }

    if (field.type === "array" && (!Array.isArray(value) || value.length === 0)) {
      value = ["", ""];
    }

    formData[field.name] = value;
  });

  if (props.inputData?.vaiTro) {
    formData.vaiTro = props.inputData.vaiTro;
  }

  if (props.inputData?._id) {
    formData._id = props.inputData._id;
  }

  // Khởi tạo URL ảnh nếu có
  if (props.inputData?.anhMinhHoa) {
    imageUrl.value = props.inputData.anhMinhHoa;
  }
};

onMounted(() => {
  initFormData();
});

watch(
  () => props.inputData?._id,
  (newId) => {
    if (newId) initFormData();
  },
  { immediate: true }
);

// ================= UPLOAD ẢNH RIÊNG =================
const handleImageUpload = async (file) => {
  if (!file) return null;
  
  try {
    isUploading.value = true;
    console.log("🔼 Đang upload ảnh lên Cloudinary...");
    
    const uploadedUrl = await uploadToCloudinary(file);
    console.log("✅ Upload ảnh thành công:", uploadedUrl);
    
    imageUrl.value = uploadedUrl;
    return uploadedUrl;
  } catch (error) {
    console.error("❌ Lỗi upload ảnh:", error);
    alert("Lỗi upload ảnh! Vui lòng thử lại.");
    throw error;
  } finally {
    isUploading.value = false;
  }
};

// ================= XỬ LÝ KHI CHỌN FILE ẢNH =================
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type và size
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file ảnh!');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    alert('Kích thước ảnh không được vượt quá 5MB!');
    return;
  }

  try {
    // Upload ảnh ngay khi chọn file
    await handleImageUpload(file);
    console.log("📸 Ảnh đã được upload và lưu tạm:", imageUrl.value);
  } catch (error) {
    // Reset file input nếu upload thất bại
    event.target.value = '';
  }
};

// ================= HANDLE SUBMIT (KHÔNG GỒM UPLOAD ẢNH) =================
const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    const payload = { ...formData, ...props.ortherData };
    const itemId = props.inputData?._id;

    if ("_id" in payload) delete payload._id;

    // Thêm URL ảnh đã upload vào payload (nếu có)
    if (imageUrl.value) {
      payload.anhMinhHoa = imageUrl.value;
    } else if (payload.anhMinhHoa && typeof payload.anhMinhHoa === 'string') {
      // Giữ lại URL ảnh cũ nếu không có ảnh mới
      payload.anhMinhHoa = payload.anhMinhHoa;
    } else {
      // Nếu không có ảnh, xóa trường này khỏi payload
      delete payload.anhMinhHoa;
    }

    console.log("📤 Payload gửi đi (không gồm upload ảnh):", payload);

    // Xử lý đăng nhập
    if (props.formName === "Đăng nhập") {
      const response = await instance({
        url: props.api,
        method: props.method.toLowerCase(),
        data: payload,
      });
      window.location.reload();
      handleClose();
      return;
    }

    // Gửi API chính (không chờ upload ảnh)
    const response = await instance({
      url: props.api,
      method: props.method.toLowerCase(),
      data: payload,
    });

    console.log("✅ Response nhận được:", response.data);
    
    // Trigger refresh và events
    if (props.method === "POST" || ["PUT", "PATCH"].includes(props.method)) {
      formStore.triggerRefreshSquads();
    }
    
    emit('submitted', response.data);
    handleClose();

  } catch (error) {
    console.error("❌ Lỗi khi submit form:", error);
    const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi gửi form!";
    alert(errorMsg);
    emit("error", error);
  } finally {
    isSubmitting.value = false;
  }
};

// ================= HANDLE CLOSE =================
const handleClose = () => {
  // Reset URL ảnh khi đóng form
  imageUrl.value = "";
  emit("closed");
};

// ================= GET CHILDREN =================
const getChildren = (field) => {
  if (!field.children) return [];
  return field.children.value !== undefined
    ? field.children.value
    : field.children;
};
</script>

<template>
  <div
    class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
    style="z-index: 1050"
    @click.self="handleClose"
  >
    <div
      class="modal-content shadow-lg p-4 rounded-4 bg-white w-25"
      style="min-width: 500px; max-height: 90vh; overflow-y: auto"
      @click.stop
    >
      <button
        type="button"
        class="btn-close position-absolute top-0 end-0 m-3"
        aria-label="Close"
        @click="handleClose"
      ></button>

      <h2 class="text-center mb-4 fw-bold">{{ formName }}</h2>

      <!-- Debug info -->
      <div class="alert alert-info small mb-3" v-if="formData._id && debug">
        <strong>Đang chỉnh sửa ID:</strong> {{ formData._id }}<br />
        <strong>API:</strong> {{ api }}<br />
        <strong>URL ảnh hiện tại:</strong> {{ imageUrl || 'Chưa có ảnh' }}<br />
        <strong>Payload hiện tại:</strong>
        <pre>{{ { ...formData, anhMinhHoa: imageUrl || formData.anhMinhHoa } }}</pre>
      </div>

      <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3">
        <div v-for="(field, index) in allFields" :key="index" class="mb-2">
          <label
            :for="field.name"
            class="form-label fw-semibold"
            v-if="field.type != 'divider'"
            >{{ field.label }}</label
          >

          <input
            v-if="!['file', 'select', 'array', 'divider'].includes(field.type)"
            v-model="formData[field.name]"
            :id="field.name"
            :type="field.type || 'text'"
            :step="field.step || null"
            class="form-control"
            required
          />

          <div v-else-if="field.type === 'file'">
            <input
              type="file"
              accept="image/*"
              class="form-control"
              @change="handleFileChange"
            />
            <div class="mt-2">
              <small class="text-muted" v-if="isUploading">
                ⏳ Đang upload ảnh...
              </small>
              <small class="text-success" v-else-if="imageUrl">
                ✅ Ảnh đã sẵn sàng
              </small>
            </div>
            <!-- Preview ảnh -->
            <div v-if="imageUrl" class="mt-2">
              <img :src="imageUrl" alt="Preview" class="img-thumbnail" style="max-height: 100px;">
            </div>
          </div>

          <select
            v-else-if="field.type === 'select'"
            v-model="formData[field.name]"
            :id="field.name"
            class="form-select"
            required
          >
            <option
              v-for="(child, cIndex) in getChildren(field)"
              :key="cIndex"
              :value="child._id || child.name"
            >
              {{ child.name }}
            </option>
          </select>

          <div v-else-if="field.type === 'array'" class="d-flex gap-2">
            <input
              v-for="(team, i) in formData[field.name]"
              :key="i"
              v-model="formData[field.name][i]"
              type="text"
              class="form-control"
              :placeholder="`Đội ${i + 1}`"
            />
          </div>
          <div
            v-else-if="field.type == 'divider'"
            class="d-flex align-items-center my-4"
          >
            <hr class="flex-grow-1" />
            <span class="px-3 text-muted fw-bold">{{ field.label }}</span>
            <hr class="flex-grow-1" />
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-danger w-100 mt-2"
          :disabled="isSubmitting || isUploading"
        >
          {{ 
            isUploading ? "Đang upload ảnh..." : 
            isSubmitting ? "Đang xử lý..." : "Gửi" 
          }}
        </button>
      </form>
      <div v-if="formName === 'Đăng nhập'" class="mt-4">
    <div class="divider text-center mb-3">
      <span class="bg-white px-3 text-muted">hoặc đăng nhập với</span>
    </div>
    
    <GoogleLogin 
      @success="onGoogleLoginSuccess"
      @error="onGoogleLoginError"
    />
  </div>
    </div>
    
  </div>
  
</template>
<style scoped>
.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #dee2e6;
  z-index: -1;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.875rem;
}
</style>