<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <button
        class="btn btn-primary"
        @click="formStore.openForm('Thêm đội hình')"
      >
        <FontAwesomeIcon icon="fa-solid fa-plus"></FontAwesomeIcon>
        Thêm đội hình
      </button>
    </div>

    <div class="pt-3 mt-4 border-top">
      <h4 class="text-secondary mb-3">Danh sách đội hình</h4>

      <!-- Danh sách đội hình -->
      <div v-for="(squad, index) in squads" :key="squad._id">
        <PlayerCard type="squad" :item="squad" @updated="fetchDoiHinh" />
      </div>

      <!--Form them doi hinh-->
      <Form
        v-if="formStore.isCurrent('Thêm đội hình')"
        :input-fields="squadFields"
        form-name="Thêm đội hình"
        :api="formAction.add.api"
        :method="formAction.add.method"
        :orther-data="{ cauLacBoId }"
      />
      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import axios from "axios";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import Form from "@/components/common/form/Form.vue";
import { useFormStore } from "@/stores/formStore";
import { fetchClubInfo } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const clubInfor = ref([]);
const squads = ref([]);
const formStore = useFormStore();
const squadFields = [{ name: "doiHinh", label: "Tên đội hình", type: "text" }];
const errorMessage = ref("");

const ortherData = reactive({
  cauLacBoId: null,
});

const fetchDoiHinh = async () => {
  try {
    const res = await axios.get("http://localhost:5000/doihinh");
    squads.value = res.data;
  } catch (err) {
    console.error("Lỗi fetch đội hình:", err);
  }
};

const formAction = {
  add: {
    api: `http://localhost:5000/doihinh/`,
    method: "post",
  },
};

const onAddError = (err) => {
  console.error("Lỗi thêm đội hình:", err);
  errorMessage.value = "Không thể thêm đội hình. Vui lòng thử lại!";
};

onMounted(async () => {
  await fetchDoiHinh();
  clubInfor.value = await fetchClubInfo();
});

const cauLacBoId = computed(() => {
  return clubInfor.value?.[0]?._id || null;
});

const goBack = () => {
  window.history.back();
};
</script>
