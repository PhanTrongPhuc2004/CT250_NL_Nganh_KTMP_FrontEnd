<!-- src/pages/user/home/Home.vue -->
<script setup>
import classNames from "classnames/bind";
import styles from "./home.module.scss";
const cx = classNames.bind(styles);

/* ĐÃ SỬA ĐÚNG CÁCH IMPORT FONTAWESOME CHO @fortawesome/vue-fontawesome@3 */
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* Thêm tất cả icon solid vào library */
library.add(fas);

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import ThongBaoMoi from "./ThongBaoMoi.vue";
import MatchCard from "@/components/common/cards/matchCard/MatchCard.vue";
import PlayerCard from "@/components/common/cards/playerCard/PlayerCard.vue";
import MarqueeText from "vue-marquee-text-component";
import { fetchClubInfo } from "@/utils";

const router = useRouter();

/* === HÀM ĐẶT VÉ CHUNG === */
const bookMatch = (match) => {
  if (!match) return;

  const maTranDau = match.maTranDau || match._id;
  if (!maTranDau) return;

  router.push({
    path: "/ve",
    query: {
      maTranDau,
      maMuaGiai: match.maMuaGiai || "",
      maGiaiDau: match.maGiaiDau || "",
    },
  });
};

/* === DATA === */
const clubInfo = ref({});
const marqueeText = ref("");
const matchList = ref([]);
const upComingMatch = ref([]);
const matchPlayed = ref([]);
const playerList = ref([]);

/* Trận đấu tiếp theo */
const nextMatch = computed(() =>
  matchList.value.find((m) => m.trangThai === "chua_bat_dau") ||
  matchList.value[0] ||
  null
);

/* === FETCH DATA === */
const fetchAll = async () => {
  try {
    const [club, matches, players] = await Promise.all([
      fetchClubInfo(),
      axios.get(`${import.meta.env.VITE_API_BE_BASE_URL}/trandau`, {
        withCredentials: true,
      }),
      axios.get(`${import.meta.env.VITE_API_BE_BASE_URL}/cauthu/`, {
        withCredentials: true,
      }),
    ]);

    clubInfo.value = club[0] || {};
    marqueeText.value = `${clubInfo.value.moTa || ""} • `.repeat(4);

    const data = matches?.data || [];
    matchList.value = Array.isArray(data) ? data : [];

    upComingMatch.value = matchList.value.filter((m) => m.trangThai === "chua_bat_dau");
    matchPlayed.value = matchList.value.filter((m) => m.trangThai === "ket_thuc");

    playerList.value = Array.isArray(players?.data) ? players.data : [];
  } catch (err) {
    console.error("Lỗi load trang chủ:", err);
    matchList.value = [];
    upComingMatch.value = [];
    matchPlayed.value = [];
    playerList.value = [];
  }
};

onMounted(fetchAll);
</script>

