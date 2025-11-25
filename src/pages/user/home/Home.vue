<script setup>
import classNames from "classnames/bind";
import styles from "./home.module.scss";
const cx = classNames.bind(styles);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import New from "@/components/common/new/New.vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Form from "@/components/common/form/Form.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import MarqueeText from "vue-marquee-text-component";
import ThongBaoMoi from "./ThongBaoMoi.vue";
import MatchCard from "@/components/common/cards/matchCard/MatchCard.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { fetchClubInfo } from "@/utils";
import backgroundImage from '../../../assets/images/match-list-backgound.png';
const router = useRouter();

const handleBookSticket = () => {
  router.push("/ve");
};

const souvenirList = ref([]);
const matchList = ref([]);
const postList = ref([]);
const playerList = ref([]);
const clubInfo = ref({});
const matchPlayed = ref([]);
const upComingMatch = ref([]);

const tranDau = computed(() => {
  if (matchList.value.length > 0) {
    const firstMatch = matchList.value[0];
    return {
      capDau: [firstMatch.doiNha, firstMatch.doiKhach],
      diaDiem: firstMatch.diaDiem,
      thoiGianDienRa: firstMatch.thoiGianDienRa,
    };
  }
  return {
    capDau: ["Đang tải...", "Đang tải..."],
    diaDiem: "Đang tải...",
    thoiGianDienRa: "Đang tải...",
  };
});


const marqueeText = ref("");

const fetchSouvenirList = async () => {
  try {
    const response = await axios.get(
    `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem`,
    {
      withCredentials: true,
    });
    return response.data;
    
  } catch (error) {
    console.log(error);
  }
}

const fetchMatchList = async () => {
  try {
    const response = await axios.get(
    `${import.meta.env.VITE_API_BE_BASE_URL}/trandau`,
    {
      withCredentials: true,
    }
  );
  upComingMatch.value = response?.data.filter((match) => match.trangThai == 'chua_bat_dau');
  matchPlayed.value = response?.data.filter((match) => match.trangThai == 'ket_thuc');
  return response.data;
  } catch (error) {
    console.log(error);
  }

}

const fetchPlayerList = async () => {
  try {
    const response = await axios.get(
    `${import.meta.env.VITE_API_BE_BASE_URL}/cauthu/`,
    {
      withCredentials: true,
    }
  );
  return response.data;
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  
  clubInfo.value = await fetchClubInfo()

  const baseText = clubInfo.value[0]?.moTa;
  marqueeText.value = `${baseText} • ${baseText} • ${baseText} • ${baseText}`;

  souvenirList.value = await fetchSouvenirList();
  matchList.value = await fetchMatchList()
  playerList.value =await  fetchPlayerList();

  
});
</script>

