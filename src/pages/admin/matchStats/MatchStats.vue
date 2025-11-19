<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0 text-dark">
            <i class="fas fa-chart-line me-2"></i>Thống kê trận đấu
          </h1>
          <button class="btn btn-outline-secondary btn-sm" @click="refreshData">
            <i class="fas fa-sync-alt me-1"></i>Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="row g-4">
      <!-- Thống kê tổng quan -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="card-title mb-0 text-dark">Tổng quan trận đấu</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <!-- Tổng số trận -->
              <div class="col-md-3">
                <div class="text-center p-3 border rounded">
                  <div class="h2 text-primary mb-1">{{ matchStats.totalMatches }}</div>
                  <small class="text-muted">Tổng trận</small>
                </div>
              </div>
              <!-- Thắng -->
              <div class="col-md-3">
                <div class="text-center p-3 border rounded">
                  <div class="h2 text-success mb-1">{{ matchStats.wins }}</div>
                  <small class="text-muted">Thắng ({{ matchStats.winRate }}%)</small>
                </div>
              </div>
              <!-- Hòa -->
              <div class="col-md-3">
                <div class="text-center p-3 border rounded">
                  <div class="h2 text-warning mb-1">{{ matchStats.draws }}</div>
                  <small class="text-muted">Hòa ({{ matchStats.drawRate }}%)</small>
                </div>
              </div>
              <!-- Thua -->
              <div class="col-md-3">
                <div class="text-center p-3 border rounded">
                  <div class="h2 text-danger mb-1">{{ matchStats.losses }}</div>
                  <small class="text-muted">Thua ({{ matchStats.lossRate }}%)</small>
                </div>
              </div>
            </div>

            <!-- Biểu đồ tỷ lệ kết quả -->
            <div class="row mt-4">
              <div class="col-12">
                <h6 class="text-dark mb-3">Phân bố kết quả trận đấu</h6>
                <canvas id="resultChart" height="100"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thống kê bàn thắng -->
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
          </div>
        </div>
      </div>

      <!-- Thống kê kỷ luật -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="card-title mb-0 text-dark">Thống kê kỷ luật</h5>
          </div>
          <div class="card-body">
            <div class="row g-3 mb-4">
              <div class="col-4">
                <div class="text-center p-3 border rounded">
                  <div class="h4 text-warning mb-1">{{ matchStats.totalYellowCards }}</div>
                  <small class="text-muted">Thẻ vàng</small>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center p-3 border rounded">
                  <div class="h4 text-danger mb-1">{{ matchStats.totalRedCards }}</div>
                  <small class="text-muted">Thẻ đỏ</small>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center p-3 border rounded">
                  <div class="h4 text-info mb-1">{{ matchStats.totalFouls }}</div>
                  <small class="text-muted">Pha phạm lỗi</small>
                </div>
              </div>
            </div>
            <canvas id="disciplineChart" height="150"></canvas>
          </div>
        </div>
      </div>

      <!-- Thống kê kiểm soát bóng -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="card-title mb-0 text-dark">Kiểm soát bóng & Fairplay</h5>
          </div>
          <div class="card-body">
            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="text-center p-3 border rounded">
                  <div class="h4 text-primary mb-1">{{ matchStats.avgBallControl }}%</div>
                  <small class="text-muted">Kiểm soát bóng TB</small>
                </div>
              </div>
              <div class="col-6">
                <div class="text-center p-3 border rounded">
                  <div class="h4" :class="matchStats.fairplayRate >= 80 ? 'text-success' : matchStats.fairplayRate >= 60 ? 'text-warning' : 'text-danger'">
                    {{ matchStats.fairplayRate }}%
                  </div>
                  <small class="text-muted">Tỷ lệ Fairplay</small>
                </div>
              </div>
            </div>
            <canvas id="ballControlChart" height="150"></canvas>
          </div>
        </div>
      </div>

      <!-- Chi tiết từng trận -->
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
                  <tr v-for="match in matches" :key="match._id">
                    <td class="fw-semibold">{{ match.maTranDau }}</td>
                    <td>
                      <span class="badge bg-light text-dark fs-6">{{ match.tiSo }}</span>
                    </td>
                    <td>
                      <span :class="getResultBadgeClass(match.tiSo)" class="badge">
                        {{ getMatchResult(match.tiSo) }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <small class="text-muted me-2">N:{{ match.doiNha_tiLeKiemSoatBong }}%</small>
                        <small class="text-muted">K:{{ match.doiKhach_tiLeKiemSoatBong }}%</small>
                      </div>
                    </td>
                    <td>
                      <span class="badge bg-warning text-dark">
                        {{ (match.doiNha_soTheVang || 0) + (match.doiKhach_soTheVang || 0) }}
                      </span>
                    </td>
                    <td>
                      <span class="badge bg-danger">
                        {{ (match.doiNha_soTheDo || 0) + (match.doiKhach_soTheDo || 0) }}
                      </span>
                    </td>
                    <td>
                      <span class="badge bg-info text-dark">
                        {{ (match.doiNha_soPhaPhamLoi || 0) + (match.doiKhach_soPhaPhamLoi || 0) }}
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

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import instance from '@/utils/axios';
import { parseScore } from '@/utils';

Chart.register(...registerables);

// Reactive data
const isLoading = ref(false);
const matches = ref([]);
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
  totalGoalsAgainst: 0,
  totalYellowCards: 0,
  totalRedCards: 0,
  totalFouls: 0,
  avgBallControl: 0,
  fairplayRate: 0
});

