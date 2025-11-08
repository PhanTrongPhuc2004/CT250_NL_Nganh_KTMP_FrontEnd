<!-- src/pages/admin/ticketRevenue/TicketRevenueStats.vue -->
<template>
    <div class="container py-4 admin-stats-page">
        <h1 class="mb-4 text-header text-center">Thống kê Doanh thu Vé</h1>

        <div class="filter-card mb-4 p-3">
            <div class="row g-3">
                <div class="col-md-3">
                    <label class="form-label text-danger fw-bold">Giải đấu</label>
                    <select class="form-select form-select-sm clean-select" v-model="filters.giaiDau"
                        @change="onGiaiDauChange">
                        <option value="" disabled>Chọn giải đấu</option>
                        <option v-for="gd in giaiDauList" :key="gd._id" :value="gd.maGiaiDau">
                            {{ gd.tenGiaiDau }}
                        </option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label text-danger fw-bold">Mùa giải</label>
                    <select class="form-select form-select-sm clean-select" v-model="filters.muaGiai"
                        @change="onMuaGiaiChange" :disabled="!filters.giaiDau">
                        <option value="" disabled>Chọn mùa giải</option>
                        <option v-for="mg in muaGiaiList" :key="mg._id" :value="mg.maMuaGiai">
                            {{ mg.tenMuaGiai }}
                        </option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label text-danger fw-bold">Trận đấu</label>
                    <select class="form-select form-select-sm clean-select" v-model="filters.match" @change="fetchStats"
                        :disabled="!filters.muaGiai">
                        <option value="" disabled>Chọn trận đấu</option>
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

        <!-- Kết quả -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>

        <div v-else-if="error" class="alert alert-warning text-center py-4">
            <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
            <p class="mt-3 mb-0 fw-semibold">Backend chưa hỗ trợ thống kê vé</p>
            <small class="text-muted">Vui lòng liên hệ developer để triển khai API /ve/thongke</small>
        </div>

        <div v-else-if="!hasData" class="text-center py-5 text-muted">
            <i class="bi bi-bar-chart-line fs-1"></i>
            <p class="mt-3">Chưa có dữ liệu thống kê</p>
        </div>

        <div v-else>
            <!-- Biểu đồ -->
            <section class="general-stats card p-4 mb-5 shadow-sm bg-light">
                <h2 class="text-secondary mb-3">Doanh thu theo thời gian</h2>
                <canvas id="lineChart" class="chart-canvas"></canvas>
            </section>

            <section class="product-stats card p-4 shadow-sm bg-light">
                <h2 class="text-secondary mb-3">Thống kê theo loại vé</h2>
                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <div class="card p-3 h-100 shadow-sm">
                            <h3 class="h5 text-center mb-3">Doanh thu</h3>
                            <canvas id="barChart" class="chart-canvas"></canvas>
                        </div>
                    </div>
                    <div class="col-lg-6 mb-4">
                        <div class="card p-3 h-100 shadow-sm">
                            <h3 class="h5 text-center mb-3">Số lượng vé bán</h3>
                            <canvas id="pieChart" class="chart-canvas"></canvas>
                        </div>
                    </div>
                </div>
            </section>

            <section class="top-matches card p-4 shadow-sm bg-light" v-if="!filters.match && topMatches.length">
                <h2 class="text-secondary mb-3">Top 5 trận đấu doanh thu cao</h2>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Trận đấu</th>
                                <th>Loại vé</th>
                                <th>Vé bán</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in topMatches" :key="i">
                                <td>{{ i + 1 }}</td>
                                <td>{{ item.tranDau }}</td>
                                <td><span :class="getLoaiVeBadge(item.loaiVe)">{{ formatLoaiVe(item.loaiVe) }}</span>
                                </td>
                                <td>{{ item.soVe }}</td>
                                <td class="text-success fw-bold">{{ formatCurrency(item.doanhThu) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue"; // THÊM nextTick
import axios from "@/utils/axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// --- DỮ LIỆU
const giaiDauList = ref([]);
const muaGiaiList = ref([]);
const tranDauList = ref([]);
const filters = ref({ giaiDau: "", muaGiai: "", match: "" });
const timeRange = ref("all");

// --- TRẠNG THÁI
const isLoading = ref(false);
const error = ref(false);
const hasData = ref(false);

// --- CHART
let lineChart = null, barChart = null, pieChart = null;
const topMatches = ref([]);

// --- API
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
        console.error(err);
    }
};

