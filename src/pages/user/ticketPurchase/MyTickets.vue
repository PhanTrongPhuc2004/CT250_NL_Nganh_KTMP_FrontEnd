<!-- src/pages/user/ticketPurchase/MyTickets.vue -->
<template>
    <div class="container py-4">
        <h4 class="fw-bold mb-4 text-danger">Vé của tôi</h4>

        <!-- BỘ LỌC & SẮP XẾP -->
        <div class="card border-danger shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-center">

                    <!-- Lọc trạng thái trận đấu -->
                    <div class="col-12 col-md-4">
                        <label class="form-label fw-semibold text-danger small mb-1">
                            <i class="bi bi-futbol me-1"></i> Trận đấu
                        </label>
                        <select v-model="filterMatchStatus" class="form-select form-select-sm">
                            <option value="">Tất cả trận</option>
                            <option value="sap_dien_ra">Sắp diễn ra</option>
                            <option value="dang_dien_ra">Đang diễn ra</option>
                            <option value="da_ket_thuc">Đã kết thúc</option>
                        </select>
                    </div>

                    <!-- Lọc trạng thái vé -->
                    <div class="col-12 col-md-4">
                        <label class="form-label fw-semibold text-danger small mb-1">
                            <i class="bi bi-ticket-perforated me-1"></i> Trạng thái vé
                        </label>
                        <select v-model="filterTicketStatus" class="form-select form-select-sm">
                            <option value="">Tất cả vé</option>
                            <option value="da_thanh_toan">Đã thanh toán</option>
                            <option value="cho_thanh_toan">Chờ thanh toán</option>
                            <!-- <option value="da_su_dung">Đã sử dụng</option> -->
                            <option value="da_huy">Đã hủy</option>
                        </select>
                    </div>

                    <!-- Sắp xếp -->
                    <div class="col-12 col-md-4">
                        <label class="form-label fw-semibold text-danger small mb-1">
                            <i class="bi bi-sort-down me-1"></i> Sắp xếp theo
                        </label>
                        <select v-model="sortBy" class="form-select form-select-sm">
                            <option value="ngayBatDau-asc">Ngày gần nhất</option>
                            <option value="ngayBatDau-desc">Ngày xa nhất</option>
                            <option value="giaVe-asc">Giá tăng dần</option>
                            <option value="giaVe-desc">Giá giảm dần</option>
                            <!-- <option value="trangThai">Trạng thái vé</option> -->
                        </select>
                    </div>
                </div>

                <!-- Nút reset -->
                <div class="mt-3 text-end">
                    <button @click="resetFilters" class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-arrow-counterclockwise"></i> Đặt lại
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 text-muted">Đang tải vé của bạn...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredAndSortedTickets.length === 0" class="text-center py-5">
            <div class="empty-state">
                <i class="bi bi-ticket-detailed fs-1 text-danger opacity-50"></i>
                <p class="mt-4 fs-5 text-muted">Bạn chưa có vé nào phù hợp với bộ lọc.</p>
                <router-link to="/ve" class="btn btn-danger mt-3">
                    <i class="bi bi-cart3 me-2"></i> Mua vé ngay
                </router-link>
            </div>
        </div>

        <!-- Danh sách vé -->
        <div v-else class="row g-4">
            <div class="col-md-6 col-lg-4" v-for="ticket in filteredAndSortedTickets" :key="ticket._id">
                <TicketCard :ticket="ticket" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/utils/axios";
import TicketCard from "./components/MyTickets.vue";

const tickets = ref([]);
const loading = ref(true);

// Bộ lọc
const filterMatchStatus = ref(""); // sap_dien_ra | dang_dien_ra | da_ket_thuc
const filterTicketStatus = ref(""); // da_thanh_toan | cho_thanh_toan | ...

// Sắp xếp
const sortBy = ref("ngayBatDau-asc"); // định dạng: field-direction

const fetchMyTickets = async () => {
    try {
        const res = await axios.get("/ve/user");
        tickets.value = res.data.map(t => ({
            ...t,
            doiNhaLogo: t.doiNhaLogo || '',
            doiKhachLogo: t.doiKhachLogo || ''
        }));
    } catch (err) {
        alert("Lỗi tải vé: " + (err.response?.data?.message || err.message));
    } finally {
        loading.value = false;
    }
};

// Xác định trạng thái trận đấu
const getMatchStatus = (ngayBatDau) => {
    const now = new Date();
    const matchTime = new Date(ngayBatDau);
    const diff = matchTime - now;

    if (diff > 3600000) return "sap_dien_ra";        // > 1h
    if (diff > -7200000) return "dang_dien_ra";      // đang trong trận ±2h
    return "da_ket_thuc";
};

// Lọc + Sắp xếp
const filteredAndSortedTickets = computed(() => {
    let result = [...tickets.value];

    // 1. Lọc trạng thái trận đấu
    if (filterMatchStatus.value) {
        result = result.filter(t => getMatchStatus(t.ngayBatDau) === filterMatchStatus.value);
    }

    // 2. Lọc trạng thái vé
    if (filterTicketStatus.value) {
        result = result.filter(t => t.trangThai === filterTicketStatus.value);
    }

    // 3. Sắp xếp
    const [field, direction] = sortBy.value.split('-');
    const order = direction === 'desc' ? -1 : 1;

    result.sort((a, b) => {
        let valA, valB;

        if (field === 'giaVe') {
            valA = a.giaVe; valB = b.giaVe;
        } else if (field === 'ngayBatDau') {
            valA = new Date(a.ngayBatDau); valB = new Date(b.ngayBatDau);
        } else if (field === 'trangThai') {
            const statusOrder = {
                cho_thanh_toan: 0,
                da_thanh_toan: 1,
                da_su_dung: 2,
                da_huy: 3
            };
            valA = statusOrder[a.trangThai] ?? 99;
            valB = statusOrder[b.trangThai] ?? 99;
        }

        if (valA > valB) return order;
        if (valA < valB) return -order;
        return 0;
    });

    return result;
});

const resetFilters = () => {
    filterMatchStatus.value = "";
    filterTicketStatus.value = "";
    sortBy.value = "ngayBatDau-asc";
};

onMounted(fetchMyTickets);
</script>

<style scoped>
.text-danger {
    color: #E02128 !important;
}

.btn-danger {
    background: #E02128;
    border: none;
}

.form-select:focus,
.form-select:hover {
    border-color: #E02128;
    box-shadow: 0 0 0 0.2rem rgba(224, 33, 40, 0.25);
}

.empty-state i {
    font-size: 4rem;
    opacity: 0.3;
}

.card.border-danger {
    border-width: 2px !important;
}
</style>