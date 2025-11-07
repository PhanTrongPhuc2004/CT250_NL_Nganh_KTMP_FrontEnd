<template>
  <div class="container admin-stats-page my-4">
    <h1 class="mb-4 text-primary text-center">Dashboard Thống kê Doanh thu Quà Lưu Niệm</h1>

    <!-- Tổng thể -->
    <section class="general-stats card p-4 mb-5 shadow-sm bg-light">
      <h2 class="text-secondary mb-3">Thống kê tổng thể</h2>
      <div class="row mb-3 align-items-center">
        <div class="col-md-3">
          <label class="form-label fw-bold">Chọn khoảng thời gian:</label>
        </div>
        <div class="col-md-3">
          <select v-model="generalOption" class="form-select">
            <option value="daily">Theo ngày</option>
            <option value="weekly">Theo tuần</option>
            <option value="monthly">Theo tháng</option>
          </select>
        </div>
      </div>
      <canvas id="generalChart" class="chart-canvas"></canvas>
    </section>

    <!-- Theo sản phẩm -->
    <section class="product-stats card p-4 shadow-sm bg-light">
      <h2 class="text-secondary mb-3">Thống kê theo sản phẩm</h2>
      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="card p-3 h-100 shadow-sm">
            <h3 class="h5 text-center mb-3">Biểu đồ cột - Doanh thu</h3>
            <canvas id="barChart" class="chart-canvas"></canvas>
          </div>
        </div>
        <div class="col-lg-6 mb-4">
          <div class="card p-3 h-100 shadow-sm">
            <h3 class="h5 text-center mb-3">Biểu đồ tròn - Số lượng bán</h3>
            <canvas id="pieChart" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "AdminStats",
  data() {
    return {
      generalOption: "daily",
      generalChart: null,
      barChart: null,
      pieChart: null,
    };
  },
  methods: {
    // Tổng thể
    async fetchGeneralStats() {
      try {
        const res = await axios.get(
          `http://localhost:5000/donhang/thongke?option=${this.generalOption}`
        );
        const labels = res.data.map(d => d.label);
        const values = res.data.map(d => d.value);

        if (this.generalChart) this.generalChart.destroy();
        const ctx = document.getElementById("generalChart").getContext("2d");
        this.generalChart = new Chart(ctx, {
          type: "bar",
          data: { labels, datasets: [{ label: "Doanh thu (₫)", data: values, backgroundColor: "rgba(54, 162, 235, 0.6)" }] },
          options: {
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
            scales: { y: { beginAtZero: true } }
          }
        });
      } catch (err) {
        console.error("Lỗi tải thống kê tổng thể:", err);
      }
    },

    // Theo sản phẩm
    async fetchProductStats() {
      try {
        const res = await axios.get("http://localhost:5000/donhang/thongke/sanpham");
        const labels = res.data.map(d => d.product);
        const revenueData = res.data.map(d => d.revenue);
        const quantityData = res.data.map(d => d.quantity);

        // Biểu đồ cột
        if (this.barChart) this.barChart.destroy();
        const ctxBar = document.getElementById("barChart").getContext("2d");
        this.barChart = new Chart(ctxBar, {
          type: "bar",
          data: { labels, datasets: [{ label: "Doanh thu (₫)", data: revenueData, backgroundColor: "rgba(54, 162, 235, 0.7)" }] },
          options: { responsive: true, plugins: { tooltip: { mode: 'index', intersect: false } } }
        });

        // Biểu đồ tròn
        if (this.pieChart) this.pieChart.destroy();
        const ctxPie = document.getElementById("pieChart").getContext("2d");
        this.pieChart = new Chart(ctxPie, {
          type: "pie",
          data: { labels, datasets: [{ label: "Số lượng bán", data: quantityData, backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#8BC34A","#FF9800","#9C27B0","#00BCD4","#E91E63"] }] },
          options: { responsive: true, plugins: { legend: { position: 'right' }, tooltip: { mode: 'nearest' } } }
        });
      } catch (err) {
        console.error("Lỗi tải thống kê sản phẩm:", err);
      }
    },
  },
  watch: {
    generalOption() { this.fetchGeneralStats(); },
  },
  mounted() {
    this.fetchGeneralStats();
    this.fetchProductStats();
  },
};
</script>

<style>
/* Bootstrap + custom */
.admin-stats-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chart-canvas {
  width: 100%;
  height: 400px;
}

/* Card shadow & spacing */
.card {
  border-radius: 10px;
}

.card h2, .card h3 {
  color: #444;
}

@media (max-width: 992px) {
  .charts .col-lg-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
