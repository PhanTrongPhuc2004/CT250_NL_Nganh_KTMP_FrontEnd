<script setup>
import { computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore"; // nếu bạn dùng Pinia

// ⚙️ Props (nếu không dùng store)
const props = defineProps({
  user: {
    type: Object,
    required: false,
    default: null,
  },
});

// 🧭 Lấy user từ store hoặc props
const store = useUserStore?.();
const userData = computed(() => props.user || store?.user || {});

// 🎭 Hàm xác định vai trò
const role = computed(
  () => userData.value?.vaiTro?.toLowerCase() || "nguoihammo"
);

onMounted(() => {
  console.log("thong tin ca nhan", userData);
});
</script>

<template>
  <div class="container py-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0 text-center">Thông tin cá nhân</h4>
      </div>

      <div class="card-body">
        <!-- Ảnh minh hoạ -->
        <div class="text-center mb-3">
          <img
            :src="userData.anhMinhHoa || 'https://via.placeholder.com/150'"
            class="rounded-circle shadow"
            width="150"
            height="150"
            alt="Ảnh người dùng"
          />
        </div>

        <!-- Thông tin chung -->
        <ul class="list-group mb-3">
          <li class="list-group-item">
            <strong>Họ và tên:</strong> {{ userData.hoVaTen }}
          </li>
          <li class="list-group-item">
            <strong>Email:</strong> {{ userData.email }}
          </li>
          <li class="list-group-item">
            <strong>Vai trò:</strong> {{ userData.vaiTro }}
          </li>
        </ul>

        <!-- 🎯 Hiển thị riêng theo vai trò -->
        <div v-if="role === 'cauthu'">
          <h5 class="text-primary mb-2">Thông tin cầu thủ</h5>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Vị trí:</strong> {{ userData.viTri }}
            </li>
            <li class="list-group-item">
              <strong>Chân thuận:</strong> {{ userData.chanThuan }}
            </li>
            <li class="list-group-item">
              <strong>Số áo:</strong> {{ userData.soAo }}
            </li>
            <li class="list-group-item">
              <strong>Chiều cao:</strong> {{ userData.chieuCao }} m
            </li>
            <li class="list-group-item">
              <strong>Quốc tịch:</strong> {{ userData.quocTich }}
            </li>
          </ul>
        </div>

        <div v-else-if="role === 'huanluyenvien'">
          <h5 class="text-primary mb-2">Thông tin huấn luyện viên</h5>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Năm hành nghề:</strong> {{ userData.namHanhNghe }}
            </li>
            <li class="list-group-item">
              <strong>Câu lạc bộ cũ:</strong> {{ userData.cauLacBoCu }}
            </li>
            <li class="list-group-item">
              <strong>Quốc tịch:</strong> {{ userData.quocTich }}
            </li>
            <li class="list-group-item">
              <strong>Ngày gia nhập:</strong>
              {{ userData.ngayGiaNhap?.split("T")[0] }}
            </li>
          </ul>
        </div>

        <div v-else>
          <h5 class="text-primary mb-2">Thông tin người hâm mộ</h5>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Địa chỉ:</strong> {{ userData.diaChi }}
            </li>
          </ul>
        </div>
      </div>

      <div class="card-footer text-center">
        <button class="btn btn-outline-primary me-2">Chỉnh sửa</button>
        <button class="btn btn-outline-secondary">Đăng xuất</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  object-fit: cover;
}
</style>
