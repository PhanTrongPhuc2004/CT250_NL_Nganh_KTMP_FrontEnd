<script setup>
import classNames from "classnames/bind";
import styles from "./home.module.scss";
const cx = classNames.bind(styles);
import Header from "../../components/layout/header/Header.vue";
import DefaultLayout from "@/components/layout/defaultLayout/DefaultLayout.vue";
import Match from "@/components/match/Match.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/*get api here */
const tranDau = {
  capDau: "MU 🆚 Real Madrid",
  thoiGianDienRa: "20:00, 05/10/2025",
  diaDiem: "Sân Old Trafford",
};
</script>

<template>
  <div :class="cx('home-wrapper')">
    <div>
      <img
        src="../../assets/images/old-traford.jpg"
        alt=""
        :class="cx('thumbnail')"
      />
    </div>
    <div>
      <!--get api here-->
      <div :class="cx('marquee')">
        <span>Quỷ đỏ bất diệt - Niềm tin của sự chiến thắng</span>
      </div>
    </div>
    <div :class="cx('slogan')">
      <p>Manchester United</p>
      <p>theater of the dreams</p>
    </div>
    <div :class="cx('next-match')">
      <div>
        <h3>Trận đấu tiếp theo</h3>
        <div>
          <h4>{{ tranDau.capDau }}</h4>
          <h5>{{ tranDau.diaDiem }}</h5>
          <h5>{{ tranDau.thoiGianDienRa }}</h5>
        </div>
      </div>
      <div>
        <font-awesome-icon
          :icon="['fas', 'angle-right']"
          :class="'display-3'"
        />
      </div>
    </div>
  </div>
</template>
