<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header bg-white rounded p-4 mb-4 border">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h1 class="h4 mb-0 text-dark">
            <i class="fas fa-futbol me-2 text-primary"></i>Dashboard Quản Lý CLB Bóng Đá
          </h1>
        </div>
        <div class="col-md-6 text-end">
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-outline-primary btn-sm" @click="refreshData">
              <i class="fas fa-sync-alt me-1"></i> Làm mới
            </button>
            <select v-model="selectedPeriod" @change="filterData" class="form-select form-select-sm w-auto">
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 4 Ô Thống kê chính -->
    <div class="row g-3">
      <!-- Ô Thống kê trận đấu -->
      <div class="col-md-3 rounded p-3 text-white shadow match-stats-card" style="background: linear-gradient(135deg, #0d6efd, #0dcaf0);">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h3 class="h5 mb-0">Thống kê trận đấu</h3>
          <i class="fas fa-futbol fs-5 opacity-75"></i>
        </div>
        
        <p class="fs-4 fw-bold mb-1">{{ matchStats.totalMatches }}</p>
        <small class="opacity-75 mb-3 d-block">Tổng số trận</small>

        <div class="match-details">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small>Thắng:</small>
            <small class="fw-semibold">{{ matchStats.wins }} ({{ matchStats.winRate }}%)</small>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small>Thua:</small>
            <small class="fw-semibold">{{ matchStats.losses }} ({{ matchStats.lossRate }}%)</small>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small>Hòa:</small>
            <small class="fw-semibold">{{ matchStats.draws }} ({{ matchStats.drawRate }}%)</small>
          </div>
        </div>

        <!-- Hiệu số bàn thắng -->
        <div class="goal-stats mt-2 pt-2 border-top border-white border-opacity-25">
          <div class="d-flex justify-content-between align-items-center">
            <small>Hiệu số:</small>
            <small class="fw-bold" :class="matchStats.goalDifference >= 0 ? 'text-success' : 'text-danger'">
              {{ matchStats.goalDifference > 0 ? '+' : '' }}{{ matchStats.goalDifference }}
            </small>
          </div>
        </div>

        <button class="btn btn-light btn-sm w-100 mt-3" @click="goToMatchStats">
          <i class="fas fa-chart-line me-1"></i>
          Phân tích chi tiết
        </button>
      </div>

      <!-- Ô Doanh thu vé -->
      <div class="col-md-3 rounded p-3 shadow text-white revenue-card" style="background: linear-gradient(135deg, #198754, #20c997);">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h3 class="h5 mb-0">Doanh thu vé</h3>
          <i class="fas fa-money-bill-wave fs-5 opacity-75"></i>
        </div>
        
        <p class="fs-4 fw-bold mb-2">{{ formatCurrency(ticketStats.totalRevenue) }}</p>
        
        <div class="ticket-details">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small>Tổng vé bán:</small>
            <small class="fw-semibold">{{ ticketStats.totalTickets }} vé</small>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small>Trung bình/vé:</small>
            <small class="fw-semibold">{{ formatCurrency(ticketStats.averagePrice) }}</small>
          </div>
        </div>

        <button class="btn btn-light btn-sm w-100 mt-2" @click="goToTicketRevenue">
          <i class="fas fa-chart-bar me-1"></i>
          Xem phân tích
        </button>
      </div>

      <!-- Ô Số vé bán -->
      

      <!-- Ô Thống kê quà lưu niệm -->
      <div class="col-md-3 rounded p-3 shadow text-white" style="background: linear-gradient(135deg, #6f42c1, #e83e8c);">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h3 class="h5 mb-0">Quà lưu niệm</h3>
          <i class="fas fa-gift fs-5 opacity-75"></i>
        </div>
        
        <p class="fs-4 fw-bold mb-2">{{ formatCurrency(souvenirStats.totalRevenue) }}</p>
        
        <div class="souvenir-details">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small>Tổng đơn hàng:</small>
            <small class="fw-semibold">{{ souvenirStats.totalOrders }}</small>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small>Số lượng bán:</small>
            <small class="fw-semibold">{{ souvenirStats.totalQuantity }} SP</small>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <small>Đơn hàng TB:</small>
            <small class="fw-semibold">{{ formatCurrency(souvenirStats.averageOrder) }}</small>
          </div>
        </div>

        <!-- Top sản phẩm -->
        <div class="top-products mt-2 pt-2 border-top border-white border-opacity-25">
          <small class="d-block mb-1 opacity-75">Sản phẩm bán chạy:</small>
          <small class="fw-semibold">{{ souvenirStats.topProduct || 'Chưa có dữ liệu' }}</small>
        </div>

        <button class="btn btn-light btn-sm w-100 mt-3" @click="goToSouvenirStats">
          <i class="fas fa-chart-pie me-1"></i>
          Thống kê chi tiết
        </button>
      </div>
    </div>

    <!-- Loading Component -->
    <Loading
      v-model:active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="true"
      :loader="spinner"
      :color="'#0d6efd'"
      :height="64"
      :width="64"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import instance from '@/utils/axios';
