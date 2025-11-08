<template>
    <div class="table-responsive">
        <table class="table table-hover align-middle ticket-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th @click="sort('loaiVe')" class="sortable">Loại vé <i :class="sortIcon('loaiVe')"></i></th>
                    <th @click="sort('khuVuc')" class="sortable">Khu vực <i :class="sortIcon('khuVuc')"></i></th>
                    <th @click="sort('soGheBatDau')" class="sortable">Số ghế <i :class="sortIcon('soGheBatDau')"></i>
                    </th>
                    <th @click="sort('giaVe')" class="sortable">Giá vé <i :class="sortIcon('giaVe')"></i></th>
                    <th @click="sort('soGheConLai')" class="sortable">Còn lại <i :class="sortIcon('soGheConLai')"></i>
                    </th>
                    <th v-if="$slots.action"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in sortedList" :key="item._id">
                    <td class="fw-bold">{{ i + 1 }}</td>
                    <td><span :class="getLoaiVeBadge(item.loaiVe)">{{ formatLoaiVe(item.loaiVe) }}</span></td>
                    <td class="font-monospace">{{ item.khuVuc }}</td>
                    <td class="font-monospace">{{ item.soGheBatDau }} - {{ item.soGheKetThuc }}</td>
                    <td class="text-success fw-bold">{{ formatCurrency(item.giaVe) }}</td>
                    <td><span class="badge bg-success text-white">{{ item.soGheConLai }} / {{ item.tongSoGhe }}</span>
                    </td>
                    <td v-if="$slots.action">
                        <slot name="action" :item="item"></slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({ cauHinhVeList: Array });
defineEmits(['buy']);

const sortKey = ref(''), sortOrder = ref(1);
const sort = (k) => { sortKey.value === k ? sortOrder.value *= -1 : (sortKey.value = k, sortOrder.value = 1); };
const sortIcon = (k) => sortKey.value !== k ? 'bi bi-arrow-down-up' : sortOrder.value === 1 ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill';

const sortedList = computed(() => {
    if (!sortKey.value) return props.cauHinhVeList;
    return [...props.cauHinhVeList].sort((a, b) => {
        let A = a[sortKey.value], B = b[sortKey.value];
        if (sortKey.value === 'loaiVe') { const o = { 'VIP': 0, 'Thuong': 1, 'KhuyenMai': 2 }; A = o[A]; B = o[B]; }
        return (A > B ? 1 : -1) * sortOrder.value;
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

.sortable {
    cursor: pointer;
}

.ticket-table tbody tr {
    background: var(--light);
    transition: 0.2s;
}

.ticket-table tbody tr:hover {
    background: var(--lighter);
    transform: scale(1.01);
}
</style>