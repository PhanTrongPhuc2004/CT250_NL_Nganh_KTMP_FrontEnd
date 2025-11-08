<!-- src/components/common/form/TrainingForm.vue -->
<template>
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-lg">
            <div class="modal-content border-0 shadow">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">{{ mode === 'add' ? 'Thêm lịch tập' : 'Chỉnh sửa lịch tập' }}</h5>
                    <button type="button" class="btn-close btn-close-white" @click="$emit('closed')"></button>
                </div>
                <form @submit.prevent="submitForm">
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label small fw-medium">Địa điểm</label>
                                <input type="text" class="form-control form-control-sm" v-model="form.diaDiem"
                                    required />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-medium">Ngày tập</label>
                                <input type="date" class="form-control form-control-sm" v-model="form.ngayBatDau"
                                    required />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-medium">Thời gian</label>
                                <input type="text" class="form-control form-control-sm" v-model="form.thoiGian"
                                    placeholder="08:00 - 10:00" required />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-medium">Đội hình</label>
                                <select class="form-select form-select-sm" v-model="form.maDoiHinh" required>
                                    <option value="">Chọn đội hình</option>
                                    <option v-for="dh in doiHinhList" :key="dh._id" :value="dh.maDoiHinh">
                                        {{ dh.tenDoiHinh }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-medium">Nội dung (tùy chọn)</label>
                                <textarea class="form-control form-control-sm" v-model="form.noiDung" rows="3"
                                    placeholder="Chiến thuật, thể lực..."></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-secondary" @click="$emit('closed')">Hủy</button>
                        <button type="submit" class="btn btn-sm text-white" style="background-color: #8b2c31"
                            :disabled="submitting">
                            <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
                            {{ mode === 'add' ? 'Thêm' : 'Cập nhật' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';

const props = defineProps(['mode', 'initial-data', 'api', 'method']);
const emit = defineEmits(['success', 'closed']);

const form = ref({ ...props.initial - data });
const submitting = ref(false);
const doiHinhList = ref([]);

const fetchDoiHinh = async () => {
    const res = await axios.get('/doihinh');
    doiHinhList.value = res.data;
};

const submitForm = async () => {
    submitting.value = true;
    try {
        const res = await axios[props.method.toLowerCase()](props.api, form.value);
        emit('success', res.data);
        emit('closed');
    } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
        submitting.value = false;
    }
};

onMounted(fetchDoiHinh);
</script>