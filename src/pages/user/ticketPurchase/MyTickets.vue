<!-- src/pages/user/ticketPurchase/MyTickets.vue -->
<template>
    <div class="container py-4">
        <h4 class="fw-semibold mb-4 text-header">Vé của tôi</h4>

        <!-- Sort -->
        <div class="mb-3 d-flex gap-2 flex-wrap">
            <button @click="sort('giaVe')" class="btn btn-outline-danger btn-sm">
                Giá <i :class="sortIcon('giaVe')"></i>
            </button>
            <button @click="sort('trangThai')" class="btn btn-outline-danger btn-sm">
                Trạng thái <i :class="sortIcon('trangThai')"></i>
            </button>
            <button @click="sort('ngayBatDau')" class="btn btn-outline-danger btn-sm">
                Ngày <i :class="sortIcon('ngayBatDau')"></i>
            </button>
        </div>

        <!-- Loading / Empty / List -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-danger" role="status"></div>
        </div>
        <div v-else-if="sortedTickets.length === 0" class="text-center py-5">
            <div class="empty-state">
                <i class="bi bi-ticket-perforated fs-1"></i>
                <p class="mt-3 text-muted">Bạn chưa mua vé nào.</p>
                <router-link to="/ve" class="btn btn-danger btn-sm">Mua vé ngay</router-link>
            </div>
        </div>
        <div v-else class="row g-3">
            <div class="col-md-6 col-lg-4" v-for="ticket in sortedTickets" :key="ticket._id">
                <TicketCard :ticket="ticket" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/utils/axios";
import TicketCard from "./components/MyTickets.vue"; // import này là đúng rồi

const tickets = ref([]);
const loading = ref(true);
const sortKey = ref('');
const sortOrder = ref(1);

const fetchMyTickets = async () => {
    try {
        const res = await axios.get("/ve/user");
        tickets.value = res.data.map(t => ({
            ...t,
            doiNhaLogo: t.doiNhaLogo || '',
            doiKhachLogo: t.doiKhachLogo || ''
        }));
    } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
        loading.value = false;
    }
};

const sort = (key) => {
    if (sortKey.value === key) sortOrder.value *= -1;
    else { sortKey.value = key; sortOrder.value = 1; }
};

const sortIcon = (key) => {
    if (sortKey.value !== key) return 'bi bi-arrow-down-up';
    return sortOrder.value === 1 ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill';
};

const sortedTickets = computed(() => {
    if (!sortKey.value) return tickets.value;
    return [...tickets.value].sort((a, b) => {
        let valA = a[sortKey.value], valB = b[sortKey.value];
        if (sortKey.value === 'trangThai') {
            const order = { 'da_thanh_toan': 0, 'cho_thanh_toan': 1, 'da_su_dung': 2, 'da_huy': 3 };
            valA = order[valA] ?? 99; valB = order[valB] ?? 99;
        }
        return (valA > valB ? 1 : -1) * sortOrder.value;
    });
});

onMounted(fetchMyTickets);
</script>

<style scoped>
.text-header {
    color: #8B2C31;
    font-weight: 700;
}

.empty-state i {
    color: #E02128;
    opacity: 0.6;
}

.btn-danger {
    background: #E02128;
    border: none;
}

.btn-outline-danger {
    border-color: #E02128;
    color: #E02128;
}

.btn-outline-danger:hover {
    background: #E02128;
    color: white;
}
</style>