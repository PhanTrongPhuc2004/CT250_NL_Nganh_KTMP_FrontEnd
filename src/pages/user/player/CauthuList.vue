<template>
  <div class="player-list-page">
    <h1>⚽ Danh sách Cầu thủ</h1>

    <div v-if="loading" class="loading">Đang tải dữ liệu...</div>

    <div v-else>
      <div v-if="players.length === 0" class="empty">
        Không có cầu thủ nào.
      </div>

      <div class="player-grid">
        <router-link
          v-for="player in players"
          :key="player._id"
          :to="`/cauthu/${player._id}`"
          class="player-card"
        >
          <img
            :src="resolveImage(player.anhMinhHoa)"
            alt="Ảnh cầu thủ"
            class="player-image"
          />
          <div class="player-info">
            <h3>{{ player.hoVaTen }}</h3>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const players = ref([]);
const loading = ref(true);

// ✅ Hàm xử lý hiển thị ảnh linh hoạt
const resolveImage = (anh) => {
  if (!anh) return '/default-player.jpg';
  if (anh.startsWith('http') || anh.startsWith('data:image')) return anh;
  return anh; // vì /data/... sẽ tự lấy từ public
};


const fetchPlayers = async () => {
  try {
    const res = await axios.get('http://localhost:5000/nguoidung/vaitro?q=cauthu');
    players.value = res.data;
  } catch (err) {
    console.error('Lỗi khi tải cầu thủ:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPlayers);
</script>

<style scoped>
.player-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #912e82, #6c1818, #931616);
  padding: 40px 20px;
  text-align: center;
  color: #fff;
}

/* Tiêu đề */
.player-list-page h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #ffffff;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

/* Grid hiển thị danh sách cầu thủ */
.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 30px;
  justify-content: center;
  align-items: stretch;
}

/* Thẻ cầu thủ */
.player-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: #1e3a8a;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease, box-shadow 0.3s ease, background 0.3s;
  display: flex;
  flex-direction: column;
}

.player-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  background: linear-gradient(145deg, #f8fafc, #eef2ff);
}

/* Ảnh cầu thủ */
.player-image {
  width: 100%;
  height: 230px;
  object-fit: cover;
  background: #f3f4f6;
  border-bottom: 3px solid #2563eb;
}

/* Thông tin cơ bản */
.player-info {
  padding: 15px 18px;
  text-align: center;
}

.player-info h3 {
  margin: 8px 0 5px 0;
  font-size: 1.25rem;
  color: #1e3a8a;
  font-weight: 600;
}

/* Trạng thái loading & empty */
.loading,
.empty {
  margin-top: 50px;
  font-size: 1.2rem;
  color: #f3f4f6;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Hiệu ứng xuất hiện */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.player-card {
  animation: fadeIn 0.6s ease-in-out;
}

/* Responsive */
@media (max-width: 768px) {
  .player-list-page {
    padding: 20px 10px;
  }

  .player-image {
    height: 200px;
  }

  .player-info h3 {
    font-size: 1.1rem;
  }
}
</style>

