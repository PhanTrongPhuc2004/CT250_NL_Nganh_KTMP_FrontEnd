<template> 
  <div class="container admin-stats-page my-4">
    <h1 class="mb-4 text-center main-title">
      <i class="bi bi-graph-up-arrow me-2"></i> Dashboard Thống kê Doanh thu Quà Lưu Niệm
    </h1>

    <!-- Tổng thể -->
    <section class="general-stats card p-4 mb-5 shadow-sm bg-light">
      <h2 class="section-title mb-3">Thống kê tổng thể</h2>
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
      <h2 class="section-title mb-3">Thống kê theo sản phẩm</h2>

      <!-- Biểu đồ cột ngang -->
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10 mb-4">
          <div class="card p-3 shadow-sm">
            <h3 class="h5 text-center mb-3">Biểu đồ cột ngang - Doanh thu</h3>
            <canvas id="barChart" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Biểu đồ tròn -->
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card p-3 shadow-sm">
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
          data: {
            labels,
            datasets: [{
              label: "Doanh thu (₫)",
              data: values,
              backgroundColor: "rgba(139, 44, 49, 0.6)"
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        });
      } catch (err) {
        console.error("Lỗi tải thống kê tổng thể:", err);
      }
    },

    async fetchProductStats() {
      try {
        const res = await axios.get("http://localhost:5000/donhang/thongke/sanpham");
        const labels = res.data.map(d => d.product);
        const revenueData = res.data.map(d => d.revenue);
        const quantityData = res.data.map(d => d.quantity);

        // 💡 Biểu đồ cột NGANG
        if (this.barChart) this.barChart.destroy();
        const ctxBar = document.getElementById("barChart").getContext("2d");
        this.barChart = new Chart(ctxBar, {
          type: "bar",
          data: {
            labels,
            datasets: [{
              label: "Doanh thu (₫)",
              data: revenueData,
              backgroundColor: "rgba(139, 44, 49, 0.7)"
            }]
          },
          options: {
            indexAxis: 'y', // 👉 xoay ngang
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
          }
        });

        // 🎨 Biểu đồ tròn - màu pastel tinh tế
        if (this.pieChart) this.pieChart.destroy();
        const ctxPie = document.getElementById("pieChart").getContext("2d");
        this.pieChart = new Chart(ctxPie, {
          type: "pie",
          data: {
            labels,
            datasets: [{
              label: "Số lượng bán",
              data: quantityData,
              backgroundColor: [
                "#FF595E", // đỏ cam
                "#FFCA3A", // vàng
                "#8AC926", // xanh lá
                "#1982C4", // xanh dương
                "#6A4C93", // tím
                "#FF924C", // cam sáng
                "#FF66D8" , // hồng tím
                "#4A2C2A", // Nâu đậm
                "#735D78", // Tím khói
                "#1A1A1A", // Đen than
                "#3E6259", // Xanh rêu đậm
                "#2F3E46", // Xanh đá
                "#354F52", // Xanh than
                "#52796F", // Xanh lam đậm
                "#84A98C"  // Xanh bạc nhẹ
              ],
              borderWidth: 1,
              borderColor: "#fff"
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom', labels: { color: '#444', font: { size: 13 } } },
              tooltip: { backgroundColor: "#fff", titleColor: "#8B2C31", bodyColor: "#333" }
            }
          }
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
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css";

.admin-stats-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-title {
  color: #8B2C31;
  font-weight: 700;
}

.section-title {
  color: #8B2C31;
  font-weight: 600;
}

.chart-canvas {
  width: 100%;
  height: 400px;
}

.card {
  border-radius: 10px;
}

@media (max-width: 992px) {
  .charts .col-lg-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
