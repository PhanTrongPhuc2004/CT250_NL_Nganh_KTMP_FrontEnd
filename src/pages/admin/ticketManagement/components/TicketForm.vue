<!-- src/pages/admin/ticketManagement/components/TicketForm.vue -->
<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(['maTranDau']);
const emit = defineEmits(['created']);

const form = ref({
    khuVuc: 'A',
    hangGhe: 'VIP',
    giaVe: 500000,
    soLuong: 1
});

const submitting = ref(false);

// LẤY THÔNG TIN TRẬN ĐẤU ĐỂ GỬI THÔNG BÁO
const selectedMatch = ref(null);

const loadMatchInfo = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/trandau/${props.maTranDau}`);
        selectedMatch.value = res.data;
    } catch (err) {
        console.error('Lỗi lấy trận đấu:', err);
    }
};

const createTickets = async () => {
    submitting.value = true;
    try {
        // 1. Tạo vé
        for (let i = 0; i < form.value.soLuong; i++) {
            await axios.post('http://localhost:5000/ve', {
                maTranDau: props.maTranDau,
                khuVuc: form.value.khuVuc,
                hangGhe: form.value.hangGhe,
                giaVe: form.value.giaVe,
                trangThai: 'cho_ban'
            });
        }

        // 2. Lấy thông tin trận đấu
        if (!selectedMatch.value) await loadMatchInfo();

        // 3. GỬI THÔNG BÁO – DÙNG capDau
        await axios.post('http://localhost:5000/thongbao', {
            tieuDe: "Vé mới mở bán!",
            noiDung: `Vé trận ${selectedMatch.value.capDau[0]} vs ${selectedMatch.value.capDau[1]} đã mở bán! Giá từ ${form.value.giaVe.toLocaleString()}đ.`,
            isPublic: true
        }, { withCredentials: true });

        alert(`Đã tạo ${form.value.soLuong} vé + gửi thông báo!`);
        emit('created');
        form.value.soLuong = 1;
    } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
        submitting.value = false;
    }
};
</script>