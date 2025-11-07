<!-- src/components/common/cards/TicketCard.vue -->
<script setup>
const props = defineProps({
    ticket: {
        type: Object,
        default: () => ({}) // Mặc định rỗng
    },
    adminMode: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['delete']);
</script>

<template>
    <div class="card h-100" v-if="ticket">
        <div class="card-body">
            <h6 class="card-title">Vé #{{ ticket.maVe || 'N/A' }}</h6>
            <p><strong>Khu:</strong> {{ ticket.khuVuc || 'N/A' }} - {{ ticket.hangGhe || 'N/A' }}</p>
            <p><strong>Giá:</strong>
                {{ ticket.giaVe ? ticket.giaVe.toLocaleString('vi-VN') + 'đ' : 'Chưa có giá' }}
            </p>
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
    <div v-else class="card h-100">
        <div class="card-body text-muted">
            <p>Không có dữ liệu vé</p>
        </div>
    </div>
</template>