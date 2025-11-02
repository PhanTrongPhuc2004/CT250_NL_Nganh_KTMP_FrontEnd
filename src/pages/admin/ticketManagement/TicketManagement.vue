<!-- src/pages/admin/ticketManagement/TicketManagement.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TicketList from './components/TicketList.vue';
import TicketForm from './components/TicketForm.vue';
import TicketStats from './components/TicketStats.vue';
import MatchSelector from './components/MatchSelector.vue';

const matches = ref([]);
const selectedMatch = ref(null);
const tickets = ref([]);
const stats = ref({ total: 0, sold: 0, revenue: 0 });

const loadMatches = async () => {
    try {
        const res = await axios.get('http://localhost:5000/trandau');
        matches.value = res.data;
    } catch (err) {
        console.error('Lỗi tải trận đấu:', err);
    }
};

const loadTicketsByMatch = async (maTranDau) => {
    try {
        const res = await axios.get(`http://localhost:5000/ve/trandau/${maTranDau}`);
        tickets.value = res.data;
        calculateStats();
    } catch (err) {
        console.error('Lỗi tải vé:', err);
    }
};

const calculateStats = () => {
    const sold = tickets.value.filter(v => v.trangThai === 'da_ban').length;
    const revenue = tickets.value.reduce((sum, v) => v.trangThai === 'da_ban' ? sum + v.giaVe : sum, 0);
    stats.value = {
        total: tickets.value.length,
        sold,
        available: tickets.value.length - sold,
        revenue
    };
};

onMounted(() => {
    loadMatches();
});
</script>

<template>
    <div class="container-fluid py-4">
        <h2 class="mb-4">Quản lý vé</h2>

        <!-- Chọn trận đấu -->
        <MatchSelector :matches="matches"
            @select="match => { selectedMatch = match; loadTicketsByMatch(match.maTranDau); }" />

        <!-- Thống kê -->
        <TicketStats v-if="selectedMatch" :stats="stats" />

        <!-- Form tạo vé -->
        <TicketForm v-if="selectedMatch" :maTranDau="selectedMatch.maTranDau"
            @created="loadTicketsByMatch(selectedMatch.maTranDau)" />

        <!-- Danh sách vé -->
        <TicketList v-if="selectedMatch" :tickets="tickets" @updated="loadTicketsByMatch(selectedMatch.maTranDau)"
            @deleted="loadTicketsByMatch(selectedMatch.maTranDau)" />
    </div>
</template>