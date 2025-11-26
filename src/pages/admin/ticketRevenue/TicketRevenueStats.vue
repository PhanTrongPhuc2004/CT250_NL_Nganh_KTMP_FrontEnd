<!-- src/pages/admin/ticketManagement/TicketRevenueStats.vue -->
<template>
    <div class="container py-4 admin-stats-page">
        <h1 class="mb-4 text-header text-center">Thống kê Doanh thu Vé</h1>

        <div class="filter-card mb-4 p-3">
            <div class="row g-3">
                <div class="col-md-3">
                    <label class="form-label text-danger fw-bold">Giải đấu</label>
                    <select class="form-select form-select-sm clean-select" v-model="filters.giaiDau"
                        @change="onGiaiDauChange">
                        <option value="">Chọn giải đấu</option>
                        <option v-for="gd in giaiDauList" :key="gd._id" :value="gd.maGiaiDau">{{ gd.tenGiaiDau }}
                        </option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label text-danger fw-bold">Mùa giải</label>
                    <select class="form-select form-select-sm clean-select" v-model="filters.muaGiai"
                        @change="onMuaGiaiChange" :disabled="!filters.giaiDau">
                        <option value="">Chọn mùa giải</option>
                        <option v-for="mg in muaGiaiList" :key="mg._id" :value="mg.maMuaGiai">{{ mg.tenMuaGiai }}
                        </option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label text-danger fw-bold">Trận đấu</label>
                    <select class="form-select form-select-sm clean-select" v-model="filters.match" @change="fetchStats"
                        :disabled="!filters.muaGiai">
                        <option value="">Tất cả trận trong mùa</option>
                        <option v-for="td in tranDauList" :key="td._id" :value="td.maTranDau">
                            {{ td.doiNha?.tenDoiBong || td.doiNha }} vs {{ td.doiKhach?.tenDoiBong || td.doiKhach }} -
                            {{ formatDate(td.ngayBatDau) }}
                        </option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label text-danger fw-bold">Khoảng thời gian</label>
                    <select class="form-select form-select-sm clean-select" v-model="timeRange" @change="fetchStats">
                        <option value="all">Toàn thời gian</option>
                        <option value="daily">Hôm nay</option>
                        <option value="weekly">Tuần này</option>
                        <option value="monthly">Tháng này</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading / Error / No Data -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-danger" role="status"></div>
            <p class="mt-3 text-muted">Đang tải dữ liệu thống kê...</p>
        </div>

        <div v-else-if="error" class="text-center py-5">
            <div class="alert alert-danger d-inline-block p-4">
                <i class="bi bi-exclamation-triangle-fill fs-1"></i>
                <p class="mt-3 mb-0 fw-bold">Lỗi kết nối server</p>
            </div>
        </div>

        <div v-else-if="!hasData" class="text-center py-5">
            <div class="bg-light rounded-4 p-5 shadow-sm max-w-600 mx-auto">
                <i class="bi bi-bar-chart-line text-muted fs-1 mb-4"></i>
                <h4 class="text-muted mb-3">Chưa có dữ liệu doanh thu</h4>
                <p class="text-muted">Vui lòng chọn mùa giải/trận đấu hoặc chờ thêm dữ liệu bán vé.</p>
            </div>
        </div>

        <!-- Có dữ liệu -->
        <div v-else>
            <div class="text-center mb-5">
                <h2 class="text-secondary fw-bold display-6">{{ dynamicTitle }}</h2>
                <p class="display-5 text-danger fw-bold">{{ formatCurrency(totalRevenue) }}</p>
            </div>

            <section class="general-stats card p-4 mb-5 shadow-sm bg-light">
                <canvas ref="lineChartRef" class="chart-canvas"></canvas>
            </section>

            <section class="product-stats card p-4 shadow-sm bg-light">
                <h2 class="text-secondary mb-3">Thống kê theo loại vé</h2>
                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <div class="card p-3 h-100 shadow-sm">
                            <h3 class="h5 text-center mb-3">Doanh thu theo loại vé</h3>
                            <canvas ref="barChartRef" class="chart-canvas"></canvas>
                        </div>
                    </div>
                    <div class="col-lg-6 mb-4">
                        <div class="card p-3 h-100 shadow-sm">
                            <h3 class="h5 text-center mb-3">Số lượng vé bán ra</h3>
                            <canvas ref="pieChartRef" class="chart-canvas"></canvas>
                        </div>
                    </div>
                </div>
            </section>

            <!-- TOP 5 TRẬN ĐẤU -->
            <section v-if="filters.muaGiai && !filters.match && topMatches.length"
                class="top-matches card p-4 shadow-sm bg-light">
                <h2 class="text-secondary mb-3">Top 5 trận đấu doanh thu cao nhất mùa giải</h2>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th width="60">#</th>
                                <th width="280">Trận đấu</th>
                                <th width="110">Ngày</th>
                                <th width="90">Giờ</th>
                                <th width="180">Sân vận động</th>
                                <th class="text-center">Số vé</th>
                                <th class="text-end">Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in topMatches" :key="i">
                                <td class="fw-bold">{{ i + 1 }}</td>
                                <td class="text-nowrap">{{ item.tranDau }}</td>
                                <td class="text-nowrap">{{ formatDate(item.ngayBatDau) }}</td>
                                <td class="text-nowrap">{{ formatTime(item.ngayBatDau) }}</td>
                                <td>
                                    <span class="text-nowrap">
                                        {{ item.sanVanDong || 'Chưa xác định' }}
                                    </span>
                                </td>
                                <td class="text-center">{{ item.soVe }}</td>
                                <td class="text-end text-success fw-bold">{{ formatCurrency(item.doanhThu) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import axios from "@/utils/axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const lineChartRef = ref(null);
const barChartRef = ref(null);
const pieChartRef = ref(null);

let lineChart = null;
let barChart = null;
let pieChart = null;

const giaiDauList = ref([]);
const muaGiaiList = ref([]);
const tranDauList = ref([]);
const filters = ref({ giaiDau: "", muaGiai: "", match: "" });
const timeRange = ref("all");

const isLoading = ref(false);
const error = ref(false);
const hasData = ref(false);
const topMatches = ref([]);
const totalRevenue = ref(0);

const dynamicTitle = computed(() => {
    if (filters.value.match) {
        const match = tranDauList.value.find(t => t.maTranDau === filters.value.match);
        const name = match ? `${match.doiNha?.tenDoiBong || match.doiNha} vs ${match.doiKhach?.tenDoiBong || match.doiKhach}` : "Trận đấu";
        return `Doanh thu trận đấu "${name}" cho đến nay`;
    }
    if (filters.value.muaGiai) {
        const muaGiai = muaGiaiList.value.find(m => m.maMuaGiai === filters.value.muaGiai);
        return `Doanh thu mùa giải "${muaGiai?.tenMuaGiai || ''}" cho đến nay`;
    }
    return "Thống kê doanh thu vé";
});

// Destroy all charts
const destroyCharts = () => {
    [lineChart, barChart, pieChart].forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    lineChart = barChart = pieChart = null;
};

// Render charts - luôn tạo mới
const renderCharts = async (data) => {
    await nextTick(); // Đảm bảo canvas đã sẵn sàng

    const { timeSeries = [], byLoaiVe = [] } = data;
    const labels = timeSeries.map(d => d.date || ' ');
    const values = timeSeries.map(d => d.value || 0);

    destroyCharts(); // ← Quan trọng: luôn destroy trước

    // Line Chart
    if (lineChartRef.value) {
        lineChart = new Chart(lineChartRef.value, {
            type: "line",
            data: { labels, datasets: [{ label: "Doanh thu", data: values, borderColor: "#E02128", backgroundColor: "rgba(224,33,40,0.1)", tension: 0.4, fill: true }] },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    // Bar Chart
    if (barChartRef.value) {
        barChart = new Chart(barChartRef.value, {
            type: "bar",
            data: { labels: byLoaiVe.map(d => formatLoaiVe(d.loaiVe)), datasets: [{ data: byLoaiVe.map(d => d.doanhThu || 0), backgroundColor: "#8B2C31" }] },
            options: { responsive: true }
        });
    }

    // Pie Chart
    if (pieChartRef.value) {
        pieChart = new Chart(pieChartRef.value, {
            type: "doughnut",
            data: { labels: byLoaiVe.map(d => formatLoaiVe(d.loaiVe)), datasets: [{ data: byLoaiVe.map(d => d.soVe || 0), backgroundColor: ["#E02128", "#8B2C31", "#F8D7DA", "#6C757D"] }] },
            options: { responsive: true, plugins: { legend: { position: 'right' } } }
        });
    }
};

const resetAllData = () => {
    hasData.value = false;
    totalRevenue.value = 0;
    topMatches.value = [];
    error.value = false;
    destroyCharts(); // ← Destroy khi reset
};

const fetchStats = async () => {
    if (!filters.value.muaGiai) return;

    isLoading.value = true;
    resetAllData();

    const params = new URLSearchParams();
    if (filters.value.match) params.append("maTranDau", filters.value.match);
    if (filters.value.muaGiai) params.append("maMuaGiai", filters.value.muaGiai);
    if (timeRange.value !== "all") params.append("range", timeRange.value);

    try {
        const res = await axios.get(`/ve/thongke?${params.toString()}`);
        const data = res.data || {};

        totalRevenue.value = data.timeSeries?.reduce((sum, d) => sum + d.value, 0) || 0;

        if (totalRevenue.value > 0 || data.byLoaiVe?.length > 0) {
            hasData.value = true;
            await renderCharts(data); // ← Dùng hàm mới

            if (filters.value.muaGiai && !filters.value.match) {
                fetchTopMatchesInMuaGiai();
            }
        }
    } catch (err) {
        error.value = true;
    } finally {
        isLoading.value = false;
    }
};

const fetchTopMatchesInMuaGiai = async () => {
    try {
        const res = await axios.get(`/ve/thongke/top?maMuaGiai=${filters.value.muaGiai}`);
        topMatches.value = res.data || [];
    } catch (err) {
        topMatches.value = [];
    }
};

const onGiaiDauChange = () => {
    filters.value.muaGiai = "";
    filters.value.match = "";
    muaGiaiList.value = [];
    tranDauList.value = [];
    resetAllData();
    fetchMuaGiai();
};

const onMuaGiaiChange = () => {
    filters.value.match = "";
    tranDauList.value = [];
    fetchTranDau();
    fetchStats();
};

const fetchGiaiDau = async () => {
    const res = await axios.get("/giaidau");
    giaiDauList.value = res.data;
};

const fetchMuaGiai = async () => {
    if (!filters.value.giaiDau) return;
    const res = await axios.get(`/muagiai?maGiaiDau=${filters.value.giaiDau}`);
    muaGiaiList.value = res.data;
};

const fetchTranDau = async () => {
    if (!filters.value.muaGiai) return;
    const res = await axios.get(`/muagiai/ma/${filters.value.muaGiai}/trandau`);
    tranDauList.value = res.data;
};

// Helper
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }) : '';
const formatTime = (d) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
const formatCurrency = (v) => v ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v) : '0 ₫';
const formatLoaiVe = (v) => v === 'Thuong' ? 'Thường' : v === 'KhuyenMai' ? 'Khuyến mãi' : v || 'Khác';

onMounted(() => fetchGiaiDau());

watch([() => filters.value.muaGiai, () => filters.value.match, () => timeRange.value], () => {
    if (filters.value.muaGiai) fetchStats();
});
</script>

<style scoped>
.text-header {
    color: #8B2C31;
    font-weight: 700;
}

.clean-select {
    border-radius: 6px;
}

.filter-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-canvas {
    height: 380px !important;
}

.max-w-600 {
    max-width: 600px;
}

.text-nowrap {
    white-space: nowrap;
}
</style>