import { parseScore } from '@/utils';
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const router = useRouter();

// --- Reactive data
const isLoading = ref(false);
const selectedPeriod = ref('month');
const spinner = "dots";

// --- Dữ liệu thống kê trận đấu
const matchStats = ref({
  totalMatches: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winRate: 0,
  lossRate: 0,
  drawRate: 0,
  goalDifference: 0,
  totalGoalsFor: 0,
  totalGoalsAgainst: 0
});

// --- Dữ liệu doanh thu vé
const ticketStats = ref({
  totalRevenue: 0,
  totalTickets: 0,
  averagePrice: 0
});

// --- Dữ liệu quà lưu niệm
const souvenirStats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalQuantity: 0,
  averageOrder: 0,
  topProduct: ''
});

// --- Computed properties
const occupancyRate = computed(() => {
  const maxCapacity = 1000;
  return Math.round((ticketStats.value.totalTickets / maxCapacity) * 100);
});

// --- Format helpers
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// --- API calls
const fetchMatchStats = async () => {
  isLoading.value = true;
  try {
    const res = await instance.get('/ketquatrandau');
    const matches = res.data;
    if (matches && Array.isArray(matches)) {
      calculateMatchStats(matches);
    }
  } catch (error) {
    console.error('Lỗi fetch thống kê trận đấu:', error);
    // Fallback data với các trận đấu mẫu
    const sampleMatches = [
      { tiSo: '2-1', trangThai: 'completed' },
      { tiSo: '1-1', trangThai: 'completed' },
      { tiSo: '3-0', trangThai: 'completed' },
      { tiSo: '0-2', trangThai: 'completed' },
      { tiSo: '2-2', trangThai: 'completed' }
    ];
    calculateMatchStats(sampleMatches);
  } finally {
    isLoading.value = false;
  }
};

const calculateMatchStats = (matches) => {
  let wins = 0, losses = 0, draws = 0;
  let totalGoalsFor = 0, totalGoalsAgainst = 0;

  matches.forEach(match => {
    if (match.tiSo) {
      try {
        const score = parseScore(match.tiSo);
        
        totalGoalsFor += score.home;
        totalGoalsAgainst += score.away;

        if (score.difference > 0) {
          wins++;
        } else if (score.difference < 0) {
          losses++;
        } else {
          draws++;
        }
      } catch (error) {
        console.warn('Lỗi parse tỉ số:', match.tiSo, error);
      }
    }
  });

  const totalMatches = matches.length;
  const goalDifference = totalGoalsFor - totalGoalsAgainst;

  matchStats.value = {
    totalMatches,
    wins,
    losses,
    draws,
    winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
    lossRate: totalMatches > 0 ? Math.round((losses / totalMatches) * 100) : 0,
    drawRate: totalMatches > 0 ? Math.round((draws / totalMatches) * 100) : 0,
    goalDifference,
    totalGoalsFor,
    totalGoalsAgainst
  };
};

const fetchTicketStats = async () => {
  isLoading.value = true;
  try {
    const res = await instance.get('/ve/thongke?range=all');
    const data = res.data;

    if (data) {
      const byLoaiVe = data.byLoaiVe || [];
      const totalTickets = byLoaiVe.reduce((sum, item) => sum + (item.soVe || 0), 0);
      const totalRevenue = byLoaiVe.reduce((sum, item) => sum + (item.doanhThu || 0), 0);
      const averagePrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;

      ticketStats.value = {
        totalRevenue: totalRevenue || 0,
        totalTickets: totalTickets || 0,
        averagePrice: averagePrice || 0
      };
    }
  } catch (error) {
    console.error('Lỗi fetch thống kê vé:', error);
    // Fallback data
    ticketStats.value = {
      totalRevenue: 85000000,
      totalTickets: 1250,
      averagePrice: 68000
    };
  } finally {
    isLoading.value = false;
  }
};