const fetchTranDau = async () => {
    if (!filters.value.muaGiai) return;
    try {
        const res = await axios.get(`/trandau?maMuaGiai=${filters.value.muaGiai}`);
        tranDauList.value = res.data;
    } catch (err) {
        console.error(err);
    }
};

// --- GỌI THỐNG KÊ (AN TOÀN)
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
        const data = res.data;

        if (data && (data.timeSeries?.length || data.byLoaiVe?.length)) {
            // ĐỢI DOM CẬP NHẬT HOÀN TOÀN TRƯỚC KHI VẼ CHART
            await nextTick();
            updateCharts(data);
            hasData.value = true;
            if (!filters.value.match) fetchTopMatches();
        } else {
            hasData.value = false;
        }
    } catch (err) {
        if (err.response?.status === 404) {
            error.value = true;
        } else {
            console.error("Lỗi thống kê:", err);
            hasData.value = false;
        }
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

// --- CẬP NHẬT CHART – ĐÃ KIỂM TRA DOM
const updateCharts = (data) => {
    const { timeSeries = [], byLoaiVe = [] } = data;

    // KIỂM TRA TỒN TẠI CÁC CANVAS
    const lineCanvas = document.getElementById("lineChart");
    const barCanvas = document.getElementById("barChart");
    const pieCanvas = document.getElementById("pieChart");

    if (!lineCanvas || !barCanvas || !pieCanvas) {
        console.warn("Canvas chưa sẵn sàng, bỏ qua vẽ chart");
        return;
    }

    // Line Chart
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(lineCanvas.getContext("2d"), {
        type: "line",
        data: {
            labels: timeSeries.map(d => d.label || "N/A"),
            datasets: [{
                label: "Doanh thu (₫)",
                data: timeSeries.map(d => d.value || 0),
                borderColor: "#E02128",
                backgroundColor: "rgba(224, 33, 40, 0.1)",
                tension: 0.3,
                fill: true
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // Bar Chart
    if (barChart) barChart.destroy();
    barChart = new Chart(barCanvas.getContext("2d"), {
        type: "bar",
        data: {
            labels: byLoaiVe.map(d => formatLoaiVe(d.loaiVe)),
            datasets: [{
                label: "Doanh thu (₫)",
                data: byLoaiVe.map(d => d.doanhThu || 0),
                backgroundColor: "rgba(139, 44, 49, 0.7)"
            }]
        },
        options: { responsive: true }
    });

    // Pie Chart
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
            labels: byLoaiVe.map(d => formatLoaiVe(d.loaiVe)),
            datasets: [{
                data: byLoaiVe.map(d => d.soVe || 0),
                backgroundColor: ["#E02128", "#8B2C31", "#F8D7DA"]
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'right' } } }
    });
};

// --- XỬ LÝ LỌC
const onGiaiDauChange = () => {
    filters.value.muaGiai = filters.value.match = "";
    muaGiaiList.value = [];
    fetchMuaGiai();
};

const onMuaGiaiChange = () => {
    filters.value.match = "";
    tranDauList.value = [];
    fetchTranDau();
};

// --- HỖ TRỢ
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
const formatCurrency = (v) => v ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v) : '0 ₫';
const formatLoaiVe = (v) => v === 'Thuong' ? 'Thường' : v === 'KhuyenMai' ? 'Khuyến mãi' : v;
const getLoaiVeBadge = (v) => v === 'VIP' ? 'badge bg-danger text-white' : v === 'Thuong' ? 'badge bg-primary text-white' : 'badge bg-warning text-dark';

// --- LIFECYCLE
onMounted(() => {
    fetchGiaiDau();
});

watch(() => [filters.value.giaiDau, filters.value.muaGiai, filters.value.match, timeRange.value], () => {
    if (filters.value.giaiDau || timeRange.value !== "all") fetchStats();
});
</script>

<style scoped>
.text-header {
    color: #8B2C31;
    font-weight: 700;
}

/* TẮT VIỀN ĐỎ NỔI BẬT */
.clean-select {
    border: 1px solid #ced4da !important;
    background-color: white;
    color: #495057;
    border-radius: 6px;
}

.clean-select:focus {
    border-color: #8B2C31 !important;
    box-shadow: 0 0 0 0.2rem rgba(139, 44, 49, 0.15) !important;
}

.filter-card {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-card:hover {
    box-shadow: 0 4px 16px rgba(139, 44, 49, 0.1);
}

.chart-canvas {
    height: 380px !important;
}
</style>