<script setup>
import { onMounted, reactive, watch } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./form.module.scss";
import { uploadToCloudinary } from "@/config/cloudinary.conf";

const emit = defineEmits(["submitted", "updated", "deleted", "closed"]); // ✅ thêm "closed"

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

// ✅ Khởi tạo dữ liệu form
const initFormData = () => {
  console.log("form data nhan duoc truoc khi init", props.inputData);
  if (!props.inputFields) return;
  props.inputFields.forEach((field) => {
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

  console.log("formData sau khi init", formData);

  if (props.inputData?._id) formData._id = props.inputData._id;
};

onMounted(() => initFormData());

watch(
  () => props.inputData,
  () => initFormData(),
  { deep: true, immediate: true }
);

// ✅ Submit form
const handleSubmit = async () => {
  try {
    const payload = { ...formData, ...props.ortherData };
    if ("_id" in payload) delete payload._id;

    const id = props.inputData?._id;
    let url = props.api;
    console.log("data gui di", { ...formData, ...props.ortherData });
    if (!id) url = props.api;

    let imageUrl = "";
    if (payload.anhMinhHoa) {
      imageUrl = await uploadToCloudinary(payload.anhMinhHoa);
    }

    const response = await axios({
      url,
      method: props.method.toLowerCase(),
      data: { ...payload, anhMinhHoa: imageUrl },
      withCredentials: true,
    });
    if (props.formName == "Đăng nhập") {
      window.location.reload();
    }
    if (props.method === "POST") emit("submitted", response.data);
    if (["PUT", "PATCH"].includes(props.method)) emit("updated", response.data);
    if (props.method === "DELETE") emit("deleted", { _id: formData._id });

    // ✅ tự đóng form sau khi submit thành công
    handleClose();
    emit("closed");
  } catch (error) {
    console.error(error);
    alert("Có lỗi xảy ra khi gửi form!");
  }
};

// ✅ Nhấn nút X để đóng
const handleClose = () => {
  emit("closed");
};

// ✅ Trả danh sách con
const getChildren = (field) => {
  if (!field.children) return [];
  return field.children.value !== undefined
    ? field.children.value
    : field.children;
};
</script>

<template>
  <!-- Overlay phủ toàn màn hình -->
  <div
    class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
    style="z-index: 1050"
  >
    <!-- Khung form chính -->
    <div
      class="modal-content shadow-lg p-4 rounded-4 bg-white w-50"
      style="min-width: 500px; max-height: 90vh; overflow-y: auto"
    >
      <button
        type="button"
        class="btn-close position-absolute top-0 end-0 m-3"
        aria-label="Close"
        @click="handleClose"
      ></button>

      <h2 class="text-center mb-4 fw-bold">{{ formName }}</h2>

      <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3">
        <div v-for="(field, index) in inputFields" :key="index" class="mb-2">
          <label :for="field.name" class="form-label fw-semibold">{{
            field.label
          }}</label>

          <!-- Input text -->
          <input
            v-if="!['file', 'select', 'array'].includes(field.type)"
            v-model="formData[field.name]"
            :id="field.name"
            :type="field.type || 'text'"
            :step="field.step || null"
            class="form-control"
            required
          />

          <!-- Input file -->
          <input
            v-else-if="field.type === 'file'"
            type="file"
            accept="image/*"
            class="form-control"
            @change="(e) => (formData[field.name] = e.target.files[0])"
          />

          <!-- Select -->
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

          <!-- Array input -->
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
        </div>

        <button type="submit" class="btn btn-danger w-100 mt-2">Gửi</button>
      </form>
    </div>
  </div>
</template>
