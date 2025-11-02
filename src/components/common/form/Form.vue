<script setup>
import { onMounted, reactive, watch } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./form.module.scss";
import { useUserStore } from "@/stores/userStore";
import { useFormStore } from "@/stores/formStore";
import { uploadToCloudinary } from "@/config/cloudinary.conf";

const cx = classNames.bind(styles);
const formStore = useFormStore();

const props = defineProps({
  inputFields: {
    type: Array,
    default: () => [],
  },
  ortherData: Object,
  inputData: Object,
  method: { type: String, default: "POST" },
  api: String,
  formName: String,
  vaiTro: String,
  modalId: String,
});

const formData = reactive({});

// ✅ Khi form render hoặc inputData thay đổi, copy dữ liệu vào formData
const initFormData = () => {
  if (!props.inputFields || !Array.isArray(props.inputFields)) {
    console.warn("⚠️ inputFields chưa được truyền hoặc không hợp lệ!");
    return;
  }

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

  if (props.inputData?._id) formData._id = props.inputData._id;
  if (props.inputData?.vaiTro) formData.vaiTro = props.inputData.vaiTro;
};

onMounted(() => {
  if (props.inputFields) initFormData();
  console.log("api gui di", props.api);
});

// ✅ Watch chỉ chạy khi có inputFields
watch(
  () => props.inputData,
  () => {
    if (props.inputFields) initFormData();
  },
  { deep: true, immediate: true }
);

const handleSubmit = async () => {
  console.log("props.api khi submit:", props.api);

  if (!props.api) {
    alert("API chưa được truyền vào Form component!");
    return;
  }
  try {
    const payload = { ...formData, ...props.ortherData };
    if ("_id" in payload) delete payload._id;

    // Lấy id từ props.inputData thay vì giữ sẵn trong props.api
    const id = props.inputData?._id;
    let url = `${props.api.split("/").slice(0, -1).join("/")}/${id}`;
    if (!id) url = props.api;
    let imageUrl = "";
    if (payload.anhMinhHoa) {
      imageUrl = await uploadToCloudinary(payload.anhMinhHoa);
    }
    console.log(
      "payload gui di",
      { ...payload, anhMinhHoa: imageUrl },
      "api",
      url
    );
    const response = await axios({
      url,
      method: props.method.toLowerCase(),
      data: { ...payload, anhMinhHoa: imageUrl },
      withCredentials: true,
    });
    if (props.formName == "Đăng nhập") {
      window.location.reload();
    }
    formStore.closeForm();
  } catch (error) {
    alert("Có lỗi xảy ra");
    console.error(error);
  }
};

const handleClose = () => {
  formStore.closeForm();
};

// ✅ Helper function unwrap children ref
const getChildren = (field) => {
  if (!field.children) return [];
  return field.children.value !== undefined
    ? field.children.value
    : field.children;
};
</script>

<template>
  <div class="modal-dialog modal-dialog-centered position-relative">
    <div class="modal-content">
      <!-- 🔹 Nút đóng form -->

      <form
        @submit.prevent="handleSubmit"
        :class="[
          cx('form-container'),
          inputFields.length > 8 ? cx('scrollable-form') : '',
        ]"
      >
        <button
          type="button"
          class="btn-close position-absolute top-0 end-0 m-3"
          style="z-index: 100"
          aria-label="Close"
          @click="handleClose"
        ></button>
        <h2 :class="cx('form-name')">{{ formName }}</h2>

        <div
          v-for="(field, index) in inputFields"
          :key="index"
          :class="cx('form-group')"
        >
          <label :for="field.name">{{ field.label }}</label>

          <input
            v-if="
              field.type !== 'file' &&
              field.type !== 'select' &&
              field.type !== 'array'
            "
            v-model="formData[field.name]"
            :id="field.name"
            :name="field.name"
            :type="field.type || 'text'"
            :step="field.step ? field.step : null"
            :class="cx('form-control')"
            required
          />
          <input
            v-if="field.type === 'file'"
            type="file"
            accept="image/*"
            @change="(e) => (formData[field.name] = e.target.files[0])"
          />

          <select
            v-if="field.type == 'select'"
            v-model="formData[field.name]"
            :id="field.name"
            :name="field.name"
            :class="cx('form-control')"
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

          <div v-if="field.type === 'array'" class="d-flex gap-2">
            <input
              v-for="(team, index) in formData[field.name]"
              :key="index"
              v-model="formData[field.name][index]"
              type="text"
              class="form-control"
              :placeholder="`Đội ${index + 1}`"
            />
          </div>
        </div>

        <button type="submit" :class="cx('btn-submit')">Gửi</button>
      </form>
    </div>
  </div>
  <slot />
</template>
