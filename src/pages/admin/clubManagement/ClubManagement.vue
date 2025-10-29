<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./ClubManagement.module.scss";

const cx = classNames.bind(styles);

const club = ref({
  ten: "",
  namThanhLap: "",
  diaChi: "",
  lienHe: {
    email: "",
    soDienThoai: "",
    website: "",
  },
  moTa: "",
  logo: "",
  sanNha: {
    ten: "",
    diaChi: "",
    sucChua: "",
  },
});

const loading = ref(false);
const message = ref("");

// 🧩 Lấy thông tin câu lạc bộ (giả sử chỉ có 1 CLB)
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/caulacbo/");
    const data = Array.isArray(res.data) ? res.data[0] : res.data; // nếu API trả mảng thì lấy phần tử đầu
    club.value = {
      ...club.value,
      ...data,
      lienHe: { ...club.value.lienHe, ...(data.lienHe || {}) },
      sanNha: { ...club.value.sanNha, ...(data.sanNha || {}) },
    };
    console.log("Fetched club data:", club.value);
  } catch (err) {
    console.error(err);
    message.value = "Không thể tải thông tin CLB.";
  }
});

// 🧩 Cập nhật thông tin
const updateClub = async () => {
  loading.value = true;
  message.value = "";
  try {
    await axios.put(
      `http://localhost:5000/caulacbo/${club.value._id}`,
      club.value
    );
    message.value = "✅ Cập nhật thành công!";
  } catch (err) {
    console.error(err);
    message.value = "❌ Lỗi khi cập nhật CLB.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div :class="cx('container')">
    <h2 :class="cx('title')">Quản lý thông tin Câu Lạc Bộ</h2>

    <p v-if="message" :class="cx('message')">{{ message }}</p>

    <form :class="cx('form')" @submit.prevent="updateClub">
      <div :class="cx('field')">
        <label :class="cx('label')">Tên CLB:</label>
        <input v-model="club.ten" :class="cx('input')" required />
      </div>

      <div :class="cx('field')">
        <label :class="cx('label')">Năm thành lập:</label>
        <input
          type="number"
          v-model="club.namThanhLap"
          :class="cx('input')"
          required
        />
      </div>

      <div :class="cx('field')">
        <label :class="cx('label')">Địa chỉ:</label>
        <input v-model="club.diaChi" :class="cx('input')" />
      </div>

      <div :class="cx('field')">
        <label :class="cx('label')">Email:</label>
        <input v-model="club.lienHe.email" :class="cx('input')" />
      </div>

      <div :class="cx('field')">
        <label :class="cx('label')">Số điện thoại:</label>
        <input v-model="club.lienHe.soDienThoai" :class="cx('input')" />
      </div>

      <div :class="cx('field')">
        <label :class="cx('label')">Website:</label>
        <input v-model="club.lienHe.website" :class="cx('input')" />
      </div>

      <div :class="cx('field')">
        <label :class="cx('label')">Mô tả:</label>
        <textarea v-model="club.moTa" :class="cx('textarea')"></textarea>
      </div>

      <div :class="cx('field')">
        <label :class="cx('label')">Logo (URL):</label>
        <input v-model="club.logo" :class="cx('input')" />
        <img
          v-if="club.logo"
          :src="club.logo"
          :class="cx('logo-preview')"
          alt="Logo CLB"
        />
      </div>

      <fieldset :class="cx('fieldset')">
        <legend :class="cx('legend')">Sân nhà</legend>
        <div :class="cx('field')">
          <label :class="cx('label')">Tên sân:</label>
          <input v-model="club.sanNha.ten" :class="cx('input')" />
        </div>
        <div :class="cx('field')">
          <label :class="cx('label')">Địa chỉ sân:</label>
          <input v-model="club.sanNha.diaChi" :class="cx('input')" />
        </div>
        <div :class="cx('field')">
          <label :class="cx('label')">Sức chứa:</label>
          <input
            type="number"
            v-model="club.sanNha.sucChua"
            :class="cx('input')"
          />
        </div>
      </fieldset>

      <button :disabled="loading" :class="cx('button')">
        {{ loading ? "Đang cập nhật..." : "Cập nhật thông tin" }}
      </button>
    </form>
  </div>
</template>