<template>
  <div>
    <img
      src="../../../assets/images/old-traford.jpg"
      alt=""
      :class="cx('thumbnail')"
    />
    <div :class="cx('slogan', 'col-md-5')">
      {{ clubInfo[0]?.slogan }}
    </div>
  </div>

  <!-- Marquee chạy liên tục -->
  <div class="marquee-wrapper">
    <MarqueeText
      :duration="90"
      :repeat="2"
      :paused="false"
      class="marquee-text"
    >
      {{ marqueeText }}
    </MarqueeText>
  </div>

  <div :class="cx('next-match')">
    <div>
      <div>
        <h4>{{ `${tranDau.capDau[0]} vs ${tranDau.capDau[1]}` }}</h4>
        <h5>{{ tranDau.diaDiem }}</h5>
        <h5>{{ tranDau.thoiGianDienRa }}</h5>
        <button
          type="button"
          class="btn btn-warning"
          @click="handleBookSticket"
        >
          Đặt vé ngay
        </button>
      </div>
    </div>
    <div>
      <FontAwesomeIcon :icon="['fas', 'angle-right']" :class="'display-3'" />
    </div>
  </div>
  <section class="mt-5">
    <ThongBaoMoi />
  </section>
  <div :class="cx('home-wrapper')">
    <div :class="cx('', 'home-body')">
      <div 
        :style="{ backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'multiply' }" 
        class="p-5"
      >
        <div  class="container">
        <h1 class="fw-bold text-white d-flex align-items-center mb-4">Trận đấu gần đây <FontAwesomeIcon icon="fas fa-angle-right"/> </h1>
        <div class="d-flex flex-wrap gap-3 flex-row col-md-12">
          <swiper
            :modules="[Autoplay, Navigation, Pagination]"
            :slides-per-view="Math.min(3, matchPlayed.length)"
            :space-between="20"
            :autoplay="{ delay: 2000, disableOnInteraction: false }"
            :loop="matchPlayed.length > 6"
            :navigation="matchPlayed.length > 3"
            :pagination="{ clickable: matchPlayed.length > 1 }"
            class="playerSlice"
          >
            <swiper-slide
              v-for="(match, index) in matchPlayed"
              :key="index"
            >
              <div class="col-md-12">
                <MatchCard :item="match" />
              </div>
            </swiper-slide>
            
            <!-- Hiển thị thông báo khi không có trận đấu -->
            <div v-if="matchPlayed.length === 0" class="text-center py-5">
              <p class="text-muted">Không có trận đấu nào để hiển thị</p>
            </div>
          </swiper>
        </div>
      </div>
      </div>
      <div class="py-5" >
        <div class="container">
          <div class="d-flex">
            
          <!-- LEFT CONTENT -->
          <div class="col-md-6 pe-3"  >
            <h1 class="fw-bold mb-4 " style="font-size: 48px; color: var(--primary-color);">Tinh thần của {{ clubInfo[0]?.ten }}</h1>

            <p class="mb-4 fs-4" style="color: var(--primary-color);">
              {{ clubInfo[0]?.moTa }}
            </p>
            <div class="border"></div>
            <div class="d-flex justify-content-between mt-4 pt-3 border-top border-light">
              <span class="fw-bold" style="color: #FFC107;">CLUB</span>
              <span class="text-danger" style="color: var(--primary-color);">12 NOV 2025</span>
            </div>
          </div>

          <!-- RIGHT IMAGE -->
          <div class="col-md-6 text-center" style="background-color: var(--primary-color);">
            <img 
              src="../../../assets/images/home-content-img.png" 
              alt="CTU FC"
              style="max-height: 420px; object-fit: cover;"
            >
          </div>
          </div>

        </div>
      </div>
      <div  >
        <div 
          :style="{ backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'multiply' }" 
          class="p-5"
        >
          <h1 class="fw-bold text-white d-flex align-items-center mb-4">Trận đấu sắp diễn ra <FontAwesomeIcon icon="fas fa-angle-right"/> </h1>

          <div class="d-flex flex-wrap gap-3 flex-row w-100">
            <swiper
              :modules="[Autoplay, Navigation, Pagination]"
              :slides-per-view="Math.min(3, upComingMatch.length)"
              :space-between="20"
              :autoplay="{ delay: 2000, disableOnInteraction: false }"
              :loop="upComingMatch.length > 6"
              :navigation="upComingMatch.length > 3"
              :pagination="{ clickable: upComingMatch.length > 1 }"
              class="playerSlice"
            >
              <swiper-slide
                v-for="(match, index) in upComingMatch"
                :key="index"
              >
                <div class="col-md-12">
                  <MatchCard :item="match" />
                </div>
              </swiper-slide>
              
              <!-- Hiển thị thông báo khi không có trận đấu -->
              <div v-if="upComingMatch.length === 0" class="text-center py-5">
                <p class="text-muted">Không có trận đấu nào để hiển thị</p>
              </div>
            </swiper>
          </div>
        </div>
      </div>
      
      <div>
        <div class="container">
          <swiper
          :modules="[Autoplay, Navigation, Pagination]"
          :slides-per-view="3"
          :space-between="20"
          :autoplay="{ delay: 2000, disableOnInteraction: false }"
          :loop="true"
          :navigation="true"
          :pagination="{ clickable: true }"
          class="playerSlice"
        >
          <swiper-slide v-for="(player, index) in playerList" :key="index">
            <PlayerCard :item="player" height="400px"/>
          </swiper-slide>
        </swiper>
      </div>
      </div>

      <swiper
        :modules="[Autoplay]"
        :slides-per-view="4"
        :space-between="20"
        :autoplay="{ delay: 2000, disableOnInteraction: false }"
        :loop="true"
        class="souvenirSlice"
      >
        <!--bỏ các quà lưu niệm vào đây-->
      </swiper>
    </div>
  </div>
  <div style="background-color: var(--home-background-color-souvenir); overflow: hidden;" class="items-list">
    <div class="container">
      <div class="row align-items-center py-5">

        <!-- LEFT CONTENT -->
        <div class="col-lg-6 text-white">
          <h1 class="display-4 fw-bold mb-4 animate-fade-in">
            Những món quà lưu niệm của CTU FC!
          </h1>

          <p class="lead mb-4 opacity-75 animate-fade-in" style="animation-delay: 0.2s;">
            Một món quà lưu niệm đầy ý nghĩa, tái hiện lịch sử đáng tự hào qua nhiều thế hệ của CTU FC — được trình bày sinh động
             trong ấn phẩm minh hoạ tuyệt đẹp, ghi lại hành trình hình thành, phát triển và những khoảnh khắc đáng nhớ nhất.
          </p>

          <div class=" fs-5 fw-bold d-inline-flex align-items-center animate-fade-in">
            <a href="/shop"  class="text-white ">
              Mua ngay tại cửa hàng 
            </a>
            <FontAwesomeIcon icon="fas fa-angle-right" class="ms-2"/>
          </div>
        </div>

        <!-- RIGHT IMAGE -->
        <div class="col-lg-6 text-center animate-fade-in" >
          <div >
            <img 
              src="../../../assets/images/qua-luu-niem.png" 
              alt="CTU FC Book"
              class="img-fluid"
              style="max-height: 450px;"
            >
            <div class="image-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  
</template>

<style scoped>
/* Wrapper cho marquee */
.marquee-wrapper {
  width: 100%;
  height: 40px;
  background: linear-gradient(90deg, #dc3545 0%, #8b0000 50%, #dc3545 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
}

/* Style cho MarqueeText component */
.marquee-text {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

/* Style cho sponsors */
.sponsors h6 {
  font-weight: 600;
  color: #dc3545;
  margin-bottom: 0.75rem;
}

.sponsor-list li {
  background-color: #343a40;
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  transition: transform 0.2s, background-color 0.3s;
}

.sponsor-list li:hover {
  background-color: #495057;
  transform: translateY(-2px);
}

.sponsor-list i {
  font-size: 0.75rem;
}

.items-list:hover img{
  transform: scale(1.7);
  transition: transform 8s;

}
</style>
