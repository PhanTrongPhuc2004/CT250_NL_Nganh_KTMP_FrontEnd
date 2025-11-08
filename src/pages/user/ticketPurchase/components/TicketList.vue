<!-- src/pages/user/ticketPurchase/components/TicketList.vue -->
<template>
    <div class="table-responsive">
        <table class="table table-hover align-middle ticket-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th @click="sort('loaiVe')" class="sortable">
                        Loại vé <i :class="sortIcon('loaiVe')"></i>
                    </th>
                    <th @click="sort('khuVuc')" class="sortable">
                        Hàng ghế <i :class="sortIcon('khuVuc')"></i>
                    </th>
                    <th @click="sort('soGheBatDau')" class="sortable">
                        Số ghế <i :class="sortIcon('soGheBatDau')"></i>
                    </th>
                    <th @click="sort('giaVe')" class="sortable">
                        Giá vé <i :class="sortIcon('giaVe')"></i>
                    </th>
                    <th @click="sort('soGheConLai')" class="sortable">
                        Còn lại <i :class="sortIcon('soGheConLai')"></i>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in sortedList" :key="item._id">
                    <td class="fw-bold">{{ index + 1 }}</td>
                    <td>
                        <span :class="getLoaiVeBadge(item.loaiVe)">
                            {{ formatLoaiVe(item.loaiVe) }}
                        </span>
                    </td>
                    <td class="font-monospace">{{ item.khuVuc }}</td>
                    <td class="font-monospace">{{ item.soGheBatDau }} - {{ item.soGheKetThuc }}</td>
                    <td class="text-success fw-bold">{{ formatCurrency(item.giaVe) }}</td>
                    <td>
                        <span class="badge bg-success text-white">
                            {{ item.soGheConLai }} / {{ item.tongSoGhe }}
                        </span>
                    </td>
                    <td>
                        <button @click="$emit('buy', item)" class="btn btn-sm btn-danger"
                            :disabled="item.soGheConLai <= 0">
                            Mua
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

// SỬA: DÙNG PROPS ĐÚNG
const props = defineProps({
    cauHinhVeList: {
        type: Array,
        default: () => []
    }
});

defineEmits(['buy']);

// Sort state
const sortKey = ref('');
const sortOrder = ref(1);

const sort = (key) => {
    if (sortKey.value === key) {
        sortOrder.value *= -1;
    } else {
        sortKey.value = key;
        sortOrder.value = 1;
    }
};

const sortIcon = (key) => {
    if (sortKey.value !== key) return 'bi bi-arrow-down-up';
    return sortOrder.value === 1 ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill';
};

// SỬA: DÙNG props.cauHinhVeList
const sortedList = computed(() => {
    if (!sortKey.value) return props.cauHinhVeList;
    return [...props.cauHinhVeList].sort((a, b) => {
        let valA = a[sortKey.value];
        let valB = b[sortKey.value];
        if (sortKey.value === 'loaiVe') {
            const order = { 'VIP': 0, 'Thuong': 1, 'KhuyenMai': 2 };
            valA = order[valA]; valB = order[valB];
        }
        return (valA > valB ? 1 : -1) * sortOrder.value;
    });
});

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatLoaiVe = (v) => v === 'Thuong' ? 'Thường' : v === 'KhuyenMai' ? 'Khuyến mãi' : v;
const getLoaiVeBadge = (v) => v === 'VIP' ? 'badge bg-danger text-white' : v === 'Thuong' ? 'badge bg-primary text-white' : 'badge bg-warning text-dark';
</script>

<style scoped>
.ticket-table {
    --primary: #E02128;
    --header: #8B2C31;
    --light: #fdf2f2;
    --lighter: #f8d7da;

    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.9rem;
}

.ticket-table thead {
    background: linear-gradient(135deg, var(--header), var(--primary));
    color: white;
}

.ticket-table th {
    font-weight: 600;
    text-align: center;
    padding: 0.75rem 0.5rem;
    border-bottom: 2px solid var(--primary);
}

.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable i {
    font-size: 0.8rem;
    margin-left: 4px;
}

.ticket-table tbody tr {
    background-color: var(--light);
    transition: all 0.2s;
}

.ticket-table tbody tr:hover {
    background-color: var(--lighter);
    /* transform: scale(1.01); */
}

.ticket-table td {
    padding: 0.75rem 0.5rem;
    text-align: center;
    border-bottom: 1px dotted #fad4d6;
}

.btn-danger {
    background: var(--primary);
    border: none;
    font-weight: 600;
    padding: 0.35rem 0.75rem;
}

.btn-danger:hover {
    background: #c01b20;
}

.btn-danger:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.font-monospace {
    font-family: 'Courier New', monospace;
    font-weight: 600;
}
</style>