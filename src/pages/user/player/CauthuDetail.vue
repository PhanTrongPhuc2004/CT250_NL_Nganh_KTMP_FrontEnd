<template>
  <div class="player-detail-page">
    <div v-if="loading" class="loading">⚽ Đang tải dữ liệu cầu thủ...</div>

    <div v-else-if="player" class="player-card">
      <!-- Ảnh và thông tin cơ bản -->
      <div class="player-header">
          <img
            :src="resolveImage(player.anhMinhHoa)"
            alt="Ảnh cầu thủ"
            class="player-avatar"
          />
        <div class="player-basic">
          <h1>{{ player.hoVaTen }}</h1>
          <p><i class="bi bi-person-badge"></i> <strong>Vị trí:</strong> {{ player.viTri || 'Chưa cập nhật' }}</p>
          <p><i class="bi bi-flag"></i> <strong>Quốc tịch:</strong> {{ player.quocTich || 'Không rõ' }}</p>
          <p><i class="bi bi-hash"></i> <strong>Số áo:</strong> {{ player.soAo || 'N/A' }}</p>
          <p><i class="bi bi-building"></i> <strong>CLB cũ:</strong> {{ player.cauLacBoCu || 'Không có' }}</p>
        </div>
      </div>

      <!-- Thông tin chi tiết -->
      <div class="player-info">
        <h4 class="fw-semibold text-dark mb-4">
          <i class="bi bi-info-circle text-primary me-2"></i>Thông tin chi tiết
        </h4>
        <ul>
          <li><strong>Ngày sinh:</strong> {{ formatDate(player.namSinh) }}</li>
          <li><strong>Chiều cao:</strong> {{ player.chieuCao ? player.chieuCao + ' cm' : 'Chưa có' }}</li>
          <li><strong>Chân thuận:</strong> {{ player.chanThuan || 'Không rõ' }}</li>
          <li><strong>Năm hành nghề:</strong> {{ player.namHanhNghe || 0 }}</li>
          <li><strong>Ngày gia nhập:</strong> {{ formatDate(player.ngayGiaNhap) }}</li>
          <li><strong>Email:</strong> {{ player.email || 'Không có' }}</li>
          <li><strong>Số điện thoại:</strong> {{ player.sdt || 'Không có' }}</li>
        </ul>
      </div>

      <!-- Nút quay lại -->
      <div class="text-center mt-4">
        <router-link to="/cauthu" class="btn btn-primary btn-lg shadow-sm px-4">
          <i class="bi bi-arrow-left-circle me-2"></i> Quay lại danh sách
        </router-link>
      </div>

    </div>

    <div v-else class="empty">
      ⚠️ Không tìm thấy thông tin cầu thủ.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// --- Khai báo ---
const route = useRoute();
const player = ref(null);
const loading = ref(true);

// ✅ Hàm xử lý ảnh linh hoạt
const resolveImage = (anh) => {
  if (!anh) return '/default-player.jpg';                  // ảnh mặc định nếu không có
  if (anh.startsWith('http') || anh.startsWith('data:image')) return anh; // ảnh URL hoặc Base64
  return `/${anh}`;                                   // ảnh từ public/data
};

// --- Hàm fetch chi tiết cầu thủ ---
const fetchPlayer = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const res = await axios.get(`http://localhost:5000/nguoidung/${id}`);
    player.value = res.data;
  } catch (err) {
    console.error('Lỗi khi tải chi tiết cầu thủ:', err);
  } finally {
    loading.value = false;
  }
};

// --- Hàm format ngày ---
const formatDate = (dateString) => {
  if (!dateString) return 'Không rõ';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

// --- Lifecycle ---
onMounted(fetchPlayer);
</script>


<style scoped>
/* Toàn trang */
.player-detail-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  /* background: linear-gradient(135deg, #872c8d, #5a1741, #a11c1c); */
  background-size: 200% 200%;
  animation: gradientMove 8s ease infinite;
  color: #333;
}

/* Hiệu ứng chuyển màu nền nhẹ */
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Card chính */
.player-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  max-width: 880px;
  width: 100%;
  padding: 35px;
  animation: fadeIn 0.6s ease-in-out;
}

/* Header (ảnh + info cơ bản) */
.player-header {
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 25px;
}

.player-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #3b82f6;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
  background-color: #f3f4f6;
  transition: transform 0.3s ease;
}

.player-avatar:hover {
  transform: scale(1.05);
}

/* Thông tin cơ bản */
.player-basic h1 {
  font-size: 2.2rem;
  color: #1e3a8a;
  margin-bottom: 12px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.player-basic p {
  margin: 6px 0;
  color: #374151;
  font-size: 1rem;
  line-height: 1.4;
}

.player-basic strong {
  color: #111827;
}

.player-basic i {
  color: #2563eb;
  margin-right: 6px;
}

/* Thông tin chi tiết */
.player-info {
  margin-top: 30px;
  background: linear-gradient(180deg, #f9fafb, #eef2ff);
  border-radius: 15px;
  padding: 20px 25px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);
}

.player-info h2 {
  color: #1e3a8a;
  margin-bottom: 18px;
  font-size: 1.5rem;
  font-weight: 600;
}

.player-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.player-info li {
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1rem;
  color: #111827;
}

.player-info li:last-child {
  border-bottom: none;
}

/* Nút quay lại */
.back-btn {
  margin-top: 35px;
  text-align: center;
}

.btn-back {
  background-color: #2563eb;
  color: white;
  padding: 12px 26px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.3px;
  transition: all 0.3s;
  box-shadow: 0 3px 10px rgba(37, 99, 235, 0.3);
}

.btn-back:hover {
  background-color: #1e40af;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.45);
}

/* Trạng thái tải và trống */
.loading,
.empty {
  margin-top: 60px;
  font-size: 1.2rem;
  color: #fff;
  text-align: center;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Hiệu ứng xuất hiện */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .player-header {
    flex-direction: column;
    text-align: center;
  }

  .player-avatar {
    width: 160px;
    height: 160px;
  }

  .player-basic h1 {
    font-size: 1.7rem;
  }

  .player-info {
    padding: 18px;
  }
}
</style>

