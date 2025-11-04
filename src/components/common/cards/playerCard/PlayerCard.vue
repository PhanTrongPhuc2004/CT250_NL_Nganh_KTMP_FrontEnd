<script setup>
import classNames from "classnames/bind";
import styles from "./playerCard.module.scss";
import { formatTime, formatDate, fetchClubInfo } from "@/utils";
import Menu from "../../menu/Menu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Form from "../../form/Form.vue";
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const isLoading = ref(false);
const spinner = "dots"; // có thể thay đổi: 'spinner', 'dots', 'bars'

// Hàm hiển thị loading
const showLoading = () => {
  isLoading.value = true;

  // Giả lập API call hoặc xử lý dữ liệu
  setTimeout(() => {
    isLoading.value = false;
  }, 3000); // Loading sẽ tắt sau 3 giây
};
// Hàm khi người dùng cancel loading
const onCancel = () => {
  console.log("Loading đã bị hủy");
};
import {
  seasonFields,
  tournamentFields,
  playerFields,
  matchFields,
  souvenirFields,
  squadFields,
} from "@/utils/constanst";
import { useFormStore } from "@/stores/formStore";

const cx = classNames.bind(styles);
const router = useRouter();
const route = useRoute();
const formStore = useFormStore();

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  type: {
    type: String,
    default: "default",
  },
  class: {
    type: String,
    default: "",
  },
});
// ✅ Quản lý menu - chỉ dùng 1 biến
const openMenuId = ref(null);

const toggleMenu = (itemId) => {
  openMenuId.value = openMenuId.value === itemId ? null : itemId;
};

const closeMenu = () => {
  openMenuId.value = null;
  formStore.closeForm();
};

const isMenuOpen = (itemId) => {
  return openMenuId.value === itemId;
};

const tournamentId = route.params.tournamentId || null;
const seasonId = route.params.seasonId || null;
const clubInfor = ref([]);

onMounted(async () => {
  clubInfor.value = await fetchClubInfo();
  console.log("item", props.item);
});

// 🧠 computed: luôn trả về id hoặc null
const cauLacBoId = computed(() => {
  return clubInfor.value?.[0]?._id || null;
});

const detailAction = {
  season: (id) => router.push(`/admin/compete/seasons/${id}`),
  tournament: (id) => {
    router.push(`/admin/compete/seasons/${seasonId}/tournaments/${id}`);
  },
  player: (id) => router.push(`/admin/compete/players/${id}`),
  souvenir: (id) => router.push(`/admin/compete/souvenirs/${id}`),
  squad: (id) => router.push(`/admin/squad/${id}`),
};

const editAction = {
  season: {
    api: `http://localhost:5000/muagiai/${props.item._id}`,
    method: "PUT",
  },
  tournament: {
    api: `http://localhost:5000/giaidau/${props.item._id}`,
    method: "PUT",
  },
  player: {
    api: `http://localhost:5000/cauthu/${props.item._id}`,
    method: "PUT",
  },
  souvenir: {
    api: `http://localhost:5000/qualuuniem/${props.item._id}`,
    method: "PUT",
  },
  squad: {
    api: `http://localhost:5000/doihinh/${props.item._id}`,
    method: "PUT",
  },
};

// 🟢 Nhóm hành động "xóa"
const deleteAction = {
  season: (id) => {
    if (!confirm("Bạn có chắc muốn xóa mùa giải này?")) return;
    axios
      .delete(`http://localhost:5000/muagiai/${id}`)
      .then(() => {
        window.location.reload()
        router.push("/admin/compete");
      })
      .catch((error) => {
        console.error("Error deleting season:", error);
        alert("Không thể xóa mùa giải!");
      });
  },
  tournament: (id) => {
    if (!confirm("Bạn có chắc muốn xóa giải đấu này?")) return;
    const seasonId = route.params.seasonId;
    console.log("seasonId", seasonId);
    axios
      .delete(`http://localhost:5000/giaidau/${id}`)
      .then(() => {
        window.location.reload()
        console.log("seasonId", seasonId);
        router.push(`/admin/compete/seasons/${seasonId}`);
      })
      .catch((error) => {
        console.error("Error deleting tournament:", error);
        alert("Không thể xóa giải đấu!");
      });
  },
  player: (id) => {
    if (!confirm("Bạn có chắc muốn xóa cầu thủ này?")) return;
    axios
      .delete(`http://localhost:5000/cauthu/${id}`)
      .then(() => {
        window.location.reload()
        router.push("/admin/compete");
      })
      .catch((error) => {
        console.error("Error deleting player:", error);
        alert("Không thể xóa cầu thủ!");
      });
  },
  souvenir: (id) => {
    if (!confirm("Bạn có chắc muốn xóa vật phẩm này?")) return;
    axios
      .delete(`http://localhost:5000/qualuuniem/${id}`)
      .then(() => {
        window.location.reload()
        router.push("/admin/compete");
      })
      .catch((error) => {
        console.error("Error deleting souvenir:", error);
        alert("Không thể xóa vật phẩm!");
      });
  },
  squad: (id) => {
    if (!confirm("Bạn có chắc muốn xóa đội hình này?")) return;
    axios
      .delete(`http://localhost:5000/doihinh/${id}`)
      .then(() => {
        window.location.reload()
        router.push("/admin/compete");
      })
      .catch((error) => {
        console.error("Error deleting squad:", error);
        alert("Không thể xóa đội hình!");
      });
  },
};

