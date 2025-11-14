<template>
  <div class="notification-page">
    <div class="container">
      <h1 class="page-title">Thông Báo Trận Đấu</h1>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <p>Đang kết nối...</p>
      </div>

      <!-- Trạng thái kết nối -->
      <div v-else class="connection-status">
        <div :class="['status-indicator', { connected: isConnected }]">
          {{ isConnected ? "✅ Đã kết nối" : "❌ Mất kết nối" }}
        </div>
        <button v-if="!isConnected" @click="reconnect" class="btn-retry">
          Thử lại
        </button>
      </div>

      <!-- Danh sách thông báo -->
      <div v-if="thongBaos.length > 0" class="notification-list">
        <div
          v-for="thongBao in thongBaos"
          :key="thongBao.id"
          :class="['notification-item', { unread: !thongBao.daDoc }]"
          @click="markAsRead(thongBao.id)"
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
      <div v-else-if="!loading" class="no-notifications">
        <p>Không có thông báo trận đấu nào</p>
        <p class="hint">Thông báo sẽ hiển thị ở đây khi có trận đấu mới</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import { getMe } from "@/utils";

const router = useRouter();

const thongBaos = ref([]);
const loading = ref(true);
const userInfor = ref({});
const isConnected = ref(false);
let socket = null;

// 🧩 Kết nối WebSocket
// 🧩 Kết nối WebSocket
const connectWebSocket = () => {
  try {
    socket = io(import.meta.env.VITE_API_BE_BASE_URL.replace("/api", ""), {
      withCredentials: true,
      transports: ["websocket"],
      timeout: 5000,
    });

    // ✅ DI CHUYỂN socket.on("connect") ra ngoài
    socket.on("connect", () => {
      console.log("✅ Kết nối WebSocket thành công:", socket.id);
      isConnected.value = true;
      loading.value = false;

      if (userInfor.value?.maNguoiDung) {
        socket.emit("join", userInfor.value.maNguoiDung);
        console.log(
          "🔗 Đã emit join room với user:",
          userInfor.value.maNguoiDung
        );

        // ✅ DEBUG: Kiểm tra sau khi join
        setTimeout(() => {
          console.log("🔍 Socket rooms:", socket.rooms);
        }, 1000);
      }
    });

    // ✅ THÊM: Debug tất cả events
    socket.onAny((eventName, ...args) => {
      console.log(`🔔 [SOCKET_ANY] Event: ${eventName}`, args);
    });

    // ✅ THÊM: Debug specific
    socket.on("notification", (data) => {
      console.log("🔔 [NOTIFICATION] Nhận thông báo realtime:", data);
      handleNewNotification(data);
    });

    socket.on("connect_error", (error) => {
      console.error("💥 Lỗi kết nối WebSocket:", error);
      isConnected.value = false;
      loading.value = false;
    });

    // 📢 Nhận thông báo từ hệ thống
    socket.on("system-notification", (data) => {
      console.log("🔔 Nhận thông báo hệ thống:", data);
      handleNewNotification({
        title: data.title || "Thông báo hệ thống",
        message: data.message,
        tranDauId: data.maTranDau,
        type: "system",
      });
    });
  } catch (error) {
    console.error("💥 Lỗi khi khởi tạo WebSocket:", error);
    loading.value = false;
  }
};

// 📨 Xử lý thông báo mới
const handleNewNotification = (data) => {
  const newNotification = {
    id: Date.now() + Math.random(), // ID tạm thời
    tieuDe: data.title,
    noiDung: data.message,
    ngayTao: new Date().toISOString(),
    loaiThongBao: data.type === "system" ? "hệ thống" : "trận đấu mới",
    daDoc: false,
    lienKet: data.tranDauId ? `/tran-dau/${data.tranDauId}` : null,
    rawData: data, // Giữ nguyên data gốc để xử lý sau
  };

  // Thêm thông báo mới lên đầu danh sách
  thongBaos.value.unshift(newNotification);

  // Hiển thị thông báo toast (tùy chọn)
  showToastNotification(newNotification);
};

// 🍞 Hiển thị toast notification
const showToastNotification = (notification) => {
  // Có thể sử dụng thư viện toast hoặc custom component
  if (typeof window !== "undefined" && window.showToast) {
    window.showToast({
      title: notification.tieuDe,
      message: notification.noiDung,
      type: "info",
      duration: 5000,
    });
  } else {
    // Fallback: sử dụng alert hoặc console
    console.log(
      "📢 Thông báo mới:",
      notification.tieuDe,
      "-",
      notification.noiDung
    );
  }
};

// ✅ Đánh dấu đã đọc (local only)
const markAsRead = (thongBaoId) => {
  const notification = thongBaos.value.find((t) => t.id === thongBaoId);
  if (notification && !notification.daDoc) {
    notification.daDoc = true;

    // Có thể gửi event đến server để đánh dấu đã đọc
    if (socket && isConnected.value) {
      socket.emit("mark-notification-read", {
        notificationId: thongBaoId,
        userId: userInfor.value?.maNguoiDung,
      });
    }
  }
};

// 🔄 Kết nối lại WebSocket
const reconnect = () => {
  loading.value = true;
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  setTimeout(() => {
    connectWebSocket();
  }, 1000);
};

// 📍 Điều hướng đến chi tiết
const goToDetail = (lienKet) => {
  if (lienKet) {
    router.push(lienKet);
  }
};

// ⏰ Format thời gian
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 🔥 Khởi tạo khi vào trang
onMounted(async () => {
  try {
    userInfor.value = await getMe();
    console.log("👤 User info:", userInfor.value);

    if (userInfor.value?.maNguoiDung) {
      connectWebSocket();
    } else {
      console.error("❌ Không có thông tin user");
      loading.value = false;
    }
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin user:", error);
    loading.value = false;
  }
});

// ❎ Ngắt kết nối khi rời trang
onBeforeUnmount(() => {
  if (socket) {
    socket.disconnect();
    console.log("🔌 Đã ngắt kết nối WebSocket");
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

.connection-status {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-indicator {
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}

.status-indicator.connected {
  background: #d4edda;
  color: #155724;
}

.status-indicator:not(.connected) {
  background: #f8d7da;
  color: #721c24;
}

.btn-retry {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.btn-retry:hover {
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
  white-space: nowrap;
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

.hint {
  font-size: 0.9em;
  color: #999;
  margin-top: 10px;
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

  .connection-status {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
