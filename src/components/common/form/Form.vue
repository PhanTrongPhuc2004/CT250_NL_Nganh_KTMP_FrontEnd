<script setup>
import { onMounted, reactive, watch } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./form.module.scss";
import { useUserStore } from "@/stores/userStore";

const cx = classNames.bind(styles);

const props = defineProps({
  inputFields: Array,
  ortherData: Object,
  inputData: Object,
  method: { type: String, default: "POST" },
  api: String,
  formName: String,
  vaiTro: String,
  modalId: String,
});
const formData = reactive({});

// 🔹 Khi form render hoặc inputData thay đổi, copy dữ liệu vào formData
const initFormData = () => {
  console.log(
    "Initializing form data with inputData:",
    props.inputData,
    "and muaGiaiId",
    props.ortherData?.muaGiaiId
  );
  props.inputFields.forEach((field) => {
    let value = props.inputData?.[field.name] ?? "";

    // ✅ Nếu là kiểu ngày, thì format lại để input[type="date"] hiểu
    if (
      field.type === "date" &&
      typeof value === "string" &&
      value.includes("T")
    ) {
      value = value.split("T")[0];
    }

    formData[field.name] = value;
  });

  // ✅ Giữ lại các field không nằm trong inputFields
  if (props.inputData?._id) {
    formData._id = props.inputData._id;
  }
  if (props.inputData?.vaiTro) {
    formData.vaiTro = props.inputData.vaiTro;
  }
};

onMounted(initFormData);
// 🔹 Nếu inputData thay đổi (ví dụ khi chọn “Sửa” user khác)
watch(
  () => props.inputData,
  () => initFormData(),
  { deep: true, immediate: true }
);

const handleSubmit = async () => {
  console.log("Submitting form with data:", {
    ...formData,
    ...props.ortherData,
  });
  try {
    const response = await axios({
      url: props.api,
      method: props.method.toLowerCase(),
      data: { ...formData, ...props.ortherData },
      withCredentials: true,
    });
    if (props.formName == "Đăng nhập") window.location.reload();
    const modalElement = document.getElementById(props.modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  } catch (error) {
    alert("Có lỗi xảy ra");
    console.error(error);
  }
};
</script>

<template>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <form
        @submit.prevent="handleSubmit"
        :class="[
          cx('form-container'),
          inputFields.length > 8 ? cx('scrollable-form') : '',
        ]"
      >
        <h2 :class="cx('form-name')">{{ formName }}</h2>
        <div
          v-for="(field, index) in inputFields"
          :key="index"
          :class="cx('form-group')"
        >
          <label :for="field.name">{{ field.label }}</label>
          <input
            v-if="!field.children"
            v-model="formData[field.name]"
            :id="field.name"
            :name="field.name"
            :type="field.type || 'text'"
            :step="field.step ? field.step : null"
            :class="cx('form-control')"
            required
          />
          <select
            v-else
            v-model="formData[field.name]"
            :id="field.name"
            :name="field.name"
            :class="cx('form-control')"
            required
          >
            <option
              v-for="(child, cIndex) in field.children.value"
              :key="cIndex"
              :value="child._id ? child._id : child.name"
            >
              {{ child.name }}
            </option>
          </select>
        </div>
        <button type="submit" :class="cx('btn-submit')">Gửi</button>
      </form>
    </div>
  </div>
  <slot />
</template>
