<!-- src/pages/user/ticketPurchase/components/TicketItemCard.vue -->
<template>
    <!-- THẺ VÉ HIỂN THỊ BÌNH THƯỜNG -->
    <div class="ticket-card" :class="{ 'opacity-60': ticket.trangThai === 'cho_thanh_toan' }">
        <div class="ticket-header">
            <div class="team-left"><strong>{{ ticket.doiNha?.tenDoiBong || ticket.doiNha }}</strong></div>
            <div class="vs">VS</div>
            <div class="team-right"><strong>{{ ticket.doiKhach?.tenDoiBong || ticket.doiKhach }}</strong></div>
        </div>

        <div class="ticket-date" v-if="ticket.ngayBatDau">
            <i class="bi bi-calendar-event"></i>
            {{ formatTime(ticket.ngayBatDau) }} • {{ ticket.diaDiem || "Sân nhà" }}
        </div>

        <div class="ticket-info">
            <div class="info-row"><span>Loại vé:</span> <span :class="getLoaiVeBadge(ticket.loaiVe)">{{
                formatLoaiVe(ticket.loaiVe) }}</span></div>
            <div class="info-row"><span>Ghế:</span> <span class="font-monospace">{{ ticket.khuVuc }}{{ ticket.hangGhe
                    }}-{{ ticket.soGhe }}</span></div>
            <div class="info-row"><span>Giá:</span> <span class="text-danger fw-bold">{{ formatCurrency(ticket.giaVe)
                    }}</span></div>
            <div class="info-row"><span>Trạng thái:</span> <span :class="getStatusBadge(ticket.trangThai)">{{
                formatStatus(ticket.trangThai) }}</span></div>
        </div>

        <div class="qr-section">
            <img :src="ticket.qrCode || fallbackQR" alt="QR Code" class="qr-img" crossorigin="anonymous"
                @error="e => e.target.src = fallbackQR" />
            <p class="ma-ve">Mã vé: <strong>{{ ticket.maVe }}</strong></p>
        </div>

        <!-- 2 NÚT -->
        <div class="ticket-footer">
            <div class="btn-group w-100" role="group">
                <button @click="openFullScreen" class="btn btn-danger btn-sm flex-fill"
                    :disabled="ticket.trangThai !== 'da_thanh_toan'">
                    <i class="bi bi-eye"></i> Xem vé
                </button>
                <button @click="printTicket" class="btn btn-outline-danger btn-sm flex-fill"
                    :disabled="ticket.trangThai !== 'da_thanh_toan'">
                    <i class="bi bi-printer"></i> In vé
                </button>
            </div>
        </div>
    </div>

    <!-- MODAL XEM VÉ TOÀN MÀN HÌNH – ĐÃ FIX LỖI GAPI -->
    <teleport to="body">
        <div v-if="showFullScreen" class="full-ticket-overlay" @click.self="showFullScreen = false">
            <div class="full-ticket-container">
                <div class="ticket-card full-version">
                    <div class="ticket-header">
                        <div class="team-left"><strong>{{ ticket.doiNha?.tenDoiBong || ticket.doiNha }}</strong></div>
                        <div class="vs">VS</div>
                        <div class="team-right"><strong>{{ ticket.doiKhach?.tenDoiBong || ticket.doiKhach }}</strong>
                        </div>
                    </div>
                    <div class="ticket-date">
                        <i class="bi bi-calendar-event"></i> {{ formatTime(ticket.ngayBatDau) }} • {{ ticket.diaDiem }}
                    </div>
                    <div class="ticket-info">
                        <div class="info-row"><span>Loại vé:</span> <span :class="getLoaiVeBadge(ticket.loaiVe)">{{
                                formatLoaiVe(ticket.loaiVe) }}</span></div>
                        <div class="info-row"><span>Ghế:</span> <span class="font-monospace">{{ ticket.khuVuc }}{{
                                ticket.hangGhe }}-{{ ticket.soGhe }}</span></div>
                        <div class="info-row"><span>Giá:</span> <span class="text-danger fw-bold">{{
                                formatCurrency(ticket.giaVe) }}</span></div>
                    </div>
                    <div class="qr-section">
                        <img :src="ticket.qrCode || fallbackQR" alt="QR" class="qr-img-full" crossorigin="anonymous" />
                        <p class="ma-ve">Mã vé: <strong>{{ ticket.maVe }}</strong></p>
                    </div>
                </div>
                <button class="btn-close-full" @click="showFullScreen = false" aria-label="Đóng">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref } from "vue";
