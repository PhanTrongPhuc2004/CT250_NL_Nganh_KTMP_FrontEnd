import { defineStore } from "pinia";
import { ref } from "vue";

export const useFormStore = defineStore("formStore", () => {
  const isOpen = ref(false);
  const currentForm = ref("");
  const formData = ref({}); // 👉 lưu dữ liệu truyền vào form

  function openForm(name, data = {}) {
    currentForm.value = name;
    formData.value = { ...data }; // copy để tránh tham chiếu
    isOpen.value = true;
  }

  function closeForm() {
    currentForm.value = "";
    formData.value = {};
    isOpen.value = false;
  }

  function isCurrent(name) {
    return currentForm.value === name && isOpen.value;
  }

  return { openForm, closeForm, isCurrent };
});