const fetchSouvenirStats = async () => {
  isLoading.value = true;
  try {
    // Lấy thống kê tổng thể theo tháng
    const generalRes = await instance.get('/donhang/thongke?option=monthly');
    const generalData = generalRes.data;

    // Lấy thống kê theo sản phẩm để có số lượng bán
    const productRes = await instance.get('/donhang/thongke/sanpham');
    const productData = productRes.data;

    console.log('Dữ liệu sản phẩm từ API:', productData);

    if (generalData && Array.isArray(generalData) && generalData.length > 0) {
      // Tính tổng doanh thu từ tất cả các tháng
      const totalRevenue = generalData.reduce((sum, item) => sum + (item.value || 0), 0);
      
      // TÍNH TỔNG SỐ LƯỢNG BÁN TỪ API SẢN PHẨM
      let totalQuantity = 0;
      let topProduct = 'Chưa có dữ liệu';
      let maxQuantity = 0;

      if (productData && Array.isArray(productData)) {
        // Tính tổng số lượng bán từ tất cả sản phẩm
        totalQuantity = productData.reduce((sum, product) => sum + (product.quantity || 0), 0);
        
        // Tìm sản phẩm bán chạy nhất
        productData.forEach(product => {
          if (product.quantity > maxQuantity) {
            maxQuantity = product.quantity;
            topProduct = product.product;
          }
        });
      }

      // Tính các chỉ số khác
      const totalOrders = Math.round(totalRevenue / 500000); // Giả sử đơn hàng trung bình 500k
      const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      souvenirStats.value = {
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalQuantity: totalQuantity || 0,
        averageOrder: averageOrder || 0,
        topProduct: topProduct || 'Áo đấu CLB'
      };

      console.log('Thống kê quà lưu niệm:', souvenirStats.value);
    }
  } catch (error) {
    console.error('Lỗi fetch thống kê quà lưu niệm:', error);
    // Fallback data
    souvenirStats.value = {
      totalRevenue: 13000000,
      totalOrders: 25,
      totalQuantity: 70,
      averageOrder: 520000,
      topProduct: 'Áo đấu CLB'
    };
  } finally {
    isLoading.value = false;
  }
};

// --- Navigation
const goToMatchStats = () => {
  router.push('/admin/match-stats');
};

const goToTicketRevenue = () => {
  router.push('/admin/ticket-revenue');
};

const goToSouvenirStats = () => {
  router.push('/admin/thongke');
};

// --- Utility functions
const refreshData = () => {
  isLoading.value = true;
  Promise.all([
    fetchMatchStats(),
    fetchTicketStats(),
    fetchSouvenirStats()
  ]).finally(() => {
    isLoading.value = false;
  });
};

const filterData = () => {
  console.log('Filtering data for:', selectedPeriod.value);
  refreshData();
};

const onCancel = () => {
  console.log('Loading cancelled');
};

// --- Lifecycle
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.dashboard-header {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.match-stats-card,
.revenue-card {
  transition: all 0.3s ease;
  border: none;
  min-height: 280px;
}

.match-stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3) !important;
}

.revenue-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 135, 84, 0.3) !important;
}

.match-details,
.ticket-details,
.occupancy-stats,
.souvenir-details {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px;
  margin: 8px 0;
}

.top-products {
  font-size: 0.8rem;
}

.btn-light {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.match-stats-card .btn-light {
  color: #0d6efd;
}

.revenue-card .btn-light {
  color: #198754;
}

.btn-light:hover {
  background: white;
  transform: translateY(-1px);
}

.btn-dark {
  background: rgba(33, 37, 41, 0.9);
  border: none;
  color: #ffc107;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-dark:hover {
  background: #212529;
  color: #ffc107;
  transform: translateY(-1px);
}

.goal-stats {
  font-size: 0.85rem;
}

small {
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }
  
  .col-md-3 {
    margin-bottom: 1rem;
  }
  
  .match-stats-card,
  .revenue-card {
    min-height: auto;
  }
}
</style>