import html2canvas from "html2canvas";

const props = defineProps({ ticket: { type: Object, required: true } });
const ticket = props.ticket;

const showFullScreen = ref(false);

const fallbackQR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgD9gP14AAAAASUVORK5CYIIA';

// XEM VÉ – ĐÃ FIX HOÀN TOÀN
const openFullScreen = () => {
    if (ticket.trangThai === 'da_thanh_toan') {
        showFullScreen.value = true;
    }
};

// IN VÉ – ẨN TẠM THỜI THẺ VÉ NHỎ, CHỤP RÕ NÉT, KHÔNG THỪA LỀ
const printTicket = async () => {
    if (ticket.trangThai !== 'da_thanh_toan') return;

    const card = document.querySelector(`[data-ticket-id="${ticket.maVe}"]`) || document.querySelector('.ticket-card');
    if (!card) return;

    // Tạm ẩn 2 nút
    const footer = card.querySelector('.ticket-footer');
    const originalDisplay = footer.style.display;
    footer.style.display = 'none';

    try {
        const canvas = await html2canvas(card, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: card.offsetWidth,
            height: card.offsetHeight,
            logging: false
        });

        const link = document.createElement('a');
        link.download = `Ve_${ticket.maVe}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('Lỗi in vé:', err);
        alert('Không thể in vé. Vui lòng thử lại!');
    } finally {
        // Hiện lại nút
        footer.style.display = originalDisplay || '';
    }
};

// Các hàm format giữ nguyên
const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatTime = (d) => new Date(d).toLocaleString('vi-VN', {
    weekday: 'short', hour: '2-digit', minute: '2-digit',
    day: 'numeric', month: 'short'
}).replace(',', '');

const getLoaiVeBadge = (v) => v === 'VIP' ? 'badge bg-danger text-white' :
    v === 'Thuong' ? 'badge bg-primary text-white' : 'badge bg-warning text-dark';

const formatLoaiVe = (v) => v === 'Thuong' ? 'Thường' : v === 'KhuyenMai' ? 'Khuyến mãi' : v;

const getStatusBadge = (s) => s === 'da_thanh_toan' ? 'badge bg-success' :
    s === 'da_huy' ? 'badge bg-danger' : 'badge bg-warning';

const formatStatus = (s) => ({
    cho_thanh_toan: 'Chờ thanh toán',
    da_thanh_toan: 'Đã thanh toán',
    da_su_dung: 'Đã dùng',
    da_huy: 'Đã hủy'
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

/* Thêm data attribute để dễ chọn (nếu có nhiều vé) */
.ticket-card {
    contain: layout style;
}

/* Giúp html2canvas chụp chính xác hơn */

.ticket-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(139, 44, 49, 0.25);
    border-color: var(--primary);
}

.ticket-header {
    background: linear-gradient(135deg, var(--header) 0%, var(--primary) 100%);
    color: white;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.vs {
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: 1px;
}

.ticket-date {
    padding: 0.5rem 1rem;
    background: #fdf2f2;
    color: #5a1a1d;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border-bottom: 1px dashed #fad4d6;
}

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
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #5a1a1d;
    font-family: 'Courier New', monospace;
}

.ticket-footer {
    padding: 0.75rem 1rem 1rem;
    background: #fdf2f2;
}

.ticket-footer .btn {
    font-size: 0.82rem;
    padding: 0.4rem;
    border-radius: 10px !important;
}

.opacity-60 .ticket-footer .btn {
    opacity: 0.5;
    cursor: not-allowed !important;
}

/* MODAL XEM TOÀN MÀN */
.full-ticket-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.97);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
}

.full-ticket-container {
    position: relative;
    width: 100%;
    max-width: 460px;
}

.full-version {
    transform: scale(1.35);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7);
    border: 5px solid var(--border) !important;
}

.qr-img-full {
    width: 240px;
    height: 240px;
    padding: 18px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 10px 40px rgba(139, 44, 49, 0.35);
}

.btn-close-full {
    position: absolute;
    top: -70px;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #333;
    border: none;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}
</style>