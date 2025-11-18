<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        

        <!-- WebSocket Notification Toast -->
        <div v-if="showRealtimeToast" class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>{{ realtimeNotification.title }}</strong> 
          <br>
          {{ realtimeNotification.message }}
          <button type="button" class="btn-close" @click="showRealtimeToast = false"></button>
        </div>

        <!-- Danh sách thông báo -->
        <div v-if="notifications.data?.length > 0">
          <div class="card border-0">
           
            <div class="card-body p-0">
              <div 
                v-for="notification in notifications.data" 
                :key="notification._id"
                class=" p-3"
              >
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="card-title mb-0 text-primary">
                    {{ notification.tieuDe }}
                  </h6>
                  <span class="badge bg-secondary">{{ formatTime(notification.thoiGianTao) }}</span>
                </div>
                <p class="card-text mb-2">{{ notification.noiDung }}</p>
                <div class="d-flex gap-2">
                  <span class="badge bg-info">{{ getLoaiLabel(notification.loai) }}</span>
                  <span class="badge bg-light text-dark">Mã: {{ notification.maThongBao }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <div class="alert alert-info">
            Không có thông báo nào
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import instance from "@/utils/axios";
import { onMounted, ref, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";
import { getMe } from "@/utils";

const notifications = ref({ data: [] });
const isConnected = ref(false);
const showRealtimeToast = ref(false);
const realtimeNotification = ref({
  title: "",
  message: ""
});
const currentUserId = ref("");

let socket = null;

// Constants
const NOTIFICATION_TYPES = {
  tapLuyen: 'Tập luyện',
  tranDau: 'Trận đấu', 
  lichTrinh: 'Lịch trình',
  ghiChu: 'Ghi chú',
  moBanVe: 'Mở bán vé',
  quaLuuNiem: 'Quà lưu niệm',
  suKien: 'Sự kiện',
  khac: 'Khác'
};

const fetchNotifications = async () => {
  try {
    const response = await instance.get(`${import.meta.env.VITE_API_BE_BASE_URL}/thongbao/tat-ca`);
    notifications.value = response.data;
  } catch (error) {
    console.error("Lỗi tải thông báo:", error);
  }
};

const connectWebSocket = async () => {
  try {
    const userInfo = await getMe();
    currentUserId.value = userInfo?.maNguoiDung;
    
    if (!currentUserId.value) return;

    socket = io(import.meta.env.VITE_API_BE_BASE_URL.replace("/api", ""), {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      isConnected.value = true;
      socket.emit("join", currentUserId.value);
    });

    socket.on("notification", handleNewNotification);
    socket.on("system-notification", handleNewNotification);

    socket.on("connect_error", () => {
      isConnected.value = false;
    });

    socket.on("disconnect", () => {
      isConnected.value = false;
    });

  } catch (error) {
    console.error("Lỗi kết nối WebSocket:", error);
  }
};

const handleNewNotification = (data) => {
  realtimeNotification.value = {
    title: data.title || "Thông báo mới",
    message: data.message || data.noiDung || "Có thông báo mới từ hệ thống"
  };
  
  showRealtimeToast.value = true;
  setTimeout(() => {
    showRealtimeToast.value = false;
  }, 8000);

  fetchNotifications();
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  
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

const getLoaiLabel = (loai) => {
  return NOTIFICATION_TYPES[loai] || 'Thông báo';
};

onBeforeUnmount(() => {
  socket?.disconnect();
});

onMounted(async () => {
  await fetchNotifications();
  await connectWebSocket();
});
</script>

<style scoped>
.border-bottom:last-child {
  border-bottom: none !important;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>