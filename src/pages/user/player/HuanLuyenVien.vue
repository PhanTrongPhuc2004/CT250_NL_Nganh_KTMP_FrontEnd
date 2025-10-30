<template>
  <div class="coach-detail-page">
    <div v-if="loading" class="loading">🧢 Đang tải dữ liệu huấn luyện viên...</div>

    <div v-else-if="coach" class="coach-card">
      <!-- Ảnh và thông tin cơ bản -->
      <div class="coach-header">
        <img
          :src="resolveImage(coach.anhMinhHoa)"
          alt="Ảnh huấn luyện viên"
          class="coach-avatar"
        />
        <div class="coach-basic">
          <h1>{{ coach.hoVaTen }}</h1>
          <p><i class="bi bi-flag"></i> <strong>Quốc tịch:</strong> {{ coach.quocTich || 'Không rõ' }}</p>
          <p><i class="bi bi-building"></i> <strong>CLB cũ:</strong> {{ coach.cauLacBoCu || 'Không có' }}</p>
          <p><i class="bi bi-calendar-check"></i> <strong>Năm hành nghề:</strong> {{ coach.namHanhNghe || 'Không rõ' }}</p>
          <p><i class="bi bi-calendar-plus"></i> <strong>Ngày gia nhập:</strong> {{ formatDate(coach.ngayGiaNhap) }}</p>
        </div>
      </div>

      <!-- Thông tin chi tiết -->
      <div class="coach-info">
        <h2>📋 Thông tin chi tiết</h2>
        <ul>
          <li><strong>Năm sinh:</strong> {{ coach.namSinh || 'Không rõ' }}</li>
          <li><strong>Email:</strong> {{ coach.email || 'Không có' }}</li>
          <li><strong>Số điện thoại:</strong> {{ coach.sdt || 'Không có' }}</li>
          <li><strong>Địa chỉ:</strong> {{ coach.diaChi || 'Không rõ' }}</li>
        </ul>
      </div>

      <!-- Nút quay lại -->
      <div class="back-btn">
        <router-link to="/cauthu" class="btn-back">
          ⬅️ Quay lại danh sách
        </router-link>
      </div>
    </div>

    <div v-else class="empty">
      ⚠️ Không tìm thấy thông tin huấn luyện viên.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const coach = ref(null);
const loading = ref(true);

// ✅ Xử lý ảnh linh hoạt
const resolveImage = (anh) => {
  if (!anh) return '/default-coach.jpg';
  if (anh.startsWith('http') || anh.startsWith('data:image')) return anh;
  return `/${anh}`;
};

// ✅ Fetch chi tiết HLV
const fetchCoach = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const res = await axios.get(`http://localhost:5000/nguoidung/${id}`);
    coach.value = res.data;
  } catch (err) {
    console.error('Lỗi khi tải chi tiết huấn luyện viên:', err);
  } finally {
    loading.value = false;
  }
};

// ✅ Format ngày
const formatDate = (dateString) => {
  if (!dateString) return 'Không rõ';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

onMounted(fetchCoach);
</script>

<style scoped>
/* Trang tổng thể */
.coach-detail-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  background-size: 200% 200%;
  animation: gradientMove 8s ease infinite;
  color: #f9fafb;
}

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
.coach-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  max-width: 850px;
  width: 100%;
  padding: 35px;
  color: #111827;
  animation: fadeIn 0.6s ease-in-out;
}

/* Header (ảnh + thông tin cơ bản) */
.coach-header {
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 25px;
}

.coach-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #1e40af;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
  background-color: #f3f4f6;
  transition: transform 0.3s ease;
}

.coach-avatar:hover {
  transform: scale(1.05);
}

/* Thông tin cơ bản */
.coach-basic h1 {
  font-size: 2.1rem;
  color: #1e3a8a;
  margin-bottom: 12px;
}

.coach-basic p {
  margin: 6px 0;
  color: #374151;
  font-size: 1rem;
}

.coach-basic strong {
  color: #111827;
}

.coach-basic i {
  color: #2563eb;
  margin-right: 6px;
}

/* Thông tin chi tiết */
.coach-info {
  margin-top: 30px;
  background: linear-gradient(180deg, #f9fafb, #eef2ff);
  border-radius: 15px;
  padding: 20px 25px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);
}

.coach-info h2 {
  color: #1e3a8a;
  margin-bottom: 18px;
  font-size: 1.5rem;
  font-weight: 600;
}

.coach-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.coach-info li {
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1rem;
}

.coach-info li:last-child {
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
  transition: all 0.3s;
  box-shadow: 0 3px 10px rgba(37, 99, 235, 0.3);
}

.btn-back:hover {
  background-color: #1e40af;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.45);
}

/* Loading & empty */
.loading,
.empty {
  margin-top: 60px;
  font-size: 1.2rem;
  color: #fff;
  text-align: center;
}

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
  .coach-header {
    flex-direction: column;
    text-align: center;
  }

  .coach-avatar {
    width: 160px;
    height: 160px;
  }

  .coach-basic h1 {
    font-size: 1.7rem;
  }

  .coach-info {
    padding: 18px;
  }
}
</style>
