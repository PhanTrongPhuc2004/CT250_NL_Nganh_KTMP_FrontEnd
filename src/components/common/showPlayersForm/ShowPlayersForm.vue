<template>
  <div
    class="card border-0 shadow-sm position-absolute top-50 start-50 translate-middle col-md-7"
  >
    <div class="position-absolute top-0 end-0 p-2">
      <FontAwesomeIcon icon="fa-solid fa-close" />
    </div>

    <div class="card-body p-0">
      <table class="table align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th class="text-center" style="width: 40px">#</th>
            <th>Họ và tên</th>
            <th>Vai trò</th>
            <th class="text-center" style="width: 160px">Đội hình</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in items" :key="user._id">
            <td class="text-center text-muted">{{ index + 1 }}</td>
            <td class="fw-semibold">{{ user.hoVaTen }}</td>
            <td>
              <span class="badge bg-light text-dark border small px-2 py-1">
                {{ user.vaiTro }}
              </span>
            </td>
            <td class="text-center">
              <div class="me-4">
                <select
                  v-model="user.doiHinhId"
                  class="form-select form-select-sm"
                  @change="
                    (e) => {
                      user.doiHinhId = e.target.value;
                      console.log(user.doiHinhId);
                      console.log('danhs ach cau thu', props.items);
                    }
                  "
                >
                  <option value="">-- Chọn đội hình --</option>
                  <option
                    v-for="squad in squads"
                    :key="squad._id"
                    :value="squad._id"
                  >
                    {{ squad.name }}
                  </option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-end p-2">
      <button class="btn btn-primary me-3" @click="handleSubmit">
        Xác nhận
      </button>
    </div>
  </div>
</template>

<script setup>
import { fetchSquad } from "@/utils";
import { ref, onMounted } from "vue";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const squads = ref([]);

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

onMounted(async () => {
  squads.value = await fetchSquad();
});

const handleSubmit = async () => {
  try {
    const response = await axios.put("http://localhost:5000/nguoidung", {
      data: props.items,
    });
    console.log(response);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật:", error);
    alert("Có lỗi xảy ra khi cập nhật đội hình!");
  }
};
</script>
