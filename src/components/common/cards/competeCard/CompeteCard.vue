<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  compete: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["view", "edit", "delete"]);

const handleView = () => emits("view", props.compete);
const handleEdit = () => emits("edit", props.compete);
const handleDelete = () => emits("delete", props.compete._id);
</script>

<template>
  <div class="card compete-card shadow-sm mb-3">
    <div class="card-body">
      <h5 class="card-title text-primary fw-bold">
        {{ compete.tenGiaiDau }}
      </h5>

      <p class="card-text text-muted mb-1" v-if="compete.moTa">
        {{ compete.moTa }}
      </p>

      <small v-if="compete.muaGiaiId" class="text-secondary">
        Mùa giải:
        {{ compete.muaGiaiId.namBatDau }} - {{ compete.muaGiaiId.namKetThuc }}
      </small>

      <div class="mt-3 d-flex gap-2 flex-wrap">
        <button class="btn btn-outline-primary btn-sm" @click="handleView">
          <i class="bi bi-eye"></i> Xem
        </button>
        <button class="btn btn-outline-warning btn-sm" @click="handleEdit">
          <i class="bi bi-pencil"></i> Sửa
        </button>
        <button class="btn btn-outline-danger btn-sm" @click="handleDelete">
          <i class="bi bi-trash"></i> Xóa
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compete-card {
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.compete-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
