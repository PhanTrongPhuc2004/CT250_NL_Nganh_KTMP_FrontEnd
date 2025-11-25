<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import instance from '@/utils/axios';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from '@/router';
const isLoading = ref(false);
const matches = ref([]);
const matchResults = ref([]); // THÊM: Lưu kết quả trận đấu
const matchesPlayed = ref([]);
const matchInfor = ref([])
// Refs cho charts...
const resultChartRef = ref(null);
const goalsChartRef = ref(null);
const disciplineChartRef = ref(null);
const ballControlChartRef = ref(null);
const trendChartRef = ref(null);
// ... các ref khác

let resultChartInstance = null;
let goalsChartInstance = null;
let disciplineChartInstance = null;
let ballControlChartInstance = null;
let trendChartInstance = null;
// ... các chart instance khác

const matchStats = ref({
  totalMatches: 0,
  played: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winRate: 0,
  lossRate: 0,
  drawRate: 0,
  goalDifference: 0,
  totalGoalsFor: 0,
  totalGoalsAgainst: 0,
  totalYellowCards: 0,
  totalRedCards: 0,
  totalFouls: 0,
  avgBallControl: 0,
  fairplayRate: 0
});

// Hàm parse score từ string "2-1"
const parseScore = (scoreString) => {
  if (!scoreString) return { home: 0, away: 0, difference: 0 };
  
  try {
    // Xử lý cả định dạng "1-1" và "1 - 2"
    const cleanedScore = scoreString.replace(/\s+/g, '');
    const [home, away] = cleanedScore.split('-').map(num => parseInt(num.trim()) || 0);
    return {
      home,
      away,
      difference: home - away
    };
  } catch (error) {
    return { home: 0, away: 0, difference: 0 };
  }
};