// Chart instances
let resultChart = null;
let disciplineChart = null;
let ballControlChart = null;

// API call
const fetchMatchStats = async () => {
  isLoading.value = true;
  try {
    const res = await instance.get('/ketquatrandau');
    matches.value = res.data;
    calculateStats(matches.value);
    createCharts();
  } catch (error) {
    console.error('Lỗi fetch thống kê trận đấu:', error);
  } finally {
    isLoading.value = false;
  }
};

// Calculate statistics
const calculateStats = (matches) => {
  let wins = 0, losses = 0, draws = 0;
  let totalGoalsFor = 0, totalGoalsAgainst = 0;
  let totalYellowCards = 0, totalRedCards = 0, totalFouls = 0;
  let totalBallControl = 0;

  matches.forEach(match => {
    // Tính kết quả trận đấu
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
        console.warn('Lỗi parse tỉ số:', match.tiSo);
      }
    }

    // Tính thẻ và pha phạm lỗi
    totalYellowCards += (match.doiNha_soTheVang || 0) + (match.doiKhach_soTheVang || 0);
    totalRedCards += (match.doiNha_soTheDo || 0) + (match.doiKhach_soTheDo || 0);
    totalFouls += (match.doiNha_soPhaPhamLoi || 0) + (match.doiKhach_soPhaPhamLoi || 0);

    // Tính kiểm soát bóng
    if (match.doiNha_tiLeKiemSoatBong) {
      totalBallControl += match.doiNha_tiLeKiemSoatBong;
    }
  });

  const totalMatches = matches.length;
  const goalDifference = totalGoalsFor - totalGoalsAgainst;
  const avgBallControl = totalMatches > 0 ? Math.round(totalBallControl / totalMatches) : 0;

  // Tính tỷ lệ Fairplay (càng ít thẻ và phạm lỗi càng cao)
  const totalCards = totalYellowCards + totalRedCards * 2; // Thẻ đỏ tính nặng hơn
  const fairplayRate = Math.max(0, 100 - (totalCards * 2 + totalFouls * 0.1));

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
    totalGoalsAgainst,
    totalYellowCards,
    totalRedCards,
    totalFouls,
    avgBallControl,
    fairplayRate: Math.round(fairplayRate)
  };
};

// Create charts
const createCharts = () => {
  // Biểu đồ kết quả
  if (resultChart) resultChart.destroy();
  const resultCtx = document.getElementById('resultChart').getContext('2d');
  resultChart = new Chart(resultCtx, {
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

  // Biểu đồ kỷ luật
  if (disciplineChart) disciplineChart.destroy();
  const disciplineCtx = document.getElementById('disciplineChart').getContext('2d');
  disciplineChart = new Chart(disciplineCtx, {
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

  // Biểu đồ kiểm soát bóng
  if (ballControlChart) ballControlChart.destroy();
  const ballControlCtx = document.getElementById('ballControlChart').getContext('2d');
  ballControlChart = new Chart(ballControlCtx, {
    type: 'line',
    data: {
      labels: matches.value.map((_, index) => `Trận ${index + 1}`),
      datasets: [{
        label: 'Kiểm soát bóng (%)',
        data: matches.value.map(match => match.doiNha_tiLeKiemSoatBong || 0),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
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
};

// Helper functions
const getMatchResult = (score) => {
  if (!score) return 'Chưa có kết quả';
  try {
    const result = parseScore(score);
    if (result.difference > 0) return 'Thắng';
    if (result.difference < 0) return 'Thua';
    return 'Hòa';
  } catch {
    return 'Lỗi';
  }
};

const getResultBadgeClass = (score) => {
  if (!score) return 'bg-secondary';
  try {
    const result = parseScore(score);
    if (result.difference > 0) return 'bg-success';
    if (result.difference < 0) return 'bg-danger';
    return 'bg-warning text-dark';
  } catch {
    return 'bg-secondary';
  }
};

const calculateFairplayRate = (match) => {
  const yellowCards = (match.doiNha_soTheVang || 0) + (match.doiKhach_soTheVang || 0);
  const redCards = (match.doiNha_soTheDo || 0) + (match.doiKhach_soTheDo || 0);
  const fouls = (match.doiNha_soPhaPhamLoi || 0) + (match.doiKhach_soPhaPhamLoi || 0);
  
  const penalty = yellowCards * 5 + redCards * 15 + fouls * 1;
  return Math.max(0, 100 - penalty);
};

const getFairplayBadgeClass = (match) => {
  const rate = calculateFairplayRate(match);
  if (rate >= 80) return 'bg-success';
  if (rate >= 60) return 'bg-warning text-dark';
  return 'bg-danger';
};

const refreshData = () => {
  fetchMatchStats();
};

// Lifecycle
onMounted(() => {
  fetchMatchStats();
});
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}

.table th {
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
}

.table td {
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
}

.border {
  border-color: #e9ecef !important;
}
</style>