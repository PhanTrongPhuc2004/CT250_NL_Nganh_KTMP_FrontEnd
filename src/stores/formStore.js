import { defineStore } from "pinia";
import { ref } from "vue";

export const useFormStore = defineStore("formStore", () => {
  const isOpen = ref(false);
  const currentForm = ref("");
  const formData = ref({});

  function closeForm() {
    currentForm.value = "";
    formData.value = {};
    isOpen.value = false;
  }
  function openForm(name, data = {}) {
    console.log("🟢 Mở form:", name, data);
    currentForm.value = name;
    formData.value = { ...data };
    isOpen.value = true;
  }

  function isCurrent(name) {
    console.log("🧩 Kiểm tra form:", name, currentForm.value, isOpen.value);
    return currentForm.value === name && isOpen.value;
  }

  // 🟢 Bổ sung currentForm và isOpen vào return
  return { isOpen, currentForm, formData, openForm, closeForm, isCurrent };
});
