<script setup>
import classNames from "classnames/bind";
import styles from "./home.module.scss";
const cx = classNames.bind(styles);
import Header from "../../components/layout/header/Header.vue";
import DefaultLayout from "@/components/layout/defaultLayout/DefaultLayout.vue";
import Match from "@/components/match/Match.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import New from "@/components/new/New.vue";
import PlayerCard from "@/components/plauerCard/PlayerCard.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import SouvenirCard from "@/components/souvenirCard/SouvenirCard.vue";
import Form from "@/components/form/Form.vue";
const handleBookSticket = () => {
  alert("Chức năng đặt vé sẽ sớm được cập nhật!");
};

/*get api here */
const tranDau = {
  capDau: ["MU", "Real Madrid"],
  thoiGianDienRa: "20:00, 05/10/2025",
  diaDiem: "Sân Old Trafford",
};
/*get api tran dau gan day */
const tranDauGanDay = [
  {
    capDau: ["MU", "Arsenal"],
    thoiGianDienRa: "20:00, 28/09/2025",
    diaDiem: "Sân Old Trafford",
    ketQua: [2, 1],
  },
  {
    capDau: ["MU", "Chelsea"],
    thoiGianDienRa: "22:00, 20/09/2025",
    diaDiem: "Sân Stamford Bridge",
    ketQua: [2, 1],
  },
  {
    capDau: ["MU", "Liverpool"],
    thoiGianDienRa: "19:30, 15/09/2025",
    diaDiem: "Sân Old Trafford",
    ketQua: [2, 1],
  },
];

/*get api bai dang  */
const baiDangs = [
  {
    MaBaiDang: "BD001",
    tieuDe: "Trận đấu kịch tính giữa MU và Chelsea",
    noiDung:
      "MU và Chelsea đã có một trận đấu hấp dẫn với nhiều pha bóng nguy hiểm. MU giành chiến thắng sát nút với tỉ số 2-1.",
    ngayDang: "2025-10-01",
    anhMinhHoa:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoRq-Ky0lsqls9nok2QYJ01yhH7YnN-rolfg&s",
  },
  {
    MaBaiDang: "BD002",
    tieuDe: "Real Madrid trở lại ngôi đầu bảng",
    noiDung:
      "Real Madrid đã đánh bại Barcelona trong trận siêu kinh điển, qua đó trở lại ngôi đầu bảng La Liga mùa giải 2025.",
    ngayDang: "2025-09-28",
    anhMinhHoa:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoRq-Ky0lsqls9nok2QYJ01yhH7YnN-rolfg&s",
  },
  {
    MaBaiDang: "BD003",
    tieuDe: "Liverpool chuẩn bị cho Champions League",
    noiDung:
      "HLV Jurgen Klopp khẳng định Liverpool đã sẵn sàng cho trận đấu quan trọng tại Champions League tuần tới.",
    ngayDang: "2025-09-25",
    anhMinhHoa:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoRq-Ky0lsqls9nok2QYJ01yhH7YnN-rolfg&s",
  },
  {
    MaBaiDang: "BD004",
    tieuDe: "Arsenal thắng đậm tại Premier League",
    noiDung:
      "Arsenal tiếp tục phong độ ấn tượng khi đánh bại đối thủ với tỉ số 4-0 trên sân nhà, khẳng định vị trí trong top 4.",
    ngayDang: "2025-09-20",
    anhMinhHoa:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoRq-Ky0lsqls9nok2QYJ01yhH7YnN-rolfg&s",
  },
];

