<script setup>
import { reactive } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./form.module.scss";
import { useUserStore } from "@/stores/userStore";

const cx = classNames.bind(styles);

// Props
const props = defineProps({
  inputFields: {
    type: Array,
    required: true,
  },
  method: {
    type: String,
    default: "POST",
  },
  api: {
    type: String,
    required: true,
  },
  formName: {
    type: String,
    default: "",
  },
  vaiTro: {
    type: String,
    default: "nguoihammo",
  },
});

// Reactive form data
const formData = reactive({});
props.inputFields.forEach((field) => {
  formData[field.name] = "";
});

// Submit
const handleSubmit = async () => {
  console.log(formData);

  try {
    const response = await axios({
      url: props.api,
      method: props.method.toLowerCase(),
      data: { ...formData, vaiTro: props.vaiTro },
      withCredentials: true,
    });
    if (props.formName == "Đăng nhập") {
      window.location.reload();
    }
  } catch (error) {
    alert("Có lỗi xảy ra");
    console.error(error);
  }
};
</script>
<template>
  <form @submit.prevent="handleSubmit" :class="cx('form-container')">
    <h2 :class="cx('form-name')">{{ formName }}</h2>
    <div
      v-for="(field, index) in inputFields"
      :key="index"
      :class="cx('form-group')"
    >
      <label :for="field.name">{{ field.label }}</label>
      <input
        v-model="formData[field.name]"
        :id="field.name"
        :name="field.name"
        :type="field.type || 'text'"
        :class="cx('form-control')"
        required
      />
    </div>
    <button type="submit" :class="cx('btn-submit')">Gửi</button>
  </form>
</template>
