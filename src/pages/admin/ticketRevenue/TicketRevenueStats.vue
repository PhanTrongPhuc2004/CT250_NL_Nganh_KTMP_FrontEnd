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
                        <option value="">Chọn trận đấu</option>
                        <option v-for="td in tranDauList" :key="td._id" :value="td.maTranDau">
                            {{ td.doiNha }} vs {{ td.doiKhach }} - {{ formatDate(td.ngayBatDau) }}
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

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-3 text-muted">Đang tải dữ liệu thống kê...</p>
        </div>

        <!-- Lỗi server -->
        <div v-else-if="error" class="text-center py-5">
            <div class="alert alert-danger d-inline-block p-4">
                <i class="bi bi-exclamation-triangle-fill fs-1"></i>
                <p class="mt-3 mb-0 fw-bold">Lỗi kết nối server</p>
                <small>Vui lòng thử lại sau</small>
            </div>
        </div>

        <!-- Không có dữ liệu -->
        <div v-else-if="!hasData" class="text-center py-5">
            <div class="bg-light rounded-4 p-5 shadow-sm max-w-600 mx-auto">
                <i class="bi bi-bar-chart-line text-muted fs-1 mb-4"></i>
                <h4 class="text-muted mb-3">Chưa có dữ liệu vé nào được bán</h4>
                <p class="text-muted">
                    Hiện tại chưa có vé nào được thanh toán thành công.<br>
                    Vui lòng chọn giải đấu, mùa giải khác hoặc chờ thêm dữ liệu bán vé.
                </p>
                <button @click="fetchStats" class="btn btn-outline-danger btn-sm mt-3">
                    <i class="bi bi-arrow-clockwise"></i> Tải lại dữ liệu
                </button>
            </div>
        </div>

        <!-- Có dữ liệu → HIỆN BIỂU ĐỒ -->
        <div v-else>
            <!-- Biểu đồ doanh thu theo thời gian -->
            <section class="general-stats card p-4 mb-5 shadow-sm bg-light">
                <h2 class="text-secondary mb-3">Doanh thu theo thời gian (từ 01/11/2025)</h2>
                <canvas ref="lineChartRef" class="chart-canvas"></canvas>
            </section>

            <!-- Thống kê loại vé -->
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

            <!-- Top 5 trận đấu -->
            <section v-if="!filters.match && topMatches.length" class="top-matches card p-4 shadow-sm bg-light">
                <h2 class="text-secondary mb-3">Top 5 trận đấu doanh thu cao nhất</h2>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th width="60">#</th>
                                <th>Trận đấu</th>
                                <th>Loại vé</th>
                                <th class="text-center">Số vé</th>
                                <th class="text-end">Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in topMatches" :key="i">
                                <td class="fw-bold">{{ i + 1 }}</td>
                                <td class="fw-semibold">{{ item.tranDau }}</td>
                                <td>
                                    <span :class="getLoaiVeBadge(item.loaiVe)" class="px-2 py-1 rounded">
                                        {{ formatLoaiVe(item.loaiVe) }}
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
import { ref, onMounted, watch, nextTick } from "vue";
import axios from "@/utils/axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// Canvas refs
const lineChartRef = ref(null);
const barChartRef = ref(null);
const pieChartRef = ref(null);

let lineChart = null;
let barChart = null;
let pieChart = null;

// Dữ liệu
const giaiDauList = ref([]);
const muaGiaiList = ref([]);
const tranDauList = ref([]);
const filters = ref({ giaiDau: "", muaGiai: "", match: "" });
const timeRange = ref("all");

const isLoading = ref(false);
const error = ref(false);
const hasData = ref(false);
const topMatches = ref([]);

// === API CALLS ===
const fetchGiaiDau = async () => {
    try {
        const res = await axios.get("/giaidau");
        giaiDauList.value = res.data;
    } catch (err) {
        console.error("Lỗi tải giải đấu:", err);
    }
};

const fetchMuaGiai = async () => {
    if (!filters.value.giaiDau) return;
    try {
        const res = await axios.get(`/muagiai?maGiaiDau=${filters.value.giaiDau}`);
        muaGiaiList.value = res.data;
    } catch (err) {
        console.error("Lỗi tải mùa giải:", err);
    }
};

const fetchTranDau = async () => {
    if (!filters.value.muaGiai) return;
    tranDauList.value = [];
    filters.value.match = "";
    await nextTick();
    try {
        const res = await axios.get(`/muagiai/ma/${filters.value.muaGiai}/trandau`);
        tranDauList.value = res.data;
    } catch (err) {
        console.error("Lỗi lấy trận đấu:", err);
    }
};