/*get api cầu thủ */
const players = [
  {
    ten: "Cristiano Ronaldo",
    viTri: "ST",
    quocTich: "https://flagcdn.com/w40/pt.png", // Bồ Đào Nha
    anhMinhHoa:
      "//assets.manutd.com/AssetPicker/images/0/0/22/86/1464035/7_Mason_Mount1751376357453.webp",
  },
  {
    ten: "Lionel Messi",
    viTri: "RW",
    quocTich: "https://flagcdn.com/w40/ar.png", // Argentina
    anhMinhHoa:
      "//assets.manutd.com/AssetPicker/images/0/0/22/86/1464035/7_Mason_Mount1751376357453.webp",
  },
  {
    ten: "Kevin De Bruyne",
    viTri: "CM",
    quocTich: "https://flagcdn.com/w40/be.png", // Bỉ
    anhMinhHoa:
      "//assets.manutd.com/AssetPicker/images/0/0/22/86/1464035/7_Mason_Mount1751376357453.webp",
  },
  {
    ten: "Virgil van Dijk",
    viTri: "CB",
    quocTich: "https://flagcdn.com/w40/nl.png", // Hà Lan
    anhMinhHoa:
      "//assets.manutd.com/AssetPicker/images/0/0/22/86/1464035/7_Mason_Mount1751376357453.webp",
  },
  {
    ten: "David de Gea",
    viTri: "GK",
    quocTich: "https://flagcdn.com/w40/es.png", // Tây Ban Nha
    anhMinhHoa:
      "//assets.manutd.com/AssetPicker/images/0/0/22/86/1464035/7_Mason_Mount1751376357453.webp",
  },
];
/*get api qua luu niem */
const quaLuuNiemList = [
  {
    maQuaLuuNiem: "QLN001",
    tenQuaLuuNiem: "Áo đấu Manchester United 2025",
    gia: 1200000,
    moTa: "Áo thi đấu chính thức mùa giải 2025, chất liệu thoáng mát, in logo MU.",
    anhMinhHoa:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
  },
  {
    maQuaLuuNiem: "QLN002",
    tenQuaLuuNiem: "Khăn choàng cổ MU",
    gia: 250000,
    moTa: "Khăn choàng cổ màu đỏ đen với logo Manchester United, thích hợp cổ vũ.",
    anhMinhHoa:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
  },
  {
    maQuaLuuNiem: "QLN003",
    tenQuaLuuNiem: "Bóng đá Manchester United",
    gia: 550000,
    moTa: "Quả bóng chính hãng in logo MU, chất liệu da PU, dùng để thi đấu và trưng bày.",
    anhMinhHoa:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
  },
  {
    maQuaLuuNiem: "QLN004",
    tenQuaLuuNiem: "Móc khóa logo MU",
    gia: 80000,
    moTa: "Móc khóa kim loại in nổi logo Manchester United, nhỏ gọn, tiện dụng.",
    anhMinhHoa:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
  },
  {
    maQuaLuuNiem: "QLN005",
    tenQuaLuuNiem: "Ly sứ MU",
    gia: 150000,
    moTa: "Ly sứ cao cấp in logo Manchester United, thích hợp dùng uống cà phê, trưng bày.",
    anhMinhHoa:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lozb9tz9f90b50",
  },
];
</script>

<template>
  <div>
    <img
      src="../../assets/images/old-traford.jpg"
      alt=""
      :class="cx('thumbnail')"
    />
    <div :class="cx('slogan')">
      <p>Manchester United</p>
      <p>theater of the dreams</p>
    </div>
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
      <font-awesome-icon :icon="['fas', 'angle-right']" :class="'display-3'" />
    </div>
  </div>
  <div :class="cx('home-wrapper')">
    <div :class="cx('container', 'home-body')">
      <div>
        <div :class="cx('recent-matches')">
          <Match
            v-for="(match, index) in tranDauGanDay"
            :key="index"
            :match="match"
          />
        </div>
      </div>

      <div :class="cx('recent-news')">
        <New
          v-for="(baiDang, index) in baiDangs"
          :bai-dang="baiDang"
          :key="index"
        />
      </div>

      <swiper
        :modules="[Autoplay]"
        :slides-per-view="3"
        :space-between="20"
        :autoplay="{ delay: 2000, disableOnInteraction: false }"
        :loop="true"
        class="mySwiper"
      >
        <swiper-slide v-for="(player, index) in players" :key="index">
          <PlayerCard
            :ten="player.ten"
            :vi-tri="player.viTri"
            :quoc-tich="player.quocTich"
            :anh-minh-hoa="player.anhMinhHoa"
            :so-ao="player.soAo"
          />
        </swiper-slide>
      </swiper>
      <div>
        <h2>Cửa hàng của chúng tôi</h2>
        <div :class="cx('store-info d-flex flex-wrap gap-3')">
          <SouvenirCard
            v-for="(item, index) in quaLuuNiemList"
            :key="index"
            :qua-luu-niem="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>
