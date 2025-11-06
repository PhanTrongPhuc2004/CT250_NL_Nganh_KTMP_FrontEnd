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
// Import đúng các modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Form from "@/components/common/form/Form.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import MarqueeText from "vue-marquee-text-component";
import ThongBaoMoi from "./ThongBaoMoi.vue";
import MatchCard from "@/components/common/cards/matchCard/MatchCard.vue";

const handleBookSticket = () => {
  alert("Chức năng đặt vé sẽ sớm được cập nhật!");
};
const souvenirList = ref([]);
const matchList = ref([]);
const postList = ref([]);
const playerList = ref([]);
const clubInfo = ref({});
const tranDau = {
  capDau: ["Manchester United", "Chelsea"],
  diaDiem: "Sân Old Trafford",
  thoiGianDienRa: "20:00, 15/08/2024",
};

// Tạo text dài để chạy liên tục
const marqueeText = ref("");

onMounted(async () => {
  //fetch infor club
  const clubResponse = await axios.get(
    "${import.meta.env.VITE_API_BE_BASE_URL}/caulacbo/"
  );
  clubInfo.value = clubResponse.data;

  // Tạo text lặp lại nhiều lần để không bị đứt
  const baseText = clubInfo.value[0]?.moTa;
  marqueeText.value = `${baseText} • ${baseText} • ${baseText} • ${baseText}`;

  // await fetchSouvenirList();
  const souvenirListResponse = await axios.get(
    `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem`
  );
  souvenirList.value = souvenirListResponse.data;
  // await fetchMatchList();
  const matchListResponse = await axios.get(
    `${import.meta.env.VITE_API_BE_BASE_URL}/trandau`
  );
  matchList.value = matchListResponse.data;
  // await fetchPlayerList();
  const response = await axios.get(
    `${import.meta.env.VITE_API_BE_BASE_URL}/cauthu/`,
    {
      withCredentials: true,
    }
  );
  playerList.value = response.data;
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
    <div :class="cx('container', 'home-body')">
      <div>
        <h1>Tran dau gan day</h1>
        <div class="d-flex flex-wrap gap-3 flex-row w-100">
          <div class="col-md-3" v-for="(match, index) in matchList.slice(0, 3)">
            <MatchCard :item="match" />
          </div>
        </div>
      </div>

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
          <PlayerCard :item="player" type="player" />
        </swiper-slide>
      </swiper>

      <swiper
        :modules="[Autoplay]"
        :slides-per-view="4"
        :space-between="20"
        :autoplay="{ delay: 2000, disableOnInteraction: false }"
        :loop="true"
        class="souvenirSlice"
      >
        <swiper-slide v-for="(item, index) in souvenirList" :key="index">
          <PlayerCard :item="item" type="souvenir" />
        </swiper-slide>
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
