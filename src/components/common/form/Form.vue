<!-- /src/components/common/form/Form.vue -->
<script setup>
import { onMounted, reactive, watch, ref } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./form.module.scss";
import { uploadToCloudinary } from "@/config/cloudinary.conf";
import { useFormStore } from "@/stores/formStore";
const formStore = useFormStore();

const emit = defineEmits(["submitted", "updated", "deleted", "closed"]);

const cx = classNames.bind(styles);

const props = defineProps({
  inputFields: Array,
  ortherData: Object,
  inputData: Object,
  method: { type: String, default: "POST" },
  api: String,
  formName: String,
});

const formData = reactive({});
const isSubmitting = ref(false);

// ================= INIT FORM DATA =================
const initFormData = () => {
  console.log(
    "%c=================== FORM INIT ===================",
    "color: blue; font-weight: bold"
  );
  console.log("Input Data:", props.inputData);
  console.log("Other Data:", props.ortherData);
  console.log("API URL:", props.api);
  console.log("Method:", props.method);
  console.log(
    "================================================",
    "color: blue"
  );

  if (!props.inputFields) return;

  // Clear trước khi init
  Object.keys(formData).forEach((key) => delete formData[key]);

  props.inputFields.forEach((field) => {
    // THÊM: Bỏ qua divider và các field không có name
    if (field.type === "divider" || !field.name) {
      console.log(`Bỏ qua field: ${field.label} - type: ${field.type}`);
      return;
    }

    let value = props.inputData?.[field.name] ?? "";

    if (
      field.type === "date" &&
      typeof value === "string" &&
      value.includes("T")
    ) {
      value = value.split("T")[0];
    }

    if (
      field.type === "array" &&
      (!Array.isArray(value) || value.length === 0)
    ) {
      value = ["", ""];
    }

    formData[field.name] = value;
  });

  // Thêm vaiTro nếu có
  if (props.inputData?.vaiTro) {
    formData.vaiTro = props.inputData.vaiTro;
  }

  // Lưu _id để tracking
  if (props.inputData?._id) {
    formData._id = props.inputData._id;
  }

  console.log(
    "%cForm Data sau khi init:",
    "color: green; font-weight: bold",
    formData
  );
};

onMounted(async () => {
  console.log("input field o form", props.inputFields);
  initFormData();
});

watch(
  () => props.inputData?._id,
  (newId) => {
    if (newId) initFormData();
  },
  { immediate: true }
);

watch(
  () => props.api,
  (newApi) => {
    console.log(
      "%cAPI URL changed to:",
      "color: orange; font-weight: bold",
      newApi
    );
  }
);

// ================= HANDLE SUBMIT =================
// TRONG COMPONENT FORM - THÊM DEBUG
const handleSubmit = async () => {
  if (isSubmitting.value) {
    console.warn("Form đang submit, bỏ qua request mới");
    return;
  }

  try {
    isSubmitting.value = true;

    const payload = { ...formData, ...props.ortherData };
    const itemId = props.inputData?._id;

    if ("_id" in payload) delete payload._id;
    const url = props.api;
    if (payload.anhMinhHoa) {
      const img = await uploadToCloudinary(payload.anhMinhHoa);
      payload.anhMinhHoa = img;
    }
    console.log("🔄 Đang gửi form...", {
      url,
      method: props.method,
      payload,
      formName: props.formName,
    });

    // Gửi request
    const response = await axios({
      url,
      method: props.method.toLowerCase(),
      data: payload,
      withCredentials: true,
    });

    console.log("✅ Response nhận được:", response.data);

    // QUAN TRỌNG: Debug emit events
    if (props.method === "POST") {
      console.log("📤 Trigger refresh squads từ store");
      formStore.triggerRefreshSquads();
    } else if (["PUT", "PATCH"].includes(props.method)) {
      console.log("📤 Trigger refresh squads từ store");
      formStore.triggerRefreshSquads();
    }
    if (props.formName == "Đăng nhập") window.location.reload();
    console.log("✅ Store đã được cập nhật");
    handleClose();
  } catch (error) {
    console.error("❌ Lỗi khi submit form:", error);
    const errorMsg =
      error.response?.data?.message || "Có lỗi xảy ra khi gửi form!";
      // console.log("🚨 Hiển thị alert lỗi:", error);
    alert(errorMsg);
    emit("error", error);
  } finally {
    isSubmitting.value = false;
  }
};

// ================= HANDLE CLOSE =================
const handleClose = () => {
  emit("closed");
};

// ================= GET CHILDREN =================
const getChildren = (field) => {
  if (!field.children) return [];
  console.log("chifdren o form ", field.children);
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
      class="modal-content shadow-lg p-4 rounded-4 bg-white w-50"
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
      <div class="alert alert-info small mb-3" v-if="formData._id">
        <strong>Đang chỉnh sửa ID:</strong> {{ formData._id }}<br />
        <strong>API:</strong> {{ api }}<br />
        <strong>Payload hiện tại:</strong>
        <pre>{{ formData }}</pre>
      </div>

      <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3">
        <div v-for="(field, index) in inputFields" :key="index" class="mb-2">
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

          <input
            v-else-if="field.type === 'file'"
            type="file"
            accept="image/*"
            class="form-control"
            @change="(e) => (formData[field.name] = e.target.files[0])"
          />

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
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Đang xử lý..." : "Gửi" }}
        </button>
      </form>
    </div>
  </div>
</template>
