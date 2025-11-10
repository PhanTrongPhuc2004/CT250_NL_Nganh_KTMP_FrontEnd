<template>
  <div class="coach-detail-page">
    <div v-if="loading" class="loading">
      🧢 Đang tải dữ liệu huấn luyện viên...
    </div>

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
          <p>
            <i class="bi bi-flag"></i> <strong>Quốc tịch:</strong>
            {{ coach.quocTich || "Không rõ" }}
          </p>
          <p>
            <i class="bi bi-building"></i> <strong>CLB cũ:</strong>
            {{ coach.cauLacBoCu || "Không có" }}
          </p>
          <p>
            <i class="bi bi-calendar-check"></i>
            <strong>Năm hành nghề:</strong>
            {{ coach.namHanhNghe || "Không rõ" }}
          </p>
          <p>
            <i class="bi bi-calendar-plus"></i> <strong>Ngày gia nhập:</strong>
            {{ formatDate(coach.ngayGiaNhap) }}
          </p>
        </div>
      </div>

      <!-- Thông tin chi tiết -->
      <div class="coach-info">
        <h2>📋 Thông tin chi tiết</h2>
        <ul>
          <li><strong>Năm sinh:</strong> {{ coach.namSinh || "Không rõ" }}</li>
          <li><strong>Email:</strong> {{ coach.email || "Không có" }}</li>
          <li><strong>Số điện thoại:</strong> {{ coach.sdt || "Không có" }}</li>
          <li><strong>Địa chỉ:</strong> {{ coach.diaChi || "Không rõ" }}</li>
        </ul>
              <!-- Phần giới thiệu chung -->
      <div class="coach-intro card mb-4 shadow-sm">
        <h3 class="intro-title">
          <i class="bi bi-trophy-fill me-2"></i>
          Tinh thần dẫn dắt đội bóng
        </h3>
        <p class="intro-text">
          Huấn luyện viên {{ coach.hoVaTen }} là biểu tượng của sự quyết tâm, 
          chiến thắng và tinh thần đồng đội. Với sự dẫn dắt tận tâm, lòng nhiệt huyết và 
          chiến lược sắc bén, ông luôn truyền cảm hứng để các cầu thủ nỗ lực hết mình trong mỗi trận đấu.
        </p>
      </div>
      </div>

      <!-- Nút quay lại -->
      <div class="back-btn">
        <router-link to="/cauthu" class="btn-back">
          ⬅️ Quay lại danh sách
        </router-link>
      </div>
    </div>

    <div v-else class="empty">⚠️ Không tìm thấy thông tin huấn luyện viên.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const coach = ref(null);
const loading = ref(true);

// ✅ Xử lý ảnh linh hoạt
const resolveImage = (anh) => {
  if (!anh) return "/default-coach.jpg";
  if (anh.startsWith("http") || anh.startsWith("data:image")) return anh;
  return `/${anh}`;
};

// ✅ Fetch chi tiết HLV
const fetchCoach = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/${id}`
    );
    coach.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải chi tiết huấn luyện viên:", err);
  } finally {
    loading.value = false;
  }
};

// ✅ Format ngày
const formatDate = (dateString) => {
  if (!dateString) return "Không rõ";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
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
  background: linear-gradient(135deg, #8B2C31, #5a1f22, #a11c1c);
  background-size: 200% 200%;
  animation: gradientMove 10s ease infinite;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Card chính */
.coach-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.25);
  max-width: 850px;
  width: 100%;
  padding: 35px;
  color: #111827;
  animation: fadeIn 0.6s ease-in-out;
}

/* ===== Phần giới thiệu HLV ===== */
.coach-intro {
  width: 100%;
  background: linear-gradient(135deg, rgba(139,44,49,0.1), rgba(139,44,49,0.05));
  border-left: 6px solid #8B2C31;
  border-radius: 15px;
  padding: 20px 25px;
  box-shadow: 0 4px 15px rgba(139,44,49,0.2);
}

.coach-intro .intro-title {
  color: #8B2C31;
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.coach-intro .intro-title i {
  color: #8B2C31;
}

.coach-intro .intro-text {
  font-size: 1rem;
  color: #4b2a2a;
  line-height: 1.6;
}

/* Header (ảnh + thông tin cơ bản) */
.coach-header {
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom: 2px solid #8B2C31;
  padding-bottom: 25px;
}

.coach-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #8B2C31;
  box-shadow: 0 0 20px rgba(139,44,49,0.5);
  background-color: #fefefe;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.coach-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(139,44,49,0.7);
}

/* Thông tin cơ bản */
.coach-basic h1 {
  font-size: 2.1rem;
  color: #8B2C31;
  margin-bottom: 12px;
}

.coach-basic p {
  margin: 6px 0;
  color: #4b2a2a;
  font-size: 1rem;
}

.coach-basic strong {
  color: #111827;
}

.coach-basic i {
  color: #8B2C31;
  margin-right: 6px;
}

/* Thông tin chi tiết */
.coach-info {
  margin-top: 30px;
  background: linear-gradient(180deg, #fff0f0, #fff5f5);
  border-radius: 15px;
  padding: 25px;
  box-shadow: inset 0 0 8px rgba(139,44,49,0.1);
}

.coach-info h2 {
  color: #8B2C31;
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
  padding: 12px 0;
  border-bottom: 1px solid rgba(139,44,49,0.2);
  font-size: 1rem;
  color: #4b2a2a;
  display: flex;
  align-items: center;
}

.coach-info li:last-child {
  border-bottom: none;
}

.coach-info li i {
  color: #8B2C31;
  margin-right: 10px;
}

/* Nút quay lại */
.back-btn {
  margin-top: 35px;
  text-align: center; /* đảm bảo nội dung bên trong cha căn giữa */
  display: flex;
  justify-content: center; /* căn giữa ngang */
}

.btn-back {
  background-color: #2f1180;
  color: white;
  padding: 12px 26px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(139,44,49,0.4);
}


.btn-back:hover {
  background-color: #611d23;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(139,44,49,0.6);
}

/* Loading & empty */
.loading,
.empty {
  margin-top: 60px;
  font-size: 1.3rem;
  text-align: center;
}

/* Animation fadeIn */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
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

  .coach-info, .coach-intro {
    padding: 18px;
  }

  .coach-intro .intro-title {
    font-size: 1.4rem;
  }

  .coach-intro .intro-text {
    font-size: 0.95rem;
  }
}

</style>
