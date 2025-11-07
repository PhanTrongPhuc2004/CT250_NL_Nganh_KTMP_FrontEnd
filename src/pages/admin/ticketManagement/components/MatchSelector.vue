<!-- src/pages/admin/ticketManagement/components/MatchSelector.vue -->
<script setup>
defineProps(['matches']);
defineEmits(['select']);
</script>

<template>
    <div class="card mb-4">
        <div class="card-body">
            <h5>Chọn trận đấu</h5>
            <select class="form-select" @change="$emit('select', JSON.parse($event.target.value))">
                <option :value="null">--- Chọn trận đấu ---</option>
                <option v-for="m in matches" :key="m.maTranDau" :value="JSON.stringify(m)">
                    {{ m.capDau[0] }} vs {{ m.capDau[1] }} - {{ new Date(m.ngayBatDau).toLocaleString('vi-VN') }}
                </option>
            </select>
        </div>
    </div>
</template>