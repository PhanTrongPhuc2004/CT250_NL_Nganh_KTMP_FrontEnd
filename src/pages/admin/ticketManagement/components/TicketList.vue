<script setup>
import { ref } from 'vue';
import axios from 'axios';
import TicketCard from '@/components/common/cards/TicketCard.vue';

const props = defineProps(['tickets']);
const emit = defineEmits(['updated', 'deleted']);

const deleteTicket = async (maVe) => {
    if (!confirm('Xóa vé này?')) return;
    try {
        await axios.delete(`http://localhost:5000/ve/${maVe}`);
        emit('deleted');
    } catch (err) {
        alert('Lỗi xóa vé');
    }
};
</script>

<template>
    <div class="row">
        <div v-for="ticket in props.tickets" :key="ticket.maVe" class="col-md-4 mb-3">
            <TicketCard :ticket="ticket" admin-mode @delete="deleteTicket" />
        </div>
    </div>
</template>