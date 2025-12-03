<!-- src/pages/user/ticketPurchase/components/BuyTicketModal.vue -->
<template>
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.75)"
        @click.self="$emit('close')">
        <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
            <div ref="modalContent" class="modal-content border-0 shadow-lg" style="max-height: 90vh;">

                <!-- Thanh kéo ngang gợi ý cuộn -->
                <div class="text-center py-2 bg-light border-bottom" style="user-select: none;">
                    <div class="mx-auto bg-secondary opacity-50 rounded-pill" style="width: 48px; height: 5px;"></div>
                </div>

                <!-- BƯỚC 1: ĐẶT VÉ -->
                <div v-if="!showPayment">
                    <div class="modal-header bg-danger text-white py-3">
                        <h5 class="modal-title fw-bold fs-5">
                            <i class="bi bi-ticket-perforated me-2"></i> Đặt vé xem trận đấu
                        </h5>
                        <button class="btn-close btn-close-white" @click="$emit('close')"></button>
                    </div>

                    <!-- Nội dung bước 1 giữ nguyên 100% như trước -->
                    <div class="modal-body py-3">
                        <!-- (giữ nguyên toàn bộ phần bạn đã duyệt trước đó) -->
                        <div class="text-center mb-3">
                            <h5 class="text-danger fw-bold mb-2">
                                {{ matchInfo.doiNha?.tenDoiBong || matchInfo.doiNha }}
                                vs
                                {{ matchInfo.doiKhach?.tenDoiBong || matchInfo.doiKhach }}
                            </h5>
                            <p class="text-muted small mb-0">
                                <i class="bi bi-calendar-event me-1"></i> {{ formatFullDate(matchInfo.ngayBatDau) }}
                            </p>
                            <p class="text-muted small">
                                <i class="bi bi-geo-alt-fill me-1"></i> {{ matchInfo.diaDiem }}
                            </p>
                        </div>

                        <hr class="my-3">

                        <div class="row g-3 mb-3">
                            <div class="col-12">
                                <label class="form-label fw-bold mb-1 small">Loại vé</label>
                                <div class="p-2 bg-light rounded border">
                                    <span :class="getLoaiVeBadgeClass(config.loaiVe)" class="fs-6 fw-bold">
                                        {{ formatLoaiVe(config.loaiVe) }}
                                    </span>
                                    <p class="mb-1 mt-2 text-muted small">
                                        Khu vực: <strong>{{ config.khuVuc }} - Hàng {{ config.hangGhe }}</strong>
                                    </p>
                                    <p class="mb-0 text-success fw-bold fs-6">
                                        {{ formatCurrency(config.giaVe) }} / vé
                                    </p>
                                </div>
                            </div>

                            <div class="col-12">
                                <label class="form-label fw-bold mb-1 small">Chọn gói vé</label>
                                <div class="row g-2">
                                    <div class="col-4" v-for="pkg in ticketPackages" :key="pkg.value">
                                        <div class="package-card text-center p-2 rounded border" :class="[
                                            selectedPackage === pkg.value ? 'border-danger bg-danger bg-opacity-10' : 'border-light',
                                            pkg.disabled ? 'opacity-50' : 'cursor-pointer hover-shadow'
                                        ]" @click="pkg.disabled ? null : selectedPackage = pkg.value">
                                            <i :class="pkg.icon" class="fs-4 text-danger mb-1"></i>
                                            <h6 class="mb-0 small fw-bold">{{ pkg.label }}</h6>
                                            <p class="mb-0 text-muted very-small">{{ pkg.quantity }} vé</p>
                                            <p class="mb-0 fw-bold text-danger small">
                                                {{ formatCurrency(config.giaVe * pkg.quantity) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <small class="text-muted d-block mt-1 very-small">
                                    Còn lại: <strong>{{ config.soGheConLai }}</strong> vé
                                </small>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold mb-2 small">Thanh toán</label>
                            <div class="row g-2">
                                <div class="col-4" v-for="method in paymentMethods" :key="method.value">
                                    <div class="text-center p-2 rounded border cursor-pointer"
                                        :class="selectedMethod === method.value ? 'border-danger bg-danger bg-opacity-10' : 'border-light'"
                                        @click="selectedMethod = method.value">
                                        <img :src="method.icon" alt="" class="img-fluid"
                                            style="height: 40px; object-fit: contain;">
                                        <p class="mt-1 mb-0 fw-bold text-danger very-small">{{ method.label }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="alert alert-danger rounded-3 text-center py-3 mb-0">
                            <h6 class="mb-0 fw-bold">Tổng: {{ formatCurrency(totalPrice) }}</h6>
                            <small class=" opacity-75 very-small">
                                ({{ quantity }} vé × {{ formatCurrency(config.giaVe) }})
                            </small>
                        </div>
                    </div>

                    <div class="modal-footer border-0 pt-2 justify-content-center gap-2 bg-white">
                        <button class="btn btn-outline-secondary px-4 py-2 fs-6" @click="$emit('close')">Hủy</button>
                        <button class="btn btn-danger px-4 py-2 fw-bold fs-6" @click="proceedToPayment"
                            :disabled="loading || !selectedPackage || !selectedMethod">
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            Đặt vé
                        </button>
                    </div>
                </div>

                <!-- BƯỚC 2: QR THANH TOÁN – TỰ ĐỘNG CUỘN LÊN ĐẦU KHI CHUYỂN QUA -->
                <div v-else>
                    <div class="modal-header bg-success text-white py-3">
                        <h5 class="modal-title fw-bold fs-5">
                            <i class="bi bi-qr-code-scan"></i> Quét QR thanh toán
                        </h5>
                        <button class="btn-close btn-close-white" @click="$emit('close')"></button>
                    </div>

                    <div class="modal-body text-center py-5">
                        <h5 class="mb-3 text-dark">Chuyển khoản đúng số tiền</h5>
                        <h3 class="text-danger fw-bold mb-4">{{ formatCurrency(totalPrice) }}</h3>

                        <!-- QR lớn, đẹp, duy nhất -->
                        <div class="mx-auto" style="width: 320px; max-width: 90vw;">
                            <img :src="selectedQR" alt="QR thanh toán"
                                class="img-fluid rounded-4 shadow-lg border border-3 border-white" />
                        </div>

                        <div class="mt-4">
                            <p class="fw-bold text-success fs-4 mb-0">{{ selectedMethodLabel }}</p>
                        </div>

                        <div class="alert alert-info mt-4 py-3 fs-6 d-inline-block">
                            <i class="bi bi-info-circle-fill me-1"></i>
                            Sau khi chuyển khoản xong, nhấn nút bên dưới để hoàn tất.
                        </div>
                    </div>

                    <div class="modal-footer border-0 pb-4 bg-white justify-content-center gap-3">
                        <button class="btn btn-outline-secondary px-5 py-3" @click="$emit('close')">Hủy</button>
                        <button class="btn btn-success px-5 py-3 fw-bold fs-5" @click="confirmPaymentDone"
                            :disabled="confirmLoading">
                            <span v-if="confirmLoading" class="spinner-border spinner-border-sm me-2"></span>
                            Xác nhận đã thanh toán
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/utils/axios";

const props = defineProps({
    config: Object,
    matchInfo: Object,
});

const emit = defineEmits(["close", "success"]);
const router = useRouter();
const modalContent = ref(null);

const loading = ref(false);
const confirmLoading = ref(false);
const showPayment = ref(false);
const selectedPackage = ref(null);
const selectedMethod = ref(null);

// Các computed + data giữ nguyên...
const ticketPackages = computed(() => [
    { label: "Đơn", value: 1, quantity: 1, icon: "bi bi-person-fill", disabled: props.config.soGheConLai < 1 },
    { label: "Đôi", value: 2, quantity: 2, icon: "bi bi-people-fill", disabled: props.config.soGheConLai < 2 },
    { label: "Gia đình", value: 3, quantity: 3, icon: "bi bi-heart-fill", disabled: props.config.soGheConLai < 3 },
]);

const paymentMethods = [
    { value: "vietcombank", label: "Vietcombank", icon: "/VCB_icon.png", qr: "/data/QR1.jpg" },
    { value: "momo", label: "Momo", icon: "/Momo_icon.webp", qr: "/data/QR2.jpg" },
    { value: "paypal", label: "PayPal", icon: "/PayPal_icon.webp", qr: "/data/QR3.jpg" },
];

const selectedQR = computed(() => paymentMethods.find(m => m.value === selectedMethod.value)?.qr || "");
const selectedMethodLabel = computed(() => paymentMethods.find(m => m.value === selectedMethod.value)?.label || "");

const quantity = computed(() => selectedPackage.value || 0);
const totalPrice = computed(() => props.config.giaVe * quantity.value);

const proceedToPayment = async () => {
    if (!selectedPackage.value || !selectedMethod.value) return;
    loading.value = true;
    try {
        await axios.post("/ve/mua-nhieu", {
            maTranDau: props.matchInfo.maTranDau,
            maCauHinhVe: props.config._id,
            soLuong: quantity.value
        });
        showPayment.value = true;
    } catch (err) {
        alert("Đặt vé thất bại: " + (err.response?.data?.message || err.message));
    } finally {
        loading.value = false;
    }
};

// ĐÃ SỬA XONG – CHUYỂN ĐÚNG TRANG “Vé của tôi” SAU KHI XÁC NHẬN
const confirmPaymentDone = () => {
    confirmLoading.value = true;

    setTimeout(() => {
        alert("Cảm ơn bạn! Đơn đặt vé đã được ghi nhận thành công.");

        // Đóng modal trước
        emit("success");
        emit("close");

        // CHUYỂN ĐẾN TRANG VÉ CỦA TÔI VỚI FILTER ĐẸP
        router.push({
            path: "/ve-cua-toi",
            query: {
                match: "sap_dien_ra",
                status: "cho_thanh_toan",
                sort: "ngayBatDau-asc"
            }
        });

        confirmLoading.value = false;
    }, 600);
};

// Tự động cuộn lên đầu khi chuyển sang bước QR
watch(showPayment, async (newVal) => {
    if (newVal) {
        await nextTick();
        modalContent.value?.scrollTo({ top: 0, behavior: "smooth" });
    }
});

onMounted(() => {
    nextTick(() => {
        modalContent.value?.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// Các hàm format giữ nguyên
const getLoaiVeBadgeClass = (v) => {
    const map = { VIP: 'badge bg-danger', Thuong: 'badge bg-primary', KhuyenMai: 'badge bg-warning text-dark' };
    return map[v] || 'badge bg-secondary';
};

const formatLoaiVe = (v) => v === 'Thuong' ? 'Thường' : v === 'KhuyenMai' ? 'Khuyến mãi' : v;

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatFullDate = (d) => new Date(d).toLocaleString('vi-VN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
});
</script>

<style scoped>
.modal-dialog {
    max-width: 700px;
    margin: 1rem auto;
}

.modal-content {
    max-height: 90vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.modal-content::-webkit-scrollbar {
    width: 10px;
}

.modal-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
}

.modal-body {
    padding: 1rem !important;
}

.modal-header,
.modal-footer {
    padding: 0.75rem 1rem !important;
}

.fs-5,
h5 {
    font-size: 1.1rem !important;
}

.fs-6 {
    font-size: 0.9rem !important;
}

.very-small {
    font-size: 0.75rem !important;
}

.package-card {
    padding: 0.75rem !important;
}

.row.g-2,
.row.g-3 {
    --bs-gutter-x: 0.75rem !important;
    --bs-gutter-y: 0.75rem !important;
}

.alert {
    padding: 1rem !important;
    margin-bottom: 0 !important;
}

.btn {
    padding: 0.5rem 1.5rem !important;
    font-size: 0.875rem !important;
}
</style>