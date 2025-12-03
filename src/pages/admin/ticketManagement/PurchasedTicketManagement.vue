<!-- src/pages/admin/ticketManagement/PurchasedTicketManagement.vue -->
<template>
  <div class="container py-5">
    <!-- Header + Nút xác nhận -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-danger m-0">
        <i class="bi bi-credit-card-2-back-fill text-warning me-2"></i>
        XÁC NHẬN THANH TOÁN CHUYỂN KHOẢN
      </h3>
      <button @click="confirmSelected" :disabled="selectedTickets.length === 0"
        class="btn btn-success btn-lg shadow px-5">
        <i class="bi bi-check-circle-fill me-2"></i>
        Xác nhận thanh toán ({{ selectedTickets.length }})
      </button>
    </div>

    <!-- Bộ lọc + Sắp xếp siêu xịn -->
    <div class="card border-0 shadow-sm rounded-3 mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <!-- Tìm kiếm -->
          <div class="col-md-4">
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
              <input v-model="searchQuery" @input="debouncedSearch" type="text"
                class="form-control border-0 shadow-none" placeholder="Tìm mã vé, tên khách, email, trận đấu...">
            </div>
          </div>

          <!-- Lọc trạng thái -->
          <div class="col-md-3">
            <select v-model="filterStatus" class="form-select form-select-lg">
              <option value="all">Tất cả trạng thái</option>
              <option value="cho_thanh_toan">Chờ thanh toán</option>
              <option value="da_thanh_toan">Đã thanh toán</option>
            </select>
          </div>

          <!-- Sắp xếp -->
          <div class="col-md-3">
            <select v-model="sortBy" class="form-select form-select-lg">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="priceDesc">Giá cao → thấp</option>
              <option value="priceAsc">Giá thấp → cao</option>
              <option value="matchDate">Ngày trận gần nhất</option>
            </select>
          </div>

          <!-- Làm mới -->
          <div class="col-md-2">
            <button @click="fetchTickets" class="btn btn-outline-danger btn-lg w-100">
              <i class="bi bi-arrow-clockwise"></i> Làm mới
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng vé -->
    <div class="card border-0 shadow-lg rounded-3 overflow-hidden">
      <div class="card-header bg-gradient text-white"
        style="background: linear-gradient(135deg, #8B2C31, #A03338)!important;">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0">Danh sách vé đã mua</h5>
          </div>
          <div class="col-auto text-white-50">
            Tổng: <strong>{{ filteredTickets.length }}</strong> vé
          </div>
        </div>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0 align-middle">
            <thead class="bg-light">
              <tr>
                <th width="50" class="text-center">
                  <input type="checkbox" class="form-check-input" :checked="allSelected" @change="toggleAll">
                </th>
                <th>#</th>
                <th>Mã vé</th>
                <th>Trận đấu</th>
                <th>Khán giả</th>
                <th>Ghế</th>
                <th>Giá vé</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, i) in displayedTickets" :key="t._id">
                <td class="text-center">
                  <input type="checkbox" class="form-check-input" :value="t._id" v-model="selectedTickets"
                    :disabled="t.trangThai !== 'cho_thanh_toan'">
                </td>
                <td class="text-muted small">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
                <td><span class="badge bg-primary fs-6 px-3 py-2">{{ t.maVe }}</span></td>
                <td>
                  <div class="fw-bold text-danger">{{ t.doiNha }} vs {{ t.doiKhach }}</div>
                  <small class="text-muted">
                    <i class="bi bi-calendar-event"></i> {{ formatDate(t.ngayBatDau) }}
                    <i class="bi bi-geo-alt ms-2"></i> {{ t.diaDiem || '—' }}
                  </small>
                </td>
                <td>
                  <div class="fw-semibold">{{ t.nguoiMua?.hoVaTen || '—' }}</div>
                  <small class="text-muted"><i class="bi bi-envelope"></i> {{ t.nguoiMua?.email }}</small>
                </td>
                <td><span class="badge bg-dark">{{ t.khuVuc }}{{ t.hangGhe }}-{{ t.soGhe }}</span></td>
                <td class="text-success fw-bold fs-5">{{ formatCurrency(t.giaVe) }}</td>
                <td>{{ formatDateTime(t.ngayMua) }}</td>
                <td>
                  <span :class="getStatusBadge(t.trangThai)">
                    {{ getStatusText(t.trangThai) }}
                  </span>
                </td>
                <td class="text-center">
                  <button v-if="t.trangThai === 'cho_thanh_toan'" @click="confirmSingle(t._id)"
                    class="btn btn-success btn-sm shadow-sm">
                    <i class="bi bi-check-lg"></i> Xác nhận
                  </button>
                  <span v-else class="text-success small fw-bold">Đã xử lý</span>
                </td>
              </tr>

              <!-- Không có vé -->
              <tr v-if="displayedTickets.length === 0">
                <td colspan="10" class="text-center py-6 text-muted">
                  <i class="bi bi-inbox display-1 d-block mb-3 opacity-25"></i>
                  <h5>Không tìm thấy vé nào</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Phân trang -->
      <div class="card-footer bg-light" v-if="totalPages > 1">
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-muted">
            Hiển thị {{ ((currentPage - 1) * pageSize + 1) }} - {{ Math.min(currentPage * pageSize, filteredTickets.length) }}
            trong {{ filteredTickets.length }} vé
          </span>
          <nav>
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--">Trước</button>
              </li>
              <li class="page-item" v-for="p in visiblePages" :key="p" :class="{ active: currentPage === p }">
                <button class="page-link" @click="currentPage = p">{{ p }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++">Sau</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "@/utils/axios";

const tickets = ref([]);
const selectedTickets = ref([]);
const searchQuery = ref("");
const filterStatus = ref("all");
const sortBy = ref("newest");
const currentPage = ref(1);
const pageSize = 50;

// Lấy dữ liệu (giờ lấy TẤT CẢ vé đã mua)
const fetchTickets = async () => {
  try {
    const res = await axios.get("/ve/da-thanh-toan"); // ← API MỚI
    tickets.value = res.data;
  } catch (err) {
    console.error(err);
    alert("Không tải được danh sách vé!");
  }
};

// Bộ lọc + Tìm kiếm + Sắp xếp
const filteredTickets = computed(() => {
  let result = tickets.value;

  // Tìm kiếm
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(t =>
      t.maVe.toLowerCase().includes(q) ||
      t.nguoiMua?.hoVaTen?.toLowerCase().includes(q) ||
      t.nguoiMua?.email?.toLowerCase().includes(q) ||
      `${t.doiNha} ${t.doiKhach}`.toLowerCase().includes(q)
    );
  }

  // Lọc trạng thái
  if (filterStatus.value !== "all") {
    result = result.filter(t => t.trangThai === filterStatus.value);
  }

  // Sắp xếp
  return [...result].sort((a, b) => {
    switch (sortBy.value) {
      case "newest": return new Date(b.ngayMua) - new Date(a.ngayMua);
      case "oldest": return new Date(a.ngayMua) - new Date(b.ngayMua);
      case "priceDesc": return b.giaVe - a.giaVe;
      case "priceAsc": return a.giaVe - b.giaVe;
      case "matchDate": return new Date(a.ngayBatDau) - new Date(b.ngayBatDau);
      default: return 0;
    }
  });
});

const displayedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTickets.value.slice(start, start + pageSize);
});

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / pageSize));
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const allSelected = computed(() => {
  const choXacNhan = displayedTickets.value.filter(t => t.trangThai === 'cho_thanh_toan');
  return choXacNhan.length > 0 && choXacNhan.every(t => selectedTickets.value.includes(t._id));
});

const toggleAll = () => {
  const choXacNhanIds = displayedTickets.value
    .filter(t => t.trangThai === 'cho_thanh_toan')
    .map(t => t._id);
  if (allSelected.value) {
    selectedTickets.value = selectedTickets.value.filter(id => !choXacNhanIds.includes(id));
  } else {
    selectedTickets.value = [...new Set([...selectedTickets.value, ...choXacNhanIds])];
  }
};

// Xác nhận
const confirmSingle = (id) => confirmTickets([id]);
const confirmSelected = () => {
  if (selectedTickets.value.length === 0) return;
  if (confirm(`Xác nhận thanh toán cho ${selectedTickets.value.length} vé?`)) {
    confirmTickets(selectedTickets.value);
  }
};

const confirmTickets = async (ids) => {
  try {
    await axios.put("/ve/xac-nhan-thanh-toan", { ids });
    alert(`Đã xác nhận thành công ${ids.length} vé!`);
    selectedTickets.value = [];
    currentPage.value = 1;
    await fetchTickets();
  } catch (err) {
    alert("Lỗi xác nhận!");
  }
};

// Helper
const getStatusText = (s) => {
  const map = {
    cho_thanh_toan: "Chờ thanh toán",
    da_thanh_toan: "Đã thanh toán",
  };
  return map[s] || s;
};

const getStatusBadge = (s) => {
  const classes = {
    cho_thanh_toan: "badge bg-warning text-dark",
    da_thanh_toan: "badge bg-primary",
    da_vao_san: "badge bg-success"
  };
  return classes[s] || "badge bg-secondary";
};

const formatCurrency = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const formatDateTime = d => d ? new Date(d).toLocaleString('vi-VN') : '—';

let timer;
const debouncedSearch = () => {
  clearTimeout(timer);
  timer = setTimeout(() => { currentPage.value = 1; }, 400);
};

// Reset page khi thay đổi filter/sort
watch([filterStatus, sortBy], () => { currentPage.value = 1; });

onMounted(fetchTickets);
</script>

<style scoped>
.card {
  border-radius: 20px !important;
}

.table th {
  font-weight: 600;
  color: #495057;
}

.badge {
  font-weight: 600;
}
</style>