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
import { Autoplay } from "swiper/modules";
import SouvenirCard from "@/components/common/cards/souvenirCard/SouvenirCard.vue";
import Form from "@/components/common/form/Form.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
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
onMounted(async () => {
  //fetch infor club
  const clubResponse = await axios.get("http://localhost:5000/caulacbo/");
  clubInfo.value = clubResponse.data;
  console.log("Club Info:", clubInfo.value);
  // await fetchSouvenirList();
  const souvenirListResponse = await axios.get(
    "http://localhost:5000/qualuuniem"
  );
  souvenirList.value = souvenirListResponse.data;
  // await fetchMatchList();
  const matchListResponse = await axios.get("http://localhost:5000/trandau");
  matchList.value = matchListResponse.data;
  console.log("Match List:", matchList.value);
  //PHUC
  // await fetchPostList();
  // const postListResponse = await axios.get("http://localhost:5000/baidang");
  // postList.value = postListResponse.data;
  // await fetchPlayerList();
  const response = await axios.get("http://localhost:5000/cauthu/", {
    withCredentials: true,
  });
  playerList.value = response.data;
});

//     maQuaLuuNiem: "QLN001",
//     tenQuaLuuNiem: "Áo đấu Manchester United 2025",
//     gia: 1200000,
//     moTa: "Áo thi đấu chính thức mùa giải 2025, chất liệu thoáng mát, in logo MU.",
//     anhMinhHoa:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
//   },
//   {
//     maQuaLuuNiem: "QLN002",
//     tenQuaLuuNiem: "Khăn choàng cổ MU",
//     gia: 250000,
//     moTa: "Khăn choàng cổ màu đỏ đen với logo Manchester United, thích hợp cổ vũ.",
//     anhMinhHoa:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
//   },
//   {
//     maQuaLuuNiem: "QLN003",
//     tenQuaLuuNiem: "Bóng đá Manchester United",
//     gia: 550000,
//     moTa: "Quả bóng chính hãng in logo MU, chất liệu da PU, dùng để thi đấu và trưng bày.",
//     anhMinhHoa:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
//   },
//   {
//     maQuaLuuNiem: "QLN004",
//     tenQuaLuuNiem: "Móc khóa logo MU",
//     gia: 80000,
//     moTa: "Móc khóa kim loại in nổi logo Manchester United, nhỏ gọn, tiện dụng.",
//     anhMinhHoa:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
//   },
//   {
//     maQuaLuuNiem: "QLN005",
//     tenQuaLuuNiem: "Ly sứ MU",
//     gia: 150000,
//     moTa: "Ly sứ cao cấp in logo Manchester United, thích hợp dùng uống cà phê, trưng bày.",
//     anhMinhHoa:
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
//   },
// ];
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
  <p class="mt-2 text-muted">
    {{
      clubInfo.moTa ||
      "The world's most successful football club, home to legends and dreams."
    }}
  </p>

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
  <div :class="cx('home-wrapper')">
    <div :class="cx('container', 'home-body')">
      <div>
        <h1>Tran dau gan day</h1>
        <div
          class="d-flex flex-wrap gap-3 align-items-center justify-content-center flex-direction-row w-100"
        >
          <div
            v-for="(match, index) in matchList"
            :key="match._id || index"
            :class="cx('recent-matches ')"
          >
            <PlayerCard :item="match" type="match" />
          </div>
        </div>
      </div>

      <!-- <div :class="cx('recent-news')">
        <New
          v-for="(baiDang, index) in postList"
          :bai-dang="baiDang"
          :key="index"
        />
      </div> -->

      <swiper
        :modules="[Autoplay]"
        :slides-per-view="3"
        :space-between="20"
        :autoplay="{ delay: 2000, disableOnInteraction: false }"
        :loop="true"
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
.sponsors h6 {
  font-weight: 600;
  color: #dc3545; /* đỏ nổi bật giống Bootstrap btn-danger */
  margin-bottom: 0.75rem;
}

.sponsor-list li {
  background-color: #343a40; /* xám đậm nền */
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  transition: transform 0.2s, background-color 0.3s;
}

.sponsor-list li:hover {
  background-color: #495057; /* sáng hơn khi hover */
  transform: translateY(-2px);
}

.sponsor-list i {
  font-size: 0.75rem;
}
</style>