const menuItemsByType = {
  match: [
    {
      name: "Chỉnh sửa trận đấu",
      action: () => {
        formStore.openForm(formNames.match, props.item);
      },
    },
    {
      name: "Xóa trận đấu",
      action: () => {
        axios
          .delete(`http://localhost:5000/trandau/${props.item._id}`)
          .then(() => {
            alert("Xóa trận đấu thành công!");
            closeMenu();
          })
          .catch((error) => {
            console.error("Error deleting match:", error);
            alert("Không thể xóa trận đấu!");
          });
      },
    },
  ],

  season: [
    {
      name: "Xem chi tiết mùa giải",
      action: () => {
        detailAction.season(props.item._id);
        closeMenu();
      },
    },
    {
      name: "Chỉnh sửa mùa giải",
      action: () => {
        formStore.openForm(formNames.season, props.item);
        
      },
    },
    {
      name: "Xóa mùa giải",
      action: () => {
        deleteAction.season(props.item._id);
        closeMenu();
      },
    },
  ],

  tournament: [
    {
      name: "Xem thông tin giải đấu",
      action: () => {
        detailAction.tournament(props.item._id);
        closeMenu();
      },
    },
    {
      name: "Chỉnh sửa giải đấu",
      action: () => {
        formStore.openForm(formNames.tournament, props.item);
      },
    },
    {
      name: "Xóa giải đấu",
      action: () => {
        deleteAction.tournament(props.item._id);
        closeMenu();
      },
    },
  ],

  player: [
    {
      name: "Xem hồ sơ cầu thủ",
      action: () => {
        detailAction.player(props.item._id);
        closeMenu();
      },
    },
    {
      name: "Chỉnh sửa thông tin cầu thủ",
      action: () => {
        formStore.openForm(formNames.player, props.item);
      },
    },
    {
      name: "Xóa cầu thủ",
      action: () => {
        deleteAction.player(props.item._id);
        closeMenu();
      },
    },
  ],

  souvenir: [
    {
      name: "Xem thông tin vật phẩm",
      action: () => {
        detailAction.souvenir(props.item._id);
        closeMenu();
      },
    },
    {
      name: "Chỉnh sửa vật phẩm",
      action: () => {
        formStore.openForm(formNames.souvenir, props.item);
        closeMenu();
      },
    },
    {
      name: "Xóa vật phẩm",
      action: () => {
        deleteAction.souvenir(props.item._id);
        closeMenu();
      },
    },
  ],

  squad: [
    {
      name: "Xem chi tiết đội hình",
      action: () => {
        detailAction.squad(props.item._id);
        closeMenu();
      },
    },
    {
      name: "Chỉnh sửa đội hình",
      action: () => {
        formStore.openForm(formNames.squad, props.item);
      },
    },
    {
      name: "Xóa đội hình",
      action: () => {
        deleteAction.squad(props.item._id);
        closeMenu();
      },
    },
  ],
};

const formNames = {
  season: "Chỉnh sửa mùa giải",
  tournament: "Chỉnh sửa giải đấu",
  match: "Chỉnh sửa trận đấu",
  player: "Chỉnh sửa cầu thủ",
  souvenir: "Chỉnh sửa quà lưu niệm",
  squad: "Chỉnh sửa đội hình",
};

const inputFields = {
  season: seasonFields,
  tournament: tournamentFields,
  match: matchFields,
  player: playerFields,
  souvenir: souvenirFields,
  squad: squadFields,
};
</script>

<template>
  <!-- Player Card -->
  <div
    v-if="type === 'player'"
    :class="cx('player-card')"
    class="border rounded-4 shadow-sm overflow-hidden"
  >
    <img :src="item.anhMinhHoa" alt="player" :class="cx('player-img')" />
    <div :class="cx('info')">
      <span v-if="item.soAo" :class="cx('number')" >#{{ item.soAo }}</span>
<h3 
  class="fw-bold w-50" 
  style="font-size: 30px; white-space: normal; overflow-wrap: normal;"
>
  {{ item.hoVaTen }}
