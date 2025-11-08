<!-- src/pages/user/ticketPurchase/components/MatchSelector.vue -->
<template>
    <div class="p-4">
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label text-danger fw-bold">
                    <i class="bi bi-trophy"></i> Giải đấu
                </label>
                <select class="form-select form-select-sm custom-select" :value="selectedGiaiDau"
                    @change="$emit('update:giaiDau', $event.target.value)">
                    <option value="">Chọn giải đấu</option>
                    <option v-for="gd in giaiDauList" :key="gd._id" :value="gd.maGiaiDau">
                        {{ gd.tenGiaiDau }}
                    </option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label text-danger fw-bold">
                    <i class="bi bi-calendar3"></i> Mùa giải
                </label>
                <select class="form-select form-select-sm custom-select" :value="selectedMuaGiai"
                    @change="$emit('update:muaGiai', $event.target.value)" :disabled="!selectedGiaiDau">
                    <option value="">Chọn mùa giải</option>
                    <option v-for="mg in muaGiaiList" :key="mg._id" :value="mg.maMuaGiai">
                        {{ mg.tenMuaGiai }}
                    </option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label text-danger fw-bold">
                    <i class="bi bi-futbol"></i> Trận đấu
                </label>
                <select class="form-select form-select-sm custom-select" :value="selectedMatch"
                    @change="$emit('update:match', $event.target.value)" :disabled="!selectedMuaGiai">
                    <option value="">Chọn trận đấu</option>
                    <option v-for="td in tranDauList" :key="td._id" :value="td.maTranDau">
                        {{ td.doiNha }} vs {{ td.doiKhach }} - {{ formatDate(td.ngayBatDau) }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    giaiDauList: Array,
    muaGiaiList: Array,
    tranDauList: Array,
    selectedGiaiDau: String,
    selectedMuaGiai: String,
    selectedMatch: String,
});

const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');
</script>

<style scoped>
.custom-select {
    border: 2px solid #E02128 !important;
    border-radius: 8px;
    font-weight: 500;
    background-color: #fdf2f2;
    color: #5a1a1d;
}

.custom-select:focus {
    border-color: #8B2C31 !important;
    box-shadow: 0 0 0 0.25rem rgba(139, 44, 49, 0.25) !important;
    background-color: #fae9e9;
}

.custom-select option {
    background-color: white;
    color: #333;
}

.custom-select option:checked {
    background: linear-gradient(135deg, #E02128, #8B2C31);
    color: white;
}
</style>