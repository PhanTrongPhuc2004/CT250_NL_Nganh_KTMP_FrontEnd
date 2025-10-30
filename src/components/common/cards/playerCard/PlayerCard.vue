<script setup>
import classNames from "classnames/bind";
import styles from "./playerCard.module.scss";
import { formatTime, formatDate } from "@/utils";
import Menu from "../../menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import axios from "axios";
const cx = classNames.bind(styles);
const router = useRouter();
const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  type: {
    type: String,
    default: "default", // default, compact
  },
  class: {
    type: String,
    default: "",
  },
});
const showPlayerCardMenu = ref(false);
const showSeasonCardMenu = ref(false);
const showTournamentCardMenu = ref(false);
const showMatchCardMenu = ref(false);
const showSouvenirCardMenu = ref(false);
const route = useRoute();
const tournamentId = route.params.tournamentId || null;
const seasonId = route.params.seasonId || null;

const deleteTournament = async (tournamentId) => {
  axios
    .delete(`http://localhost:5000/muagiai/${tournamentId}`)
    .then((response) => {
      router.push("/admin/compete");
    })
    .catch((error) => {
      console.error("Error deleting tournament:", error);
    });
};

onMounted(() => {
  console.log(props.class);
});

const detailAction = {
  season: (id) => router.push(`/admin/compete/seasons/${id}`),
  tournament: (id) => {
    router.push(`/admin/compete/seasons/${seasonId}/tournaments/${id}`);
  },
  player: (id) => router.push(`/admin/compete/players/${id}`),
  souvenir: (id) => router.push(`/admin/compete/souvenirs/${id}`),
};

// 🟢 Nhóm hành động "xóa"
const deleteAction = {
  season: (id) => {
    axios
      .delete(`http://localhost:5000/muagiai/${id}`)
      .then((response) => {
        router.push("/admin/compete");
      })
      .catch((error) => {
        console.error("Error deleting season:", error);
      });
  },
  tournament: (id) => {
    axios
      .delete(`http://localhost:5000/giaidau/${id}`)
      .then((response) => {
        router.push("/admin/compete");
      })
      .catch((error) => {
        console.error("Error deleting season:", error);
      });
  },
  player: (id) => {
    axios
      .delete(`http://localhost:5000/cauthu/${id}`)
      .then((response) => {
        router.push("/admin/compete");
      })
      .catch((error) => {
        console.error("Error deleting player:", error);
      });
  },
  souvenir: (id) => {
    axios
      .delete(`http://localhost:5000/qualuuniem/${id}`)
      .then((response) => {
        router.push("/admin/compete");
      })
      .catch((error) => {
        console.error("Error deleting souvenir:", error);
      });
  },
};

const seasonCardMenuItems = [
  {
    name: "Xem chi tiết",
    link: "",
    action: () => {
      detailAction[props.type](props.item._id);
    },
  },
  { name: "Chỉnh sửa", link: "#" },
  {
    name: "Xóa",
    action: () => deleteAction[props.type](props.item._id),
  },
];

const tournamentCardMenuItems = [
  {
    name: "Xem chi tiết",
    link: "",
    action: () => {
      detailAction[props.type](props.item._id);
    },
  },
  { name: "Chỉnh sửa", link: "#" },
  {
    name: "Xóa",
    action: () => deleteAction[props.type](props.item._id),
  },
];
</script>

<template>
  <div
    :class="cx('player-card')"
    v-if="type == 'player'"
    class="border rounded-4 shadow-sm overflow-hidden"
  >
    <!-- Ảnh cầu thủ -->
    <img :src="item.anhMinhHoa" alt="player" :class="cx('player-img')" />

    <!-- Thông tin dưới -->
    <div :class="cx('info')">
      <span v-if="item.soAo" :class="cx('number')">#{{ item.soAo }}</span>
      <h3 :class="cx('name')">{{ item.ten }}</h3>
      <p :class="cx('sub')">{{ item.viTri }}</p>
    </div>
  </div>

  <div
    v-if="type == 'season'"
    class="position-relative border shadow-sm rounded-4"
    :class="class"
  >
    <img
      src="https://cdn.wallpapersafari.com/74/64/SqsDew.jpg"
      alt=""
      class="col-md-12 border rounded-top-4 overflow-hidden"
    />
    <div class="p-3">{{ item.namBatDau }} - {{ item.namKetThuc }}</div>

    <div class="d-flex justify-content-end align-items-center mt-2 p-3">
      <FontAwesomeIcon
        :icon="['fas', 'ellipsis-v']"
        :class="cx('more-btn')"
        @click="
          () => {
            showSeasonCardMenu = !showSeasonCardMenu;
          }
        "
      />
    </div>
    <Menu
      v-if="showSeasonCardMenu"
      :menu-items="seasonCardMenuItems"
      top="280px"
      :on-close="() => (showSeasonCardMenu = false)"
    />
  </div>
  <div
    v-if="type === 'tournament'"
    class="position-relative border shadow-sm rounded-4"
  >
    <div
      class="card shadow-sm border-0 rounded-4"
      style="border-top: 4px solid var(--primary-color)"
    >
      <img
        src="https://img.freepik.com/free-vector/hexagon-shape-with-halftone-border-background_1409-1669.jpg?semt=ais_hybrid&w=740&q=80"
        alt=""
        class="rounded-top-4"
      />
      <div class="card-body p-3">
        <h5
          class="card-title fw-semibold mb-2"
          :style="{ color: 'var(--primary-color)' }"
        >
          {{ item.tenGiaiDau || "Tên giải đấu chưa cập nhật" }}
        </h5>

        <p class="card-text text-muted mb-3">
          {{ item.moTa || "Chưa có mô tả chi tiết cho giải đấu này." }}
        </p>

        <div
          v-if="item.ngayBatDau || item.ngayKetThuc"
          class="text-secondary small"
        >
          <span class="ms-1">
            {{ formatDate(item.ngayBatDau) }} –
            {{ formatDate(item.ngayKetThuc) }}
          </span>
        </div>
      </div>
      <div>
        <div class="d-flex justify-content-end align-items-center mt-2 p-3">
          <FontAwesomeIcon
            :icon="['fas', 'ellipsis-v']"
            :class="cx('more-btn')"
            @click="
              () => {
                showSeasonCardMenu = !showSeasonCardMenu;
              }
            "
          />
          <Menu
            v-if="showSeasonCardMenu"
            :menu-items="tournamentCardMenuItems"
            top="280px"
            :on-close="() => (showSeasonCardMenu = false)"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="type == 'match'"
    :class="class"
    class="border rounded-4 shadow-sm overflow-hidden"
  >
    <div class="">
      <div class=" ">
        <img
          src="https://img.freepik.com/vector-gratis/papel-pintado-textura-hexagonal-oscuro-audaz-estilo-geometrico_1017-43003.jpg"
          alt=""
          class="col-md-12"
        />
      </div>
      <div class="card-body p-3">
        <p>{{ item.diaDiem }}</p>
        <p>{{ formatDate(item.ngayDienRa) }}</p>
        <p>{{ formatTime(item.thoiGianDienRa) }}</p>
      </div>
    </div>
  </div>

  <div class="mb-4" v-if="type == 'souvenir'">
    <div class="card h-100 shadow-sm border-0">
      <!-- Ảnh minh họa -->
      <img
        :src="item.anhMinhHoa"
        class="card-img-top img-fluid"
        alt="Ảnh quà lưu niệm"
        style="object-fit: cover; height: 200px"
      />

      <!-- Nội dung -->
      <div class="card-body p-3 d-flex flex-column">
        <h5 class="card-title text-primary fw-bold text-truncate">
          {{ item.tenQuaLuuNiem }}
        </h5>
        <p class="card-text text-danger fw-semibold mb-1">
          {{ item.gia.toLocaleString() }} VND
        </p>
        <p class="card-text text-muted small flex-grow-1">
          {{ item.moTa }}
        </p>

        <button class="btn btn-outline-danger btn-sm w-100 mt-auto">
          <i class="bi bi-bag-fill me-1"></i> Mua ngay
        </button>
      </div>
    </div>
  </div>
</template>
