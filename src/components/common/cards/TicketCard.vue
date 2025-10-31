
<script setup>
const props = defineProps({
    ticket: Object,
    adminMode: Boolean
});
const emit = defineEmits(['delete']);
</script>

<template>
    <div class="card h-100">
        <div class="card-body">
            <h6 class="card-title">Vé #{{ ticket.maVe }}</h6>
            <p><strong>Khu:</strong> {{ ticket.khuVuc }} - {{ ticket.hangGhe }}</p>
            <p><strong>Giá:</strong> {{ ticket.giaVe.toLocaleString('vi-VN') }}đ</p>
            <p>
                <span :class="ticket.trangThai === 'da_ban' ? 'text-danger' : 'text-success'">
                    {{ ticket.trangThai === 'da_ban' ? 'Đã bán' : 'Còn trống' }}
                </span>
            </p>
            <button v-if="adminMode" @click="emit('delete', ticket.maVe)" class="btn btn-sm btn-danger">
                Xóa
            </button>
        </div>
    </div>
</template>