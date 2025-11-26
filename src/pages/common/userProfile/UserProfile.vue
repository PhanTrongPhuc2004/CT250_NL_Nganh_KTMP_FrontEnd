<script setup>
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import MatchCard from "@/components/common/cards/matchCard/MatchCard.vue";
import Form from "@/components/common/form/Form.vue";
import { playerFields, huanLuyenVienFields, nguoiHamMoFields, adminFields } from "@/utils/constanst";
import { watch } from "vue";
const props = defineProps({
  user: {
    type: Object,
    required: false,
    default: null,
  },
});

const matchOfPlayer = ref([]);
const formEditProfileState = ref(false);
const editInforApi = ref("");
const store = useUserStore?.();

// 🧭 Lấy user từ store hoặc props - TẠO REACTIVE REF
const userData = ref({});

// Theo dõi thay đổi từ store hoặc props
watch(
  () => props.user || store?.user,
  (newUser) => {
    userData.value = { ...newUser }; // Tạo object mới để trigger reactivity
  },
  { immediate: true, deep: true }
);

// 🎭 Hàm xác định vai trò
const role = computed(() => userData.value?.vaiTro?.toLowerCase() || "nguoihammo");

const editProfileFiled = computed(() => {
  switch (role.value) {
    case "cauthu":
      return playerFields;  
    case "huanluyenvien":
      return huanLuyenVienFields;
    case "nguoihammo":
      return nguoiHamMoFields;
    case "admin":
      return adminFields;
    default:
      return [];
  }
});

// Lấy các trận đấu của cầu thủ, HLV
const getMatchOfUser = async () => {
  if (!userData.value?.maNguoiDung) {
    console.error("❌ maNguoiDung là undefined! Không thể gọi API");
    return [];
  }

  try {
    const response = await axios.get(
      `http://localhost:5000/trandau/cauthu/${userData.value.maNguoiDung}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trận đấu:", error);
    return [];
  }
};

// 🔄 Hàm refetch dữ liệu user - GIỐNG NHƯ fetchMatchesBySeason
const refetchUserData = async () => {
  try {
    if (userData.value?._id) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/${userData.value._id}`,
        { withCredentials: true }
      );
      
      // CẬP NHẬT userData với dữ liệu mới - QUAN TRỌNG
      userData.value = { ...response.data };
      console.log("✅ Đã refetch user data:", userData.value);
    }
    
    // Refetch danh sách trận đấu
    matchOfPlayer.value = await getMatchOfUser();
    console.log("✅ Đã refetch danh sách trận đấu");
    
  } catch (error) {
    console.error("Lỗi khi refetch user data:", error);
  }
};

const showFormEditProfile = () => {
  editInforApi.value = `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/${userData.value?._id}`;
  formEditProfileState.value = true;
}

// 🎯 Hàm xử lý sau khi submit thành công - GIỐNG NHƯ handleMatchSubmitted
const handleFormSubmitted = async (responseData) => {
  console.log("✅ Form submitted thành công, đang cập nhật UI...", responseData);
  
  // 1. Đóng form
  formEditProfileState.value = false;
  
  // 2. GỌI LẠI API ĐỂ LẤY DỮ LIỆU MỚI - GIỐNG NHƯ fetchMatchesBySeason
  await refetchUserData();
  
  console.log("✅ UI đã được cập nhật với dữ liệu mới");
};

// 🎯 Hàm xử lý khi đóng form
const handleCloseForm = () => {
  formEditProfileState.value = false;
};

onMounted(async () => {
  // Load dữ liệu ban đầu
  matchOfPlayer.value = await getMatchOfUser();
});
</script>

<template>
  <div class="container">
    <div class="position-relative ">
      <div class="d-flex justify-content-end">
        <div class="w-100 d-flex flex-column" style="height: 100vh; color: var(--primary-color);">
          <span class="fw-bold" style="font-size: 170px;">{{ userData.hoVaTen }}</span>
          <div v-if="role == 'cauthu'" class="d-flex flex-column">
            <span class="fw-bold" style="font-size: 150px;">{{ userData.soAo }}</span>
            <span class="fw-bold fs-1" >{{ userData.viTri }}</span>
            <span class="fw-bold fs-1">{{ userData.ngaySinh }}</span>
            <span class="fw-bold fs-1">{{ userData.cauLacBoCu }}</span>
          </div>
          <div v-if="role == 'huanluyenvien'">
            <span class="fw-bold" style="font-size: 150px;">{{ userData.viTri }}</span>
            <span class="fw-bold fs-1">{{ userData.quocTich }}</span>
            <span class="fw-bold fs-1">{{ userData.phuTrach }}</span>
          </div>
          <div v-if="role == 'admin'">
            <span class="fw-bold fs-1">{{ userData.email }}</span>

          </div>
        </div>

        <img
          :src="userData.anhMinhHoa || 'https://via.placeholder.com/150'"
          class="col-md-6 h-100 position-absolute"
          :style="{
            objectPosition: 'top',
            zIndex: 50
          }"
          alt="Ảnh người dùng"
        />
        <button 
          class="btn text-white d-flex align-items-center gap-2 position-absolute top-0 end-0"  
          style="z-index: 10; background: rgba(0,0,0,0.5); z-index: 51;" 
          @click="showFormEditProfile"
        >
          <FontAwesomeIcon icon="fa-solid fa-pen" />
          <p class="m-0">Chỉnh sửa thông tin</p>
        </button>
      </div>
    </div>
    
    

    

    <div class="d-flex flex-wrap gap-3 mt-4" v-if="matchOfPlayer.length > 0">
      <div class="col-md-2" v-for="(match, index) in matchOfPlayer" :key="match._id || index">
        <MatchCard :item="match" />
      </div>
    </div>
    
    <div v-else-if="role === 'cauthu'" class="mt-4">
      <p class="text-muted">Chưa có trận đấu nào</p>
    </div>
  </div>
  
  <!-- Form component -->
  <Form 
    v-if="formEditProfileState"
    :input-fields="editProfileFiled"
    :input-data="userData"
    @closed="handleCloseForm"
    @submitted="handleFormSubmitted"
    :api="editInforApi"
    method="put"
    formName="Chỉnh sửa thông tin cá nhân"
  />
</template>

<style scoped>
img {
  object-fit: cover;
}

.btn {
  backdrop-filter: blur(5px);
}
</style>