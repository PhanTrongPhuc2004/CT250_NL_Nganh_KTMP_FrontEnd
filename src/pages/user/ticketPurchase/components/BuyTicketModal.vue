<!-- src/pages/user/ticketPurchase/components/BuyTicketModal.vue -->
<template>
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5)" @click.self="$emit('close')">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Xác nhận mua vé</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Trận đấu:</strong> {{ matchInfo.doiNha }} vs {{ matchInfo.doiKhach }}</p>
                    <p><strong>Ngày:</strong> {{ new Date(matchInfo.ngayBatDau).toLocaleDateString('vi-VN') }}</p>
                    <hr>
                    <p><strong>Loại vé:</strong> <span :class="getLoaiVeBadgeClass(config.loaiVe)">{{
                            formatLoaiVe(config.loaiVe) }}</span></p>
                    <p><strong>Khu vực:</strong> {{ config.khuVuc }} | <strong>Hàng:</strong> {{ config.hangGhe }}</p>
                    <p><strong>Số ghế:</strong> {{ selectedSeat }}</p>
                    <p><strong>Giá vé:</strong> <span class="text-success fw-bold">{{ formatCurrency(config.giaVe)
                            }}</span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">Hủy</button>
                    <button type="button" class="btn btn-success" @click="buyTicket" :disabled="loading">
                        {{ loading ? 'Đang xử lý...' : 'Xác nhận mua' }}
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

const loading = ref(false);

// Tìm ghế trống đầu tiên
const selectedSeat = computed(() => {
    const start = props.config.soGheBatDau;
    const end = props.config.soGheKetThuc;
    const sold = props.config.daBan || []; // Cần backend trả về danh sách ghế đã bán
    for (let i = start; i <= end; i++) {
        if (!sold.includes(i.toString())) return i;
    }
    return "Hết ghế";
});

const buyTicket = async () => {
    if (selectedSeat.value === "Hết ghế") return;

    loading.value = true;
    try {
        await axios.post("/ve/mua", {
            maTranDau: props.matchInfo.maTranDau,
            loaiVe: props.config.loaiVe,
            khuVuc: props.config.khuVuc,
            hangGhe: props.config.hangGhe,
            soGhe: selectedSeat.value,
        });
        alert("Mua vé thành công!");
        emit("success");
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi mua vé");
    } finally {
        loading.value = false;
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const getLoaiVeBadgeClass = (loaiVe) => {
    switch (loaiVe) {
        case "VIP": return "badge bg-danger text-white small px-2 py-1";
        case "Thuong": return "badge bg-primary small px-2 py-1";
        case "KhuyenMai": return "badge bg-warning text-dark small px-2 py-1";
        default: return "badge bg-secondary small px-2 py-1";
    }
};

const formatLoaiVe = (loaiVe) => {
    return loaiVe === "Thuong" ? "Thường" : loaiVe === "KhuyenMai" ? "Khuyến mãi" : loaiVe;
};
</script>