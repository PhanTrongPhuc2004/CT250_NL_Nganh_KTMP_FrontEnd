<template>
  <div class="player-list-page container py-5">
    <h1 class="text-center fw-bold mb-5 text-primary text-uppercase">
      Danh sách Cầu thủ & Huấn luyện viên
    </h1>

    <div v-if="loading" class="text-center text-secondary fs-5 py-5">
      <div class="spinner-border text-primary me-2"></div>
      Đang tải dữ liệu...
    </div>

    <div v-else>
      <!-- ⚽ Huấn luyện viên -->
      <section class="mb-5">
        <h2 class="section-title text-danger">
          <i class="bi bi-person-badge me-2"></i>Huấn luyện viên
        </h2>
        <div v-if="coaches.length === 0" class="alert alert-warning mt-3">
          Không có huấn luyện viên nào.
        </div>

        <div class="row g-4 mt-2 justify-content-center">
          <div
            v-for="coach in coaches"
            :key="coach._id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <router-link
              :to="`/huanluyenvien/${coach._id}`"
              class="text-decoration-none"
            >
              <div class="card player-card shadow-sm border-0">
                <img
                  :src="resolveImage(coach.anhMinhHoa)"
                  class="card-img-top player-image"
                  alt="Ảnh huấn luyện viên"
                />
                <div class="card-body text-center">
                  <h5 class="card-title fw-semibold text-dark mb-0">
                    {{ coach.hoVaTen }}
                  </h5>
                  <!-- <p class="text-muted small mt-1">Huấn luyện viên</p> -->
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- 🧑‍🎓 Cầu thủ -->
      <section>
        <h2 class="section-title text-success">
          <i class="bi bi-person-fill me-2"></i>Cầu thủ
        </h2>
        <div v-if="players.length === 0" class="alert alert-warning mt-3">
          Không có cầu thủ nào.
        </div>

        <div class="row g-4 mt-2 justify-content-center">
          <div
            v-for="player in players"
            :key="player._id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <router-link
              :to="`/cauthu/${player._id}`"
              class="text-decoration-none"
            >
              <div class="card player-card shadow-sm border-0">
                <img
                  :src="resolveImage(player.anhMinhHoa)"
                  class="card-img-top player-image"
                  alt="Ảnh cầu thủ"
                />
                <div class="card-body text-center">
                  <h5 class="card-title fw-semibold text-dark mb-0">
                    {{ player.hoVaTen }}
                  </h5>
                  <!-- <p class="text-muted small mt-1">Cầu thủ</p> -->
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const players = ref([]);
const coaches = ref([]);
const loading = ref(true);

const resolveImage = (anh) => {
  if (!anh) return "/default-player.jpg";
  if (anh.startsWith("http") || anh.startsWith("data:image")) return anh;
  return anh;
};

const fetchData = async () => {
  try {
    loading.value = true;
    const [playersRes, coachesRes] = await Promise.all([
      axios.get(
        `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/vaitro?q=cauthu`
      ),
      axios.get(
        `${
          import.meta.env.VITE_API_BE_BASE_URL
        }/nguoidung/vaitro?q=huanluyenvien`
      ),
    ]);
    players.value = playersRes.data;
    coaches.value = coachesRes.data;
  } catch (err) {
    console.error("❌ Lỗi khi tải dữ liệu:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
h1{
  color: #8B2C31 !important;
}
.player-list-page {
  background: linear-gradient(120deg, #f8fafc, #e8f0ff);
  border-radius: 12px;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  position: relative;
  margin-bottom: 20px;
  padding-left: 8px;
}

.section-title::after {
  content: "";
  display: block;
  width: 80px;
  height: 3px;
  background-color: currentColor;
  margin-top: 8px;
  border-radius: 2px;
}

/* Card Styling */
.player-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.player-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.player-image {
  height: 250px;
  object-fit: cover;
  border-bottom: 3px solid #ddd;
}

.card-body {
  background: #fff;
}

@media (max-width: 768px) {
  .player-image {
    height: 200px;
  }
}
</style>
