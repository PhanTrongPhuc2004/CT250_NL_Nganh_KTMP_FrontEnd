import { defineStore } from "pinia";
import { ref } from "vue";

export const useFormStore = defineStore("formStore", () => {
  const isOpen = ref(false);
  const currentForm = ref("");
  const formData = ref({});
  const refreshSquads = ref(false); // 🆕 Thêm state để trigger refresh
  const refreshPlayers = ref(false); // 🆕 Có thể dùng cho các component khác

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

  // 🆕 THÊM CÁC FUNCTION MỚI
  function triggerRefreshSquads() {
    console.log("🔄 Store: Trigger refresh squads");
    refreshSquads.value = true;
  }

  function clearRefreshSquads() {
    console.log("🔄 Store: Clear refresh squads");
    refreshSquads.value = false;
  }

  function triggerRefreshPlayers() {
    console.log("🔄 Store: Trigger refresh players");
    refreshPlayers.value = true;
  }

  function clearRefreshPlayers() {
    console.log("🔄 Store: Clear refresh players");
    refreshPlayers.value = false;
  }

  // 🆕 Reset tất cả refresh states
  function clearAllRefresh() {
    refreshSquads.value = false;
    refreshPlayers.value = false;
  }

  return {
    isOpen,
    currentForm,
    formData,
    refreshSquads, // 🆕 Export refresh states
    refreshPlayers, // 🆕 Export refresh states
    openForm,
    closeForm,
    isCurrent,
    triggerRefreshSquads, // 🆕 Export new functions
    clearRefreshSquads,
    triggerRefreshPlayers,
    clearRefreshPlayers,
    clearAllRefresh,
  };
});
