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
          <p>
            <i class="bi bi-person-badge"></i> <strong>Vị trí:</strong>
            {{ player.viTri || "Chưa cập nhật" }}
          </p>
          <p>
            <i class="bi bi-flag"></i> <strong>Quốc tịch:</strong>
            {{ player.quocTich || "Không rõ" }}
          </p>
          <p>
            <i class="bi bi-hash"></i> <strong>Số áo:</strong>
            {{ player.soAo || "N/A" }}
          </p>
          <p>
            <i class="bi bi-building"></i> <strong>CLB cũ:</strong>
            {{ player.cauLacBoCu || "Không có" }}
          </p>
        </div>
      </div>

      <!-- Thông tin chi tiết -->
      <div class="player-info">
        <h4 class="fw-semibold text-dark mb-4">
          <i class="bi bi-info-circle text-primary me-2"></i>Thông tin chi tiết
        </h4>
        <ul>
          <li><strong>Ngày sinh:</strong> {{ formatDate(player.namSinh) }}</li>
          <li>
            <strong>Chiều cao:</strong>
            {{ player.chieuCao ? player.chieuCao + " cm" : "Chưa có" }}
          </li>
          <li>
            <strong>Chân thuận:</strong> {{ player.chanThuan || "Không rõ" }}
          </li>
          <li><strong>Năm hành nghề:</strong> {{ player.namHanhNghe || 0 }}</li>
          <li>
            <strong>Ngày gia nhập:</strong> {{ formatDate(player.ngayGiaNhap) }}
          </li>
          <li><strong>Email:</strong> {{ player.email || "Không có" }}</li>
          <!-- <li>
            <strong>Số điện thoại:</strong> {{ player.sdt || "Không có" }}
          </li> -->
        </ul>
        <!-- Phần giới thiệu chung -->
        <div class="player-intro card mb-4 shadow-sm">
          <h3 class="intro-title">
            <i class="bi bi-trophy-fill me-2"></i>
            Tinh thần chiến đấu của đội bóng
          </h3>
          <p class="intro-text">
            Mỗi cầu thủ đều mang trong mình niềm đam mê bất tận với trái bóng. 
            Với sự quyết tâm chiến thắng, lòng nhiệt huyết và tinh thần đồng đội, 
            họ luôn nỗ lực hết mình để mang về chiến thắng cho đội bóng và cổ vũ tinh thần người hâm mộ.
          </p>
        </div>

      </div>

      <!-- Nút quay lại -->
      <div class="text-center mt-4">
        <router-link to="/cauthu" class="btn btn-primary btn-lg shadow-sm px-4">
          <i class="bi bi-arrow-left-circle me-2"></i> Quay lại danh sách
        </router-link>
      </div>
    </div>

    <div v-else class="empty">⚠️ Không tìm thấy thông tin cầu thủ.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// --- Khai báo ---
const route = useRoute();
const player = ref(null);
const loading = ref(true);

// ✅ Hàm xử lý ảnh linh hoạt
const resolveImage = (anh) => {
  if (!anh) return "/default-player.jpg"; // ảnh mặc định nếu không có
  if (anh.startsWith("http") || anh.startsWith("data:image")) return anh; // ảnh URL hoặc Base64
  return `/${anh}`; // ảnh từ public/data
};

// --- Hàm fetch chi tiết cầu thủ ---
const fetchPlayer = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const res = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/${id}`
    );
    player.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải chi tiết cầu thủ:", err);
  } finally {
    loading.value = false;
  }
};

// --- Hàm format ngày ---
const formatDate = (dateString) => {
  if (!dateString) return "Không rõ";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

// --- Lifecycle ---
onMounted(fetchPlayer);
</script>

<style scoped>
/* ===== Toàn trang ===== */
.player-detail-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #8B2C31, #5a1f22, #a11c1c);
  background-size: 200% 200%;
  animation: gradientMove 10s ease infinite;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ===== Card chính ===== */
.player-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.25);
  max-width: 880px;
  width: 100%;
  padding: 35px;
  animation: fadeIn 0.6s ease-in-out;
}

/* ===== Header ===== */
.player-header {
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom: 2px solid #8B2C31;
  padding-bottom: 25px;
}

.player-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #8B2C31;
  box-shadow: 0 0 20px rgba(139,44,49,0.5);
  background-color: #fefefe;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.player-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(139,44,49,0.7);
}

/* ===== Thông tin cơ bản ===== */
.player-basic h1 {
  font-size: 2.4rem;
  color: #8B2C31;
  margin-bottom: 12px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.player-basic p {
  margin: 6px 0;
  color: #4b2a2a;
  font-size: 1rem;
  line-height: 1.5;
}

.player-basic strong {
  color: #111827;
}

.player-basic i {
  color: #8B2C31;
  margin-right: 6px;
}

/* ===== Thông tin chi tiết ===== */
.player-info {
  margin-top: 30px;
  background: linear-gradient(180deg, #fff0f0, #fff5f5);
  border-radius: 15px;
  padding: 25px 30px;
  box-shadow: inset 0 0 8px rgba(139,44,49,0.1);
}

.player-info h4 {
  color: #8B2C31;
  margin-bottom: 20px;
  font-size: 1.6rem;
  font-weight: 700;
}

.player-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.player-info li {
  padding: 12px 0;
  border-bottom: 1px solid rgba(139,44,49,0.2);
  font-size: 1rem;
  color: #4b2a2a;
  display: flex;
  align-items: center;
}

.player-info li:last-child {
  border-bottom: none;
}

.player-info li i {
  color: #8B2C31;
  margin-right: 10px;
}

/* ===== Nút quay lại ===== */
.btn-back {
  background-color: #8B2C31 !;
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

/* ===== Trạng thái tải và trống ===== */
.loading, .empty {
  margin-top: 60px;
  font-size: 1.3rem;
  color: #fff;
  text-align: center;
  text-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

/* ===== Animation fadeIn ===== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== Responsive ===== */
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
    font-size: 1.9rem;
  }

  .player-info {
    padding: 20px;
  }
}
/* ===== Phần giới thiệu chung ===== */
.player-intro {
  width: 100%;
  max-width: 880px;
  background: linear-gradient(135deg, rgba(139,44,49,0.1), rgba(139,44,49,0.05));
  border-left: 6px solid #8B2C31;
  border-radius: 15px;
  padding: 20px 25px;
  box-shadow: 0 4px 15px rgba(139,44,49,0.2);
  animation: fadeIn 0.8s ease-in-out;
  margin-bottom: 30px;
}

.player-intro .intro-title {
  color: #8B2C31;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.player-intro .intro-title i {
  color: #8B2C31;
}

.player-intro .intro-text {
  font-size: 1rem;
  color: #4b2a2a;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .player-intro .intro-title {
    font-size: 1.4rem;
  }
  .player-intro .intro-text {
    font-size: 0.95rem;
  }
}

</style>
