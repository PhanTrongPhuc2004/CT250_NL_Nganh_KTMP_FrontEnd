<!-- src/pages/user/ticketPurchase/components/BuyTicketModal.vue -->
<template>
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6)" @click.self="$emit('close')">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title fw-bold"><i class="bi bi-cart-check"></i> Xác nhận đặt vé</h5>
                    <button class="btn-close btn-close-white" @click="$emit('close')"></button>
                </div>
                <div class="modal-body py-4">
                    <div class="text-center mb-4">
                        <h4 class="text-danger">{{ matchInfo.doiNha?.tenDoiBong || matchInfo.doiNha }} vs {{
                            matchInfo.doiKhach?.tenDoiBong || matchInfo.doiKhach }}</h4>
                        <p class="text-muted">
                            <i class="bi bi-calendar-event"></i> {{ formatFullDate(matchInfo.ngayBatDau) }}
                            • {{ matchInfo.sanVanDong }}
                        </p>
                    </div>

                    <hr>

                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Loại vé</label>
                            <div class="p-3 bg-light rounded">
                                <span :class="getLoaiVeBadgeClass(config.loaiVe)" class="fs-6">
                                    {{ formatLoaiVe(config.loaiVe) }}
                                </span>
                                <p class="mb-0 mt-2">Khu vực: <strong>{{ config.khuVuc }} - Hàng {{ config.hangGhe
                                        }}</strong></p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Số lượng vé</label>
                            <input type="number" v-model.number="quantity" min="1" :max="config.soGheConLai"
                                class="form-control form-control-lg text-center" />
                            <small class="text-muted">Còn lại: {{ config.soGheConLai }} vé</small>
                        </div>
                    </div>

                    <div class="alert alert-info mt-4 text-center py-4">
                        <h5>Tổng tiền: <span class="text-danger fw-bold">{{ formatCurrency(totalPrice) }}</span></h5>
                    </div>
                </div>
                <div class="modal-footer justify-content-center gap-3">
                    <button class="btn btn-lg btn-outline-secondary px-5" @click="$emit('close')">Hủy</button>
                    <button class="btn btn-lg btn-danger px-5" @click="buyTickets"
                        :disabled="loading || quantity < 1 || quantity > config.soGheConLai">
                        <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                        {{ loading ? 'Đang xử lý...' : 'Thanh toán ngay' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "@/utils/axios";

const props = defineProps({
    config: Object,
    matchInfo: Object,
});

const emit = defineEmits(["close", "success"]);

const quantity = ref(1);
const loading = ref(false);

const totalPrice = computed(() => props.config.giaVe * quantity.value);

const buyTickets = async () => {
    if (quantity.value > props.config.soGheConLai) return alert("Không đủ vé!");

    loading.value = true;
    try {
        // Gọi API mua nhiều vé
        await axios.post("/ve/mua-nhieu", {
            maTranDau: props.matchInfo.maTranDau,
            maCauHinhVe: props.config._id,
            soLuong: quantity.value
        });
        alert(`Mua thành công ${quantity.value} vé!`);
        emit("success");
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi hệ thống");
    } finally {
        loading.value = false;
    }
};

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatFullDate = (d) => new Date(d).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' });

const getLoaiVeBadgeClass = (v) => {
    const map = { VIP: 'badge bg-danger', Thuong: 'badge bg-primary', KhuyenMai: 'badge bg-warning text-dark' };
    return map[v] || 'badge bg-secondary';
};

const formatLoaiVe = (v) => v === 'Thuong' ? 'Thường' : v === 'KhuyenMai' ? 'Khuyến mãi' : v;
</script>