<script setup>
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/userStore"; // nếu bạn dùng Pinia
import axios from "axios";
import MatchCard from "@/components/common/cards/matchCard/MatchCard.vue";
// ⚙️ Props (nếu không dùng store)
const props = defineProps({
  user: {
    type: Object,
    required: false,
    default: null,
  },
});
const matchOfPlayer = ref([]);

//lay cac tran dau cua cau thu, hlv
const getMatchOfUser = async () => {
  // DEBUG: Kiểm tra props.user
  console.log("🔍 Debug props.user:", userData);
  console.log("🔍 Debug maNguoiDung:", userData?.value.maNguoiDung);

  if (!userData?.value.maNguoiDung) {
    console.error("❌ maNguoiDung là undefined! Không thể gọi API");
    console.error("User object:", userData);
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:5000/trandau/cauthu/${userData?.value.maNguoiDung}`, // Sửa port 3000
      {
        withCredentials: true,
      }
    );
    console.log(
      "da goi API",
      `http://localhost:5000/trandau/cauthu/${userData?.value.maNguoiDung}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trận đấu:", error);
  }
};

// 🧭 Lấy user từ store hoặc props
const store = useUserStore?.();
const userData = computed(() => props.user || store?.user || {});

// 🎭 Hàm xác định vai trò
const role = computed(
  () => userData.value?.vaiTro?.toLowerCase() || "nguoihammo"
);

onMounted(async () => {
  console.log("thong tin ca nhan", userData);
  matchOfPlayer.value = await getMatchOfUser();
});
</script>

<template>
  <div class="container">
    <div>
      <img
        :src="userData.anhMinhHoa || 'https://via.placeholder.com/150'"
        class="shadow w-100"
        :style="{
          height: '400px',
          objectFit: 'cover',
          objectPosition: 'top', // Hiển thị phần trên cùng của ảnh
        }"
        alt="Ảnh người dùng"
      />
    </div>
    <div>
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

        <li class="list-group-item">
          <strong>Đội hình:</strong> {{ userData?.maDoiHinh || "Chưa có" }}
        </li>
      </ul>
    </div>
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

    <div class="d-flex flex-wrap gap-3">
      <div class="col-md-2" v-for="(match, index) in matchOfPlayer">
        <MatchCard :item="match" />
      </div>
    </div>
  </div>

  <!-- <div class="container py-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0 text-center">Thông tin cá nhân</h4>
      </div>

      <div class="card-body">
        <div class="text-center mb-3">
          <img
            :src="userData.anhMinhHoa || 'https://via.placeholder.com/150'"
            class="rounded-circle shadow"
            width="150"
            height="150"
            alt="Ảnh người dùng"
          />
        </div>

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
  </div> -->
</template>

<style scoped>
img {
  object-fit: cover;
}
</style>
