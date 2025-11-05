<template>
  <div class="notification-page">
    <div class="container">
      <h1 class="page-title">Thông Báo Trận Đấu</h1>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <p>Đang tải thông báo...</p>
      </div>

      <!-- Không tìm thấy doiHinhId -->
      <div v-else-if="!doiHinhId" class="error-message">
        <p>Không tìm thấy thông tin đội hình. Vui lòng đăng nhập lại.</p>
        <button @click="goToHome" class="btn-primary">Về trang chủ</button>
      </div>

      <!-- Danh sách thông báo -->
      <div v-else-if="thongBaos.length > 0" class="notification-list">
        <div
          v-for="thongBao in thongBaos"
          :key="thongBao._id"
          :class="['notification-item', { unread: !thongBao.daDoc }]"
          @click="markAsRead(thongBao._id)"
        >
          <div class="notification-header">
            <h3 class="notification-title">{{ thongBao.tieuDe }}</h3>
            <span class="notification-time">
              {{ formatTime(thongBao.ngayTao) }}
            </span>
          </div>
          <p class="notification-content">{{ thongBao.noiDung }}</p>
          <div class="notification-footer">
            <span class="notification-type">{{ thongBao.loaiThongBao }}</span>
            <button
              v-if="thongBao.lienKet"
              class="btn-view-detail"
              @click.stop="goToDetail(thongBao.lienKet)"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      <!-- Không có thông báo -->
      <div v-else class="no-notifications">
        <p>Không có thông báo trận đấu nào</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { getMe } from "@/utils";

const route = useRoute();
const router = useRouter();
const thongBaos = ref([]);
const loading = ref(true);
const userInfor = ref({});
const doiHinhId = ref(null); // 👈 Khởi tạo là ref

// Lấy danh sách thông báo
const fetchThongBaos = async () => {
  try {
    loading.value = true;
    console.log("📡 Fetching thông báo cho doiHinhId:", doiHinhId.value);

    const response = await axios.get(
      `http://localhost:5000/thongbao/doihinh/${doiHinhId.value}`
    );
    thongBaos.value = response.data;
    console.log("✅ Nhận được thông báo:", response.data);
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);

    // Thử API khác nếu API trên không tồn tại
    if (error.response?.status === 404) {
      console.log("🔄 Thử API khác...");
      await tryAlternativeAPI();
    } else {
      alert("Không thể tải thông báo: " + error.message);
    }
  } finally {
    loading.value = false;
  }
};

// Thử API alternative: lấy tất cả thông báo rồi filter
const tryAlternativeAPI = async () => {
  try {
    const response = await axios.get("http://localhost:5000/thongbao");
    // Filter thông báo theo doiHinhId
    thongBaos.value = response.data.filter(
      (thongBao) =>
        thongBao.nguoiNhanId === doiHinhId.value &&
        thongBao.loaiThongBao === "tran_dau_moi"
    );
    console.log("✅ Filtered thông báo:", thongBaos.value);
  } catch (error) {
    console.error("❌ Lỗi với API alternative:", error);
  }
};

// Đánh dấu đã đọc
const markAsRead = async (thongBaoId) => {
  try {
    await axios.put(`http://localhost:5000/thongbao/${thongBaoId}/read`);

    // Cập nhật UI
    const thongBao = thongBaos.value.find((tb) => tb._id === thongBaoId);
    if (thongBao) {
      thongBao.daDoc = true;
    }
  } catch (error) {
    console.error("Lỗi khi đánh dấu đã đọc:", error);
  }
};

// Điều hướng đến chi tiết
const goToDetail = (lienKet) => {
  router.push(lienKet);
};

// Về trang chủ
const goToHome = () => {
  router.push("/");
};

// Format thời gian
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Lấy thông báo khi component mounted
onMounted(async () => {
  try {
    // Lấy thông tin user
    userInfor.value = await getMe();
    console.log("👤 userInfor:", userInfor.value);

    // Gán doiHinhId từ userInfo
    doiHinhId.value = userInfor.value?.doiHinhId || route.params.doiHinhId;
    console.log("🔍 doiHinhId:", doiHinhId.value);

    // Kiểm tra xem có doiHinhId không
    if (doiHinhId.value) {
      await fetchThongBaos();
    } else {
      console.error("❌ Không tìm thấy doiHinhId trong user info");
      loading.value = false;
    }
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin user:", error);
    loading.value = false;
  }
});
</script>

<style scoped>
.notification-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.error-message {
  text-align: center;
  padding: 40px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-primary:hover {
  background: #0056b3;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-item.unread {
  border-left-color: #dc3545;
  background: #f8f9fa;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.notification-title {
  margin: 0;
  color: #333;
  font-size: 1.1em;
}

.notification-time {
  color: #6c757d;
  font-size: 0.9em;
}

.notification-content {
  color: #555;
  margin-bottom: 10px;
  line-height: 1.5;
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-type {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  color: #495057;
}

.btn-view-detail {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.btn-view-detail:hover {
  background: #0056b3;
}

.loading,
.no-notifications {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

@media (max-width: 768px) {
  .notification-header {
    flex-direction: column;
    gap: 5px;
  }

  .notification-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
