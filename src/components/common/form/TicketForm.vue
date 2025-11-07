<script setup>
import { ref, watch } from "vue";
import axios from "@/utils/axios";

const props = defineProps({
    mode: String,
    initialData: Object,
    api: String,
    method: String,
});

const emit = defineEmits(["success", "closed"]);

const formData = ref({ ...props.initialData });
const isSubmitting = ref(false);

const loaiVeOptions = [
    { value: "VIP", label: "VIP" },
    { value: "Thường", label: "Thường" },
    { value: "Khán đài A", label: "Khán đài A" },
    { value: "Khán đài B", label: "Khán đài B" },
];

watch(
    () => props.initialData,
    (newData) => {
        formData.value = { ...newData };
    },
    { deep: true }
);

const submit = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        const payload = { ...formData.value };
        if (payload._id) delete payload._id;

        const res = await axios({
            url: props.api,
            method: props.method.toLowerCase(),
            data: payload,
        });

        emit("success", res.data);
        handleClose();
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi lưu");
    } finally {
        isSubmitting.value = false;
    }
};

const handleClose = () => {
    emit("closed");
};
</script>

<template>
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)" @click.self="handleClose">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ mode === "add" ? "Thêm cấu hình vé" : "Chỉnh sửa cấu hình vé" }}
                    </h5>
                    <button type="button" class="btn-close" @click="handleClose"></button>
                </div>

                <form @submit.prevent="submit">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Loại vé</label>
                            <select v-model="formData.loaiVe" class="form-select" required>
                                <option v-for="opt in loaiVeOptions" :key="opt.value" :value="opt.value">
                                    {{ opt.label }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Khu vực</label>
                            <input v-model="formData.khuVuc" type="text" class="form-control"
                                placeholder="VD: A, B, C..." required />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Hàng ghế</label>
                            <input v-model="formData.hangGhe" type="text" class="form-control"
                                placeholder="VD: 1, 2, VIP..." required />
                        </div>

                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">Số ghế bắt đầu</label>
                                <input v-model.number="formData.soGheBatDau" type="number" min="1" class="form-control"
                                    required />
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">Số ghế kết thúc</label>
                                <input v-model.number="formData.soGheKetThuc" type="number" min="1" class="form-control"
                                    required />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Giá vé (VNĐ)</label>
                            <input v-model.number="formData.giaVe" type="number" min="0" step="10000"
                                class="form-control" required />
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="handleClose">
                            Hủy
                        </button>
                        <button type="submit" class="btn btn-danger" :disabled="isSubmitting">
                            {{ isSubmitting ? "Đang lưu..." : "Lưu" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>