<template>
  <div class="player-list-page">
    <h1>Danh sách Cầu thủ & Huấn luyện viên</h1>

    <div v-if="loading" class="loading">⏳ Đang tải dữ liệu...</div>

    <div v-else>
            <section style="margin-top: 60px;">
        <h2>Huấn luyện viên</h2>
        <div v-if="coaches.length === 0" class="empty">
          Không có huấn luyện viên nào.
        </div>
        <div class="player-grid">
          <router-link
            v-for="coach in coaches"
            :key="coach._id"
            :to="`/huanluyenvien/${coach._id}`"
            class="player-card"
          >
            <img
              :src="resolveImage(coach.anhMinhHoa)"
              alt="Ảnh huấn luyện viên"
              class="player-image"
            />
            <div class="player-info">
              <h3>{{ coach.hoVaTen }}</h3>
            </div>
          </router-link>
        </div>
      </section>
      <!-- ⚽ Danh sách cầu thủ -->
      <section>
        <h2 >Cầu thủ</h2>
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
      </section>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const players = ref([]);
const coaches = ref([]);
const loading = ref(true);

// ✅ Hàm xử lý hiển thị ảnh linh hoạt
const resolveImage = (anh) => {
  if (!anh) return '/default-player.jpg';
  if (anh.startsWith('http') || anh.startsWith('data:image')) return anh;
  return anh; // /data/... sẽ tự load từ public
};

// ✅ Gọi API riêng cho cầu thủ và huấn luyện viên
const fetchData = async () => {
  try {
    loading.value = true;

    const [playersRes, coachesRes] = await Promise.all([
      axios.get('http://localhost:5000/nguoidung/vaitro?q=cauthu'),
      axios.get('http://localhost:5000/nguoidung/vaitro?q=huanluyenvien'),
    ]);

    players.value = playersRes.data;
    coaches.value = coachesRes.data;
  } catch (err) {
    console.error('❌ Lỗi khi tải dữ liệu:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.player-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #dfe9f3, #ffffff);
  padding: 40px 20px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-list-page h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #8a1e25;
  margin: 40px 0 25px 0;
  letter-spacing: 1px;
  position: relative;
}
/* Tiêu đề */
.player-list-page h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #333;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* Grid hiển thị danh sách người dùng */
.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 260px); /* mỗi card cố định 260px */
  gap: 30px;
  justify-content: center; /* canh giữa khi có ít người */
  align-items: start;
  width: 100%;
  max-width: 1200px;
}

/* Thẻ người dùng */
.player-card {
  width: 260px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 5px;
  overflow: hidden;
  text-decoration: none;
  color: #1e3a8a;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease, box-shadow 0.3s ease, background 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid #480909;
}

.player-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  background: linear-gradient(145deg, #f8fafc, #eef2ff);
}

/* Ảnh người dùng — cố định 250x250 */
.player-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 5px;
  margin-top: 15px;
  background: #f3f4f6;
  border: 3px solid #333;
}

/* Thông tin */
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
  color: #333;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
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
  .player-grid {
    grid-template-columns: repeat(auto-fit, 200px);
    gap: 20px;
  }

  .player-card {
    width: 200px;
  }

  .player-image {
    width: 200px;
    height: 200px;
  }

  .player-info h3 {
    font-size: 1.1rem;
  }
}
</style>