<template>
  <!-- 1. Ảnh nền + Slogan + Trận tiếp theo -->
  <section class="position-relative">
    <img src="@/assets/images/old-traford.jpg" alt="Sân vận động" class="w-100"
      style="height: 100vh; object-fit: cover;" />

    <div class="position-absolute top-0 start-0 w-100 h-100"
      style="background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85));"></div>

    <!-- Slogan -->
    <div class="position-absolute top-50 start-0 translate-middle-y text-white px-5" :class="cx('slogan')">
      <h1 class="display-4 fw-bold text-shadow" style="opacity: 0.85;">
        {{ clubInfo?.slogan || "CTU FC – NIỀM TỰ HÀO" }}
      </h1>
      <p class="lead fs-4 mt-3" style="opacity: 0.75;">{{ clubInfo?.ten }}</p>
    </div>

    <!-- Thẻ trận đấu tiếp theo -->
    <div class="position-absolute bottom-0 end-0 mb-5 me-5 next-match-card-wrapper">
      <div class="next-match-card">
        <div class="card-body text-center py-5 px-4">
          <h5 class="fw-bold text-danger mb-3 text-uppercase tracking-wider">
            Trận đấu tiếp theo
          </h5>
          <h4 class="fw-bold mb-3">
            {{ nextMatch
              ? `${nextMatch.doiNha?.tenDoiBong || nextMatch.doiNha} vs ${nextMatch.doiKhach?.tenDoiBong ||
              nextMatch.doiKhach}`
              : "Đang cập nhật..."
            }}
          </h4>

          <p class="mb-2 small">
            <FontAwesomeIcon icon="fa-solid fa-calendar" class="me-2 text-danger" />
            {{ nextMatch
              ? new Date(nextMatch.ngayBatDau).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              : "..."
            }}
          </p>
          <p class="mb-4 small">
            <FontAwesomeIcon icon="fa-solid fa-clock" class="me-2 text-danger" />
            {{ nextMatch
              ? new Date(nextMatch.ngayBatDau).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "..."
            }}
            <span class="mx-3">•</span>
            <FontAwesomeIcon icon="fa-solid fa-location-dot" class="me-2 text-danger" />
            {{ nextMatch?.diaDiem || "Sân CTU" }}
          </p>

          <button @click="bookMatch(nextMatch)" :disabled="!nextMatch"
            class="btn btn-danger btn-lg px-5 py-3 fw-bold shadow-sm">
            <FontAwesomeIcon icon="fa-solid fa-ticket" class="me-2" />
            ĐẶT VÉ NGAY
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. Marquee -->
  <div class="marquee-wrapper">
    <MarqueeText :duration="80" :repeat="4" :paused="false" class="marquee-text">
      {{ marqueeText }}
    </MarqueeText>
  </div>

  <!-- 3. Thông báo mới -->
  <section class="container my-5">
    <ThongBaoMoi />
  </section>

  <!-- 4. Trận đấu sắp diễn ra -->
  <section class="py-5"
    style="background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('@/assets/images/match-list-backgound.png') center/cover no-repeat;">
    <div class="container">
      <h2 class="text-white text-center mb-5 display-5 fw-bold">
        CÁC TRẬN ĐẤU SẮP DIỄN RA
      </h2>

      <swiper :modules="[Autoplay, Navigation]" :slides-per-view="1.1" :space-between="20" :navigation="true"
        :loop="upComingMatch.length > 3" :breakpoints="{ 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }"
        class="mb-4">
        <swiper-slide v-for="match in upComingMatch" :key="match._id">
          <!-- GHI ĐÈ HÀNH VI ALERT TRONG MATCHCARD -->
          <MatchCard :item="match" @book-ticket="bookMatch(match)" />
        </swiper-slide>
      </swiper>

      <div v-if="upComingMatch.length === 0" class="text-center text-white py-5 fs-4">
        Chưa có lịch thi đấu sắp tới
      </div>
    </div>
  </section>

  <!-- 5. Trận đấu gần đây -->
  <section class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-5 display-5 fw-bold" style="color: var(--primary-color);">
        TRẬN ĐẤU GẦN ĐÂY
      </h2>
      <swiper :modules="[Autoplay]" :slides-per-view="1.2" :space-between="20" :loop="true"
        :breakpoints="{ 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }">
        <swiper-slide v-for="match in matchPlayed" :key="match._id">
          <MatchCard :item="match" />
        </swiper-slide>
      </swiper>
    </div>
  </section>

  <!-- 6. Giới thiệu CLB + Đội hình + Quà lưu niệm (giữ nguyên như cũ) -->
  <section class="py-5">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6 order-lg-2">
          <img src="@/assets/images/home-content-img.png" alt="CTU FC" class="img-fluid rounded shadow" />
        </div>
        <div class="col-lg-6 order-lg-1">
          <h1 class="display-4 fw-bold mb-4" style="color: var(--primary-color);">
            Tinh thần của {{ clubInfo?.ten || "CTU FC" }}
          </h1>
          <p class="lead fs-4 text-muted">{{ clubInfo?.moTa }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-5 bg-dark text-white">
    <div class="container">
      <h2 class="text-center mb-5 display-5 fw-bold">ĐỘI HÌNH TIÊU BIỂU</h2>
      <swiper :modules="[Autoplay, Navigation]" :slides-per-view="2" :space-between="30" :navigation="true" :loop="true"
        :breakpoints="{ 768: { slidesPerView: 1 }, 992: { slidesPerView: 3 } }">
        <swiper-slide v-for="player in playerList" :key="player._id">
          <PlayerCard :item="player" height="400px" />
        </swiper-slide>
      </swiper>
    </div>
  </section>

  <section class="py-5 text-white" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold mb-4">QUÀ LƯU NIỆM CHÍNH HÃNG CTU FC</h1>
          <p class="lead">Sở hữu ngay áo đấu, kỷ vật, sách ảnh độc quyền!</p>
          <a href="/shop" class="btn btn-light btn-lg px-5 mt-3">
            MUA NGAY
            <FontAwesomeIcon icon="fa-solid fa-arrow-right" class="ms-2" />
          </a>
        </div>
        <div class="col-lg-6 text-center">
          <img src="@/assets/images/qua-luu-niem.png" alt="Quà" class="img-fluid" style="max-height: 480px;" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slogan h1 {
  font-size: 3.5rem !important;
}

@media (max-width: 992px) {
  .slogan h1 {
    font-size: 2.8rem !important;
  }
}

@media (max-width: 576px) {
  .slogan h1 {
    font-size: 2.3rem !important;
  }
}

.next-match-card-wrapper {
  transform: scale(0.85);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
}

.next-match-card-wrapper:hover {
  transform: scale(0.90);
}

.next-match-card {
  min-width: 360px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

@media (max-width: 992px) {
  .next-match-card-wrapper {
    left: 50% !important;
    transform: translateX(-50%) scale(0.82);
    bottom: 20px !important;
  }
}

@media (max-width: 576px) {
  .next-match-card-wrapper {
    transform: translateX(-50%) scale(0.78);
  }

  .next-match-card {
    min-width: 300px;
  }

  .slogan {
    text-align: center;
    left: 50% !important;
    transform: translateX(-50%) translateY(-50%);
  }
}

.marquee-wrapper {
  background: linear-gradient(90deg, #8B2C31, #E02128);
  padding: 0.6rem 0;
}

.marquee-text {
  color: white;
  font-weight: bold;
  letter-spacing: 1.2px;
}

.text-shadow {
  text-shadow: 3px 3px 12px rgba(0, 0, 0, 0.9);
}
</style>