</h3>


      <p :class="cx('sub')">{{ item.viTri }}</p>
    </div>
  </div>

  <!-- Season Card -->
  <div
    v-if="type === 'season'"
    class="position-relative border shadow-sm rounded-4"
    :class="class"
  >
    <img
      src="https://cdn.wallpapersafari.com/74/64/SqsDew.jpg"
      alt=""
      class="col-md-12 border rounded-top-4 overflow-hidden"
    />
    <div class="p-3">{{ item.namBatDau }} - {{ item.namKetThuc }}


    </div>

    <div
      class="d-flex justify-content-end align-items-center mt-2 p-3 position-relative"
    >
      <FontAwesomeIcon
        :icon="['fas', 'ellipsis-v']"
        :class="cx('more-btn')"
        @click="toggleMenu(item._id)"
      />

      <Menu
        v-if="isMenuOpen(item._id)"
        top="46px"
        right="0"
        :menu-items="menuItemsByType[type]"
        :on-close="closeMenu"
      />
    </div>
  </div>

  <!-- Tournament Card -->
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

      <div
        class="d-flex justify-content-end align-items-center mt-2 p-3 position-relative"
      >
        <FontAwesomeIcon
          :icon="['fas', 'ellipsis-v']"
          :class="cx('more-btn')"
          @click="toggleMenu(item._id)"
        />
        <Menu
          v-if="isMenuOpen(item._id)"
          top="46px"
          right="0"
          :menu-items="menuItemsByType[type]"
          :on-close="closeMenu"
        />
      </div>
    </div>
  </div>

  <!-- Match Card -->
  <div
    v-if="type === 'match'"
    :class="class"
    class="border rounded-4 shadow-sm"
  >
    <div class=" border shadow-sm rounded-4">
      <div class="position-relative">
        <img
        src="https://img.freepik.com/vector-gratis/papel-pintado-textura-hexagonal-oscuro-audaz-estilo-geometrico_1017-43003.jpg"
        alt=""
        class="col-md-12 rounded-top-4 position-relative"
      > 
    
      <p class=" position-absolute top-50 start-50 translate-middle text-white fs-5 fw-bold w-100 text-center">{{ `${item.doiNha} - ${item.doiKhach}` }}</p>
    </img>
      </div>
      <div class="card-body p-3">
        <p>{{ item.diaDiem }}</p>
        <p>{{ formatDate(item.ngayDienRa) }}</p>
        <p>{{ formatTime(item.thoiGianDienRa) }}</p>
      </div>

      <div
        class="d-flex justify-content-end align-items-center mt-2 p-3 position-relative"
      >
        <FontAwesomeIcon
          :icon="['fas', 'ellipsis-v']"
          :class="cx('more-btn')"
          @click="toggleMenu(item._id)"
        />
        <Menu
          v-if="isMenuOpen(item._id)"
          top="46px"
          right="0"
          :menu-items="menuItemsByType[type]"
          :on-close="closeMenu"
        />
      </div>
    </div>
  </div>

  <!-- Souvenir Card -->
  <div v-if="type === 'souvenir'" class="mb-4">
    <div class="card h-100 shadow-sm border-0">
      <img
        :src="item.anhMinhHoa"
        class="card-img-top img-fluid"
        alt="Ảnh quà lưu niệm"
        style="object-fit: cover; height: 200px"
      />

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

  <!-- Squad Card -->
  <div
    v-if="type === 'squad'"
    class="card mb-3"
    style="max-width: 400px; border-radius: 10px; border: 1px solid #ddd"
  >
    <div class="card-body">
      <h5 class="card-title text-danger mb-2">{{ item.doiHinh }}</h5>

      <div
        class="d-flex justify-content-end align-items-center mt-2 p-3 position-relative"
      >
        <FontAwesomeIcon
          :icon="['fas', 'ellipsis-v']"
          :class="cx('more-btn')"
          @click="toggleMenu(item._id)"
        />
        <Menu
          v-if="isMenuOpen(item._id)"
          top="46px"
          right="0"
          :menu-items="menuItemsByType[type]"
          :on-close="closeMenu"
        />
      </div>
    </div>
  </div>

  <!-- Modal Form for Edit -->
 <!-- Modal overlay controlled by Pinia -->
<div
  v-if="formStore.isOpen && formStore.isCurrent(formNames[type])"
  class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
  style="background: rgba(0, 0, 0, 0.5); z-index: 1050"
  @click.self="formStore.closeForm"  
>
  <!-- Form content -->
  <div class="bg-white p-4 rounded-4 shadow-lg" style="min-width: 400px; max-width: 600px;">
    <Form
      :input-fields="inputFields[type]"
      modal-id="userModal"
      :form-name="formNames[type]"
      :input-data="formStore.formData"
      :api="editAction[type]?.api || ''"
      :method="editAction[type]?.method || ''"
      :orther-data="{ cauLacBoId }"
      @submitted="() => { formStore.closeForm(); closeMenu(); }"
      @closed="formStore.closeForm"
    />
  </div>
</div>


  
</template>