// Fetch dữ liệu từ cả 2 API
const fetchMatchStats = async () => {
  isLoading.value = true;
  try {
    const matchesRes = await instance.get(`${import.meta.env.VITE_API_BE_BASE_URL}/trandau`);
    matches.value = matchesRes.data;
    matchesPlayed.value = matchesRes.data.filter(
      (match) => match.trangThai === 'ket_thuc'
    );
    
    const resultsRes = await instance.get(`${import.meta.env.VITE_API_BE_BASE_URL}/ketquatrandau`);
    matchResults.value = resultsRes.data;
    
    combineMatchData();
    calculateStats(matches.value);
    
    await nextTick();
    setTimeout(() => {
      createCharts();
    }, 100);
    
    // RETURN để biết khi nào hoàn thành
    return { matches: matches.value, matchesPlayed: matchesPlayed.value };
    
  } catch (error) {
    console.error('Lỗi fetch thống kê trận đấu:', error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

// Kết hợp dữ liệu trận đấu và kết quả
const combineMatchData = () => {
  matches.value = matches.value.map(match => {
    // Tìm kết quả tương ứng với trận đấu
    const matchResult = matchResults.value.find(
      result => result.maTranDau === match.maTranDau
    );
    
    // Trả về object kết hợp
    return {
      ...match,
      ketQuaData: matchResult || null // Thêm dữ liệu kết quả vào trận đấu
    };
  });
};

const calculateStats = (matches) => {
  let wins = 0, losses = 0, draws = 0;
  let totalGoalsFor = 0, totalGoalsAgainst = 0;
  let totalYellowCards = 0, totalRedCards = 0, totalFouls = 0;
  let totalBallControl = 0;
  let validBallControlMatches = 0;

  matches.forEach(match => {
    // SỬA: Kiểm tra có ketQuaData không
    if (match.ketQuaData) {
      const ketQua = match.ketQuaData;
      
      // Xử lý tỉ số
      if (ketQua.tiSo) {
        const score = parseScore(ketQua.tiSo);
        totalGoalsFor += score.home;
        totalGoalsAgainst += score.away;

        if (score.difference > 0) wins++;
        else if (score.difference < 0) losses++;
        else draws++;
      }

      // Thống kê kỷ luật - sử dụng đúng tên trường từ model KetQuaTranDau
      totalYellowCards += (ketQua.doiNha_soTheVang || 0) + (ketQua.doiKhach_soTheVang || 0);
      totalRedCards += (ketQua.doiNha_soTheDo || 0) + (ketQua.doiKhach_soTheDo || 0);
      totalFouls += (ketQua.doiNha_soPhaPhamLoi || 0) + (ketQua.doiKhach_soPhaPhamLoi || 0);

      // Thống kê kiểm soát bóng
      if (ketQua.doiNha_tiLeKiemSoatBong !== undefined && ketQua.doiNha_tiLeKiemSoatBong !== null) {
        totalBallControl += ketQua.doiNha_tiLeKiemSoatBong;
        validBallControlMatches++;
      }
    }
  });

  const totalMatches = matches.length;
  const played = matches.filter(match => match.trangThai === 'ket_thuc').length 
  const goalDifference = totalGoalsFor - totalGoalsAgainst;
  const avgBallControl = validBallControlMatches > 0 ? Math.round(totalBallControl / validBallControlMatches) : 0;

  // Tính tỷ lệ Fairplay
  const totalCards = totalYellowCards + totalRedCards * 2;
  const fairplayRate = Math.max(0, 100 - (totalCards * 2 + totalFouls * 0.1));

  matchStats.value = {
    totalMatches,
    played,
    wins,
    losses,
    draws,
    winRate: totalMatches > 0 ? Math.round((wins / played) * 100) : 0,
    lossRate: totalMatches > 0 ? Math.round((losses / played) * 100) : 0,
    drawRate: totalMatches > 0 ? Math.round((draws / played) * 100) : 0,
    goalDifference,
    totalGoalsFor,
    totalGoalsAgainst,
    totalYellowCards,
    totalRedCards,
    totalFouls,
    avgBallControl,
    fairplayRate: Math.round(fairplayRate)
  };
};
// SỬA: Hàm lấy kết quả trận đấu
const findMatchResult = (maTranDau) => {
  return matchInfor.value?.find(result => result.maTranDau === maTranDau);
};

// THÊM HÀM NÀY
const getResultBadgeClass = (match) => {
  const result = findMatchResult(match.maTranDau)?.ketQua;
  
  switch (result) {
    case 'Thắng':
      return 'bg-success';
    case 'Hòa':
      return 'bg-warning text-dark';
    case 'Thua':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};
const getMatchesInfor = async () => {
  try {
    console.log("Bắt đầu lấy thông tin cho", matchesPlayed.value.length, "trận đấu");
    
    // Dùng Promise.allSettled để không bị dừng khi có lỗi
    const promises = matchesPlayed.value.map(async (match) => {
      try {
        const response = await instance.get(`${import.meta.env.VITE_API_BE_BASE_URL}/ketquatrandau/ma/${match.maTranDau}`);
        console.log(`✅ Tìm thấy kết quả cho ${match.maTranDau}`);
        return { success: true, data: response.data, maTranDau: match.maTranDau };
      } catch (error) {
        // Nếu lỗi 404 hoặc lỗi khác, vẫn tiếp tục
        console.warn(`⚠️ Không tìm thấy kết quả cho ${match.maTranDau}:`, error.response?.status || error.message);
        return { success: false, data: null, maTranDau: match.maTranDau, error: error.message };
      }
    });
    
    const results = await Promise.allSettled(promises);
    
    // Lọc chỉ lấy những request thành công
    matchInfor.value = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => result.value.data);
    
    // Thống kê
    const successful = matchInfor.value.length;
    const total = matchesPlayed.value.length;
    console.log(`📊 Kết quả: ${successful}/${total} trận có dữ liệu`);
    
  } catch (error) {
    console.error("Lỗi nghiêm trọng khi lấy thông tin trận đấu:", error);
  }
};

// SỬA: Hàm tính fairplay rate
const calculateFairplayRate = (match) => {
  if (!match.ketQuaData) return 100;
  
  const ketQua = match.ketQuaData;
  const yellowCards = (ketQua.doiNha_soTheVang || 0) + (ketQua.doiKhach_soTheVang || 0);
  const redCards = (ketQua.doiNha_soTheDo || 0) + (ketQua.doiKhach_soTheDo || 0);
  const fouls = (ketQua.doiNha_soPhaPhamLoi || 0) + (ketQua.doiKhach_soPhaPhamLoi || 0);
  
  const penalty = yellowCards * 5 + redCards * 15 + fouls * 1;
  return Math.max(0, 100 - penalty);
};

// SỬA: Hàm lấy kiểm soát bóng để hiển thị
const getBallControlDisplay = (match) => {
  if (!match.ketQuaData) {
    return { home: 0, away: 0 };
  }
  
  const ketQua = match.ketQuaData;
  return {
    home: ketQua.doiNha_tiLeKiemSoatBong || 0,
    away: ketQua.doiKhach_tiLeKiemSoatBong || 0
  };
};

// SỬA: Hàm lấy thống kê thẻ và phạm lỗi
const getDisciplineStats = (match) => {
  if (!match.ketQuaData) {
    return { yellowCards: 0, redCards: 0, fouls: 0 };
  }
  
  const ketQua = match.ketQuaData;
  return {
    yellowCards: (ketQua.doiNha_soTheVang || 0) + (ketQua.doiKhach_soTheVang || 0),
    redCards: (ketQua.doiNha_soTheDo || 0) + (ketQua.doiKhach_soTheDo || 0),
    fouls: (ketQua.doiNha_soPhaPhamLoi || 0) + (ketQua.doiKhach_soPhaPhamLoi || 0)
  };
};

// SỬA: Hàm lấy class badge fairplay
const getFairplayBadgeClass = (match) => {
  const rate = calculateFairplayRate(match);
  if (rate >= 80) return 'bg-success';
  if (rate >= 60) return 'bg-warning text-dark';
  return 'bg-danger';
};

// Các hàm createCharts giữ nguyên...
const createCharts = () => {
  [resultChartInstance, goalsChartInstance, disciplineChartInstance, ballControlChartInstance, trendChartInstance]
    .forEach(chart => chart?.destroy());

  createResultChart();
  createGoalsChart();
  createDisciplineChart();
  createBallControlChart();
  createTrendChart();
};

// SỬA: Hàm tạo trend chart
const createTrendChart = () => {
  if (!trendChartRef.value || matches.value.length === 0) return;

  try {
    const ctx = trendChartRef.value.getContext('2d');
    
    // SỬA: Lấy dữ liệu kiểm soát bóng từ ketQuaData
    const ballControlData = matches.value.map(match => {
      if (match.ketQuaData) {
        return match.ketQuaData.doiNha_tiLeKiemSoatBong || 0;
      }
      return 0;
    });
    
    const matchLabels = matches.value.map((_, index) => `Trận ${index + 1}`);

    trendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: matchLabels,
        datasets: [{
          label: 'Kiểm soát bóng (%)',
          data: ballControlData,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#6c757d' }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { color: '#6c757d' }
          },
          x: {
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  } catch (error) {
    console.error('Lỗi tạo biểu đồ xu hướng:', error);
  }
};

// Các hàm create chart khác giữ nguyên...
const createResultChart = () => {
  if (!resultChartRef.value) return;

  try {
    const ctx = resultChartRef.value.getContext('2d');
    resultChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Thắng', 'Hòa', 'Thua'],
        datasets: [{
          data: [matchStats.value.wins, matchStats.value.draws, matchStats.value.losses],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#6c757d',
              font: { size: 12 }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Lỗi tạo biểu đồ kết quả:', error);
  }
};

const createGoalsChart = () => {
  if (!goalsChartRef.value) return;

  try {
    const ctx = goalsChartRef.value.getContext('2d');
    goalsChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Bàn thắng', 'Bàn thua'],
        datasets: [{
          label: 'Số bàn',
          data: [matchStats.value.totalGoalsFor, matchStats.value.totalGoalsAgainst],
          backgroundColor: ['#28a745', '#dc3545'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#6c757d' }
          },
          x: {
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  } catch (error) {
    console.error('Lỗi tạo biểu đồ bàn thắng:', error);
  }
};

const createDisciplineChart = () => {
  if (!disciplineChartRef.value) return;

  try {
    const ctx = disciplineChartRef.value.getContext('2d');
    disciplineChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Thẻ vàng', 'Thẻ đỏ', 'Pha phạm lỗi'],
        datasets: [{
          label: 'Số lượng',
          data: [matchStats.value.totalYellowCards, matchStats.value.totalRedCards, matchStats.value.totalFouls],
          backgroundColor: ['#ffc107', '#dc3545', '#17a2b8'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#6c757d' }
          },
          x: {
            ticks: { color: '#6c757d' }
          }
        }
      }
    });
  } catch (error) {
    console.error('Lỗi tạo biểu đồ kỷ luật:', error);
  }
};

const createBallControlChart = () => {
  if (!ballControlChartRef.value) return;

  try {
    const ctx = ballControlChartRef.value.getContext('2d');
    ballControlChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Kiểm soát bóng', 'Còn lại'],
        datasets: [{
          data: [matchStats.value.avgBallControl, 100 - matchStats.value.avgBallControl],
          backgroundColor: ['#007bff', '#e9ecef'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#6c757d' }
          }
        }
      }
    });
  } catch (error) {
    console.error('Lỗi tạo biểu đồ kiểm soát bóng:', error);
  }
};

const refreshData = () => {
  fetchMatchStats();
};


const goToDashboard = () => {
  router.push('/admin');
};


onMounted(async() => {
  await fetchMatchStats();
  await getMatchesInfor()
});
</script>

<template>
  <div class="container-fluid">
    <!-- Phần header giữ nguyên -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center " >
          <h1 class="h3 mb-0 d-flex fs-2 pb-3" style="color: var(--primary-color);">
            <FontAwesomeIcon  icon="fas fa-angle-left " style="cursor: pointer;"  @click="goToDashboard"/>
            <p class="m-0">Thống kê trận đấu</p>
          </h1>
          <button class="btn btn-outline-secondary btn-sm" @click="refreshData">
            <i class="fas fa-sync-alt me-1"></i>Làm mới
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <div v-else class="row g-4 pt-3 border-top">
      <!-- Các phần thống kê tổng quan giữ nguyên -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="card-title mb-0 text-dark">Tổng quan trận đấu</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="text-center p-3 border rounded">
                  <div class="h2 text-primary mb-1">{{ matchStats.totalMatches }}</div>
                  <small class="text-muted">Tổng trận</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="text-center p-3 border rounded">
                  <div class="h2 text-success mb-1">{{ matchStats.wins }}</div>
                  <small class="text-muted">Thắng ({{ matchStats.winRate }}%)</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="text-center p-3 border rounded">
                  <div class="h2 text-warning mb-1">{{ matchStats.draws }}</div>
                  <small class="text-muted">Hòa ({{ matchStats.drawRate }}%)</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="text-center p-3 border rounded">
                  <div class="h2 text-danger mb-1">{{ matchStats.losses }}</div>
                  <small class="text-muted">Thua ({{ matchStats.lossRate }}%)</small>
                </div>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-12">
                <h6 class="text-dark mb-3">Phân bố kết quả trận đấu</h6>
                <div class="chart-container">
                  <canvas ref="resultChartRef"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Các phần thống kê khác giữ nguyên -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="card-title mb-0 text-dark">Thống kê bàn thắng</h5>
          </div>
          <div class="card-body">
            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="text-center p-3 border rounded">
                  <div class="h4 text-success mb-1">{{ matchStats.totalGoalsFor }}</div>
                  <small class="text-muted">Bàn thắng</small>
                </div>
              </div>
              <div class="col-6">
                <div class="text-center p-3 border rounded">
                  <div class="h4 text-danger mb-1">{{ matchStats.totalGoalsAgainst }}</div>
                  <small class="text-muted">Bàn thua</small>
                </div>
              </div>
            </div>
            <div class="text-center p-3 border rounded bg-light">
              <div class="h3" :class="matchStats.goalDifference >= 0 ? 'text-success' : 'text-danger'">
                {{ matchStats.goalDifference > 0 ? '+' : '' }}{{ matchStats.goalDifference }}
              </div>
              <small class="text-muted">Hiệu số bàn thắng</small>
            </div>

            <div class="mt-4">
              <h6 class="text-dark mb-3">So sánh bàn thắng/thua</h6>
              <div class="chart-container">
                <canvas ref="goalsChartRef"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bảng chi tiết trận đấu - SỬA: Dùng các hàm mới -->
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="card-title mb-0 text-dark">Chi tiết các trận đấu</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="border-0">Mã trận</th>
                    <th class="border-0">Tỉ số</th>
                    <th class="border-0">Kết quả</th>
                    <th class="border-0">Kiểm soát bóng</th>
                    <th class="border-0">Thẻ vàng</th>
                    <th class="border-0">Thẻ đỏ</th>
                    <th class="border-0">Pha phạm lỗi</th>
                    <th class="border-0">Fairplay</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="match in matchesPlayed" :key="match._id">
                    <td class="fw-semibold">{{ match.maTranDau }}</td>
                    
                    <!-- THÊM: Cột hiển thị tên đội -->
                    
                    
                    <!-- SỬA: Cột tỉ số với tên đội -->
                    <td>
                      <div class="d-flex flex-column align-items-center">
                        <div class="d-flex align-items-center justify-content-between w-100">
                          <small class="fw-semibold text-primary">{{ match.doiNha }}</small>
                          <span class="badge bg-dark mx-2" v-if="match.ketQuaData && match.ketQuaData.tiSo">
                            {{ parseScore(match.ketQuaData.tiSo).home }} - {{ parseScore(match.ketQuaData.tiSo).away }}
                          </span>
                          <small class="fw-semibold text-danger">{{ match.doiKhach }}</small>
                        </div>
                        <small class="text-muted mt-1" v-if="!match.ketQuaData || !match.ketQuaData.tiSo">
                          Chưa có kết quả
                        </small>
                      </div>
                    </td>
                    
                    <td>
                      <span :class="getResultBadgeClass(match)" class="badge">
                        {{ findMatchResult(match.maTranDau)?.ketQua || 'Chưa có kết quả' }}
                      </span>
                    </td>
                    
                    <td>
                      <div class="d-flex align-items-center">
                        <small class="text-muted me-2">N:{{ getBallControlDisplay(match).home }}%</small>
                        <small class="text-muted">K:{{ getBallControlDisplay(match).away }}%</small>
                      </div>
                    </td>
                    
                    <td>
                      <span class="badge bg-warning text-dark">
                        {{ getDisciplineStats(match).yellowCards }}
                      </span>
                    </td>
                    
                    <td>
                      <span class="badge bg-danger">
                        {{ getDisciplineStats(match).redCards }}
                      </span>
                    </td>
                    
                    <td>
                      <span class="badge bg-info text-dark">
                        {{ getDisciplineStats(match).fouls }}
                      </span>
                    </td>
                    
                    <td>
                      <span :class="getFairplayBadgeClass(match)" class="badge">
                        {{ calculateFairplayRate(match) }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* CSS giữ nguyên và thêm */
.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.75rem;
}

.bg-dark {
  background-color: #343a40 !important;
}

.text-primary {
  color: #007bff !important;
}

.text-danger {
  color: #dc3545 !important;
}

.fw-bold {
  font-weight: 600;
}

/* Đảm bảo bảng responsive */
.table-responsive {
  border-radius: 0.5rem;
}
</style>