// === THỐNG KÊ ===
const fetchStats = async () => {
    isLoading.value = true;
    error.value = false;
    hasData.value = false;

    const params = new URLSearchParams();
    if (filters.value.match) params.append("maTranDau", filters.value.match);
    if (filters.value.muaGiai) params.append("maMuaGiai", filters.value.muaGiai);
    if (filters.value.giaiDau) params.append("maGiaiDau", filters.value.giaiDau);
    if (timeRange.value !== "all") params.append("range", timeRange.value);

    try {
        const res = await axios.get(`/ve/thongke?${params.toString()}`);
        const data = res.data || {};

        const hasTimeData = data.timeSeries?.some(d => (d.value || 0) > 0);
        const hasTypeData = data.byLoaiVe?.some(t => (t.doanhThu || 0) > 0 || (t.soVe || 0) > 0);

        if (hasTimeData || hasTypeData) {
            await nextTick();
            updateCharts(data);
            hasData.value = true;
            if (!filters.value.match) fetchTopMatches();
        }
    } catch (err) {
        if (err.response?.status !== 404) error.value = true;
    } finally {
        isLoading.value = false;
    }
};

const fetchTopMatches = async () => {
    try {
        const res = await axios.get("/ve/thongke/top");
        topMatches.value = res.data || [];
    } catch (err) {
        topMatches.value = [];
    }
};

// === VẼ BIỂU ĐỒ ===
const updateCharts = async (data) => {
    await nextTick();
    if (!lineChartRef.value || !barChartRef.value || !pieChartRef.value) {
        setTimeout(() => updateCharts(data), 100);
        return;
    }

    const { timeSeries = [], byLoaiVe = [] } = data;

    // Từ 01/11/2025
    const startDate = new Date("2025-11-01");
    const today = new Date();
    const labels = [];
    const values = [];
    const dateMap = new Map(timeSeries.map(d => [d.date || d.label, d.value || 0]));

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toLocaleDateString("vi-VN");
        labels.push(dateStr);
        values.push(dateMap.get(dateStr) || 0);
    }

    // Line Chart
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(lineChartRef.value, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Doanh thu",
                data: values,
                borderColor: "#E02128",
                backgroundColor: "rgba(224,33,40,0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { ticks: { maxTicksLimit: 12 } } }
        }
    });

    // Bar Chart
    if (barChart) barChart.destroy();
    barChart = new Chart(barChartRef.value, {
        type: "bar",
        data: {
            labels: byLoaiVe.map(d => formatLoaiVe(d.loaiVe)),
            datasets: [{
                label: "Doanh thu",
                data: byLoaiVe.map(d => d.doanhThu || 0),
                backgroundColor: "rgba(139,44,49,0.8)"
            }]
        },
        options: { responsive: true }
    });

    // Pie Chart
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieChartRef.value, {
        type: "doughnut",
        data: {
            labels: byLoaiVe.map(d => formatLoaiVe(d.loaiVe)),
            datasets: [{
                data: byLoaiVe.map(d => d.soVe || 0),
                backgroundColor: ["#E02128", "#8B2C31", "#F8D7DA", "#6C757D"]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'right' } }
        }
    });
};

// === XỬ LÝ LỌC ===
const onGiaiDauChange = async () => {
    filters.value.muaGiai = "";
    filters.value.match = "";
    muaGiaiList.value = [];
    tranDauList.value = [];
    await nextTick();
    fetchMuaGiai();
};

const onMuaGiaiChange = async () => {
    filters.value.match = "";
    tranDauList.value = [];
    await nextTick();
    fetchTranDau();
    // Chỉ gọi fetchStats khi có mùa giải → hợp lý
    fetchStats();
};

// === HỖ TRỢ ===
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
const formatCurrency = (v) => v ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v) : '0 ₫';
const formatLoaiVe = (v) => v === 'Thuong' ? 'Thường' : v === 'KhuyenMai' ? 'Khuyến mãi' : v;
const getLoaiVeBadge = (v) => {
    if (v === 'VIP') return 'bg-danger text-white';
    if (v === 'Thuong') return 'bg-primary text-white';
    return 'bg-warning text-dark';
};

// === LIFECYCLE ===
onMounted(() => {
    fetchGiaiDau();
});

// CHỈ GỌI THỐNG KÊ KHI CÓ MÙA GIẢI HOẶC TRẬN ĐẤU → HOÀN HẢO!
watch(
    [() => filters.value.muaGiai, () => filters.value.match, () => timeRange.value],
    () => {
        if (filters.value.muaGiai || filters.value.match) {
            fetchStats();
        }
    },
    { immediate: false }
);
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
</style>