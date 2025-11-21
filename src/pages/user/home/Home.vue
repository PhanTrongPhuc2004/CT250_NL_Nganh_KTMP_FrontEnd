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
      :duration="60"
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
      <div style="background-color: var(--home-background-color);" class="p-5">
        <div  class="container">
        <h1>Tran dau gan day</h1>
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

      <div style="background-color: var(--home-background-color);" class="p-5">
        <div class="container">
          <h1>Tran dau sắp diễn ra</h1>
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
          <PlayerCard :item="player" />
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

  <div class="sponsors mt-3">
    <h6>Nhà tài trợ</h6>
    <ul
      class="sponsor-list list-unstyled d-flex flex-wrap gap-3 align-items-center justify-content-center"
    >
      <li v-for="(sponsor, index) in clubInfo[0]?.nhaTaiTro || []" :key="index">
        <i class="fas fa-star text-warning me-1"></i>{{ sponsor.ten }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Wrapper cho marquee */
.marquee-wrapper {
  width: 100%;
  height: 50px;
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
</style>
