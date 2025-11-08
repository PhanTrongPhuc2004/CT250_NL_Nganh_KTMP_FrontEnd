<!-- src/pages/user/ticketPurchase/components/MyTickets.vue -->
<template>
    <div class="ticket-card">
        <!-- Header: Trận đấu (hiển thị MÃ đội) -->
        <div class="ticket-header">
            <div class="team-left">
                <strong>{{ ticket.doiNha }}</strong>
            </div>
            <div class="vs">VS</div>
            <div class="team-right">
                <strong>{{ ticket.doiKhach }}</strong>
            </div>
        </div>

        <!-- Thời gian + sân -->
        <div class="ticket-date" v-if="ticket.ngayBatDau">
            <i class="bi bi-calendar-event"></i>
            {{ formatTime(ticket.ngayBatDau) }} • {{ ticket.sanDau }}
        </div>
        <div class="ticket-date text-muted" v-else>
            <i class="bi bi-info-circle"></i> Chưa có thông tin trận đấu
        </div>

        <!-- Thông tin vé -->
        <div class="ticket-info">
            <div class="info-row">
                <span>Loại vé:</span>
                <span :class="getLoaiVeBadge(ticket.loaiVe)">{{ formatLoaiVe(ticket.loaiVe) }}</span>
            </div>
            <div class="info-row">
                <span>Ghế:</span>
                <span class="font-monospace">{{ ticket.khuVuc }}{{ ticket.hangGhe }}-{{ ticket.soGhe }}</span>
            </div>
            <div class="info-row">
                <span>Giá:</span>
                <span class="text-danger fw-bold">{{ formatCurrency(ticket.giaVe) }}</span>
            </div>
            <div class="info-row">
                <span>Trạng thái:</span>
                <span :class="getStatusBadge(ticket.trangThai)">{{ formatStatus(ticket.trangThai) }}</span>
            </div>
        </div>

        <!-- QR Code -->
        <div class="qr-section">
            <img :src="ticket.qrCode || fallbackQR" alt="QR Code" class="qr-img" @error="onQRError" />
            <p class="ma-ve">Mã: <strong>{{ ticket.maVe }}</strong></p>
        </div>
    </div>
</template>

<script setup>
defineProps({ ticket: Object });

const fallbackQR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgD9gP14AAAAASUVORK5CYIIA';

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatTime = (d) => new Date(d).toLocaleString('vi-VN', {
    weekday: 'short', hour: '2-digit', minute: '2-digit',
    day: 'numeric', month: 'short'
}).replace(',', '');

const onQRError = (e) => {
    e.target.src = fallbackQR;
};

const getLoaiVeBadge = (v) => v === 'VIP' ? 'badge bg-danger text-white' :
    v === 'Thuong' ? 'badge bg-primary text-white' :
        'badge bg-warning text-dark';
const formatLoaiVe = (v) => v === 'Thuong' ? 'Thường' : v === 'KhuyenMai' ? 'Khuyến mãi' : v;

const getStatusBadge = (s) => s === 'da_thanh_toan' ? 'badge bg-success' :
    s === 'da_huy' ? 'badge bg-danger' : 'badge bg-warning';
const formatStatus = (s) => ({
    cho_thanh_toan: 'Chờ', da_thanh_toan: 'Đã thanh toán',
    da_su_dung: 'Đã dùng', da_huy: 'Đã hủy'
}[s] || s);
</script>

<style scoped>
.ticket-card {
    --primary: #E02128;
    --header: #8B2C31;
    --border: #8B2C31;

    background: white;
    border: 2px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-size: 0.875rem;
    max-width: 320px;
    margin: 0 auto;
    transition: all 0.3s ease;
    position: relative;
}

/* HOVER: NÂNG LÊN + BÓNG ĐẬM */
.ticket-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(139, 44, 49, 0.25);
    border-color: var(--primary);
}

/* HEADER: RADIAN ĐỎ ĐẬM */
.ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, var(--header) 0%, var(--primary) 100%);
    color: white;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.vs {
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: 1px;
}

/* NGÀY GIỜ */
.ticket-date {
    padding: 0.5rem 1rem;
    background: #fdf2f2;
    color: #5a1a1d;
    font-size: 0.8rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border-bottom: 1px dashed #fad4d6;
}

/* THÔNG TIN */
.ticket-info {
    padding: 0.75rem 1rem;
    background: #fffafa;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0;
    border-bottom: 1px dotted #fad4d6;
}

.info-row:last-child {
    border: none;
}

.info-row span:first-child {
    color: #7a1f23;
    font-weight: 500;
}

/* QR SECTION */
.qr-section {
    padding: 1rem;
    text-align: center;
    background: #fdf2f2;
    border-top: 2px dashed #fad4d6;
}

.qr-img {
    width: 88px;
    height: 88px;
    padding: 6px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(139, 44, 49, 0.15);
    border: 1px solid #fad4d6;
}

.ma-ve {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    color: #5a1a1d;
    font-family: 'Courier New', monospace;
}

/* FONT */
.font-monospace {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: #333;
}
</style>