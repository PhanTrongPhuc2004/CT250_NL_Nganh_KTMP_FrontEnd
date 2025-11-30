<template>
  <div class="shop-page">
    <div class="shop-container">
      <!-- Header -->
      <div class="shop-header">
          <h1 class="shop-title">
            <i class="bi bi-gift me-2"></i> Cửa hàng Quà Lưu Niệm
          </h1>
          
        <div>
          <!-- NEW: Nút Voucher -->
          <button class="btn btn-warning me-2" @click="toggleVoucher">
            <i class="bi bi-ticket-detailed me-1"></i> Voucher
          </button>
          <button class="btn btn-outline-primary me-2" @click="$router.push('/orders')">
            <i class="bi bi-box-seam-fill me-2"></i> Đơn hàng
          </button>

          <button class="btn btn-primary position-relative" @click="$router.push('/cart')">
            <i class="bi bi-cart-fill me-1"></i> Giỏ hàng
          </button>
          
        </div>
      </div>
        <!-- NEW: Form voucher đổ xuống -->
        <div v-if="showVoucher" class="voucher-box card shadow-sm p-3 mb-4 animate__animated animate__fadeInDown">
          <h5 class="text-primary mb-3">
            <i class="bi bi-ticket-perforated-fill me-1"></i> Chọn Voucher
          </h5>

          <div class="voucher-item" v-for="v in vouchers" :key="v.code">
            <div class="d-flex justify-content-between align-items-center p-3 voucher-row">
              <div>
                <strong>{{ v.label }}</strong>
                <p class="text-muted small mb-0">
                  Đơn tối thiểu: {{ v.min.toLocaleString() }} VND
                </p>
                <!-- Hiệu lực voucher -->
              <div class="voucher-valid">
                {{ v.validText }}
              </div>
              </div>

           
              <!-- NÚT NHẬN / SỬ DỤNG -->
              <button
                class="btn"
                :class="selectedVouchers.includes(v.code) ? 'btn-use' : 'btn-redeem'"
                @click="toggleVoucherSelect(v)"
              >
                {{ selectedVouchers.includes(v.code) ? "Sử dụng" : "Nhận" }}
              </button>


            </div>
          </div>
        </div>

      <!-- Bộ lọc -->
      <div class="filter-bar card shadow-sm p-3 mb-4">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search text-secondary"></i>
              </span>
              <input
                v-model="searchText"
                type="text"
                class="form-control border-start-0"
                placeholder="Tìm theo tên quà lưu niệm..."
              />
            </div>
          </div>

          <div class="col-md-4">
            <select v-model="priceRange" class="form-select">
              <option value=""><i class="bi bi-cash-coin"></i> Tất cả mức giá</option>
              <option value="low">Dưới 100.000 VND</option>
              <option value="mid">100.000 VND - 300.000 VND</option>
              <option value="high">Trên 300.000 VND</option>
            </select>
          </div>

          <div class="col-md-2 text-end">
            <select v-model="sortBy" class="form-select">
              <option value="">Sắp xếp</option>
              <option value="star">Số sao cao nhất</option>
              <option value="sold">Lượt bán cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Nội dung -->
      <div v-if="loading" class="loading text-center mt-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">⏳ Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="error" class="error text-danger text-center">
        {{ error }}
      </div>

      <div v-else class="product-grid">
        <div
          v-for="(item, index) in filteredProducts"
          :key="index"
          class="product-card"
          @click="goToDetail(item._id)"
        >
          <img
            :src="getImageUrl(item.anhMinhHoa)"
            alt="Ảnh quà"
            class="product-image"
          />

          <h3 class="product-name">{{ item.tenQuaLuuNiem }}</h3>

          <!-- Giá / Giá giảm -->
          <p class="product-price">
            <span
              v-if="item.giaGiam && item.giaGiam > 0"
              class="text-danger fw-bold"
            >
              {{ item.gia.toLocaleString() }} VND
            </span>
            <span v-if="item.giaGiam && item.giaGiam > 0" 
              class="text-muted text-decoration-line-through ms-2"
              >
              {{ item.giaGiam.toLocaleString() }} VND
            </span>



            <span v-else class="fw-bold text-danger">
              {{ item.gia.toLocaleString() }} VND
            </span>
          </p>

          <!-- Rating -->
          <div class="product-rating">
            <i
              v-for="star in 5"
              :key="star"
              class="bi"
              :class="
                star <= Math.round(item.soSaoTrungBinh || 0)
                  ? 'bi-star-fill text-warning'
                  : 'bi-star text-secondary'
              "
            ></i>

            <span class="rating-count ms-1">
              ({{ item.luotDanhGia || 0 }} đánh giá)
            </span>
          </div>

          <!-- Lượt bán -->
          <p class="sold-count text-secondary small">
            🔥 Đã bán: {{ item.luotBan || 0 }}
          </p>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

export default {
  name: "Shop",
  data() {
    return {
      products: [],
      searchText: "",
      priceRange: "",
      loading: true,
      error: null,
      showVoucher: false,
      selectedVouchers: [],
      vouchers: [
        { code: "VOUCHER30K", label: "Giảm 30.000 VND", min: 250000, validText: "Hết hạn sau 1 giờ"},
        { code: "VOUCHER50K", label: "Giảm 50.000 VND", min: 500000, validText: "Hết hạn sau 6 giờ" },
        { code: "VOUCHER100K", label: "Giảm 15%", min: 1000000 , validText: "Áp dụng từ 12/01/2025 - 12/15/2025"},
      ],
      sortBy: "",

    };
  },
  computed: {
    filteredProducts() {
      // 1️⃣ Lọc
      let list = this.products.filter((item) => {
        const matchName = item.tenQuaLuuNiem
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

        const matchPrice =
          this.priceRange === "low"
            ? item.gia < 100000
            : this.priceRange === "mid"
            ? item.gia >= 100000 && item.gia <= 300000
            : this.priceRange === "high"
            ? item.gia > 300000
            : true;

        return matchName && matchPrice;
      });

      //Sắp xếp
      if (this.sortBy === "star") {
        list.sort((a, b) => (b.soSaoTrungBinh || 0) - (a.soSaoTrungBinh || 0));
      } else if (this.sortBy === "sold") {
        list.sort((a, b) => (b.luotBan || 0) - (a.luotBan || 0));
      }

      // Trả về danh sách đã lọc + sắp xếp
      return list;
    },

  },
  methods: {
      toggleVoucher() {
        this.showVoucher = !this.showVoucher;
      },

      toggleVoucherSelect(v) {
        const index = this.selectedVouchers.indexOf(v.code);

        if (index === -1) {
          this.selectedVouchers.push(v.code);
          alert(`🎉 Bạn đã nhận voucher: ${v.label}`);
        } else {
          this.useVoucher(v);
        }
      },

      useVoucher(v) {
        alert(`✅ Bạn đang sử dụng voucher: ${v.label}`);
      },
      async fetchProducts() {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BE_BASE_URL}/qualuuniem`
          );
          this.products = res.data;
        } catch (err) {
          this.error = "Không thể tải danh sách quà lưu niệm.";
          console.error(err);
        } finally {
          this.loading = false;
        }
      }
,
    getImageUrl(path) {
      if (!path) return "https://via.placeholder.com/200x180?text=No+Image";
      if (path.startsWith("http") || path.startsWith("data:image")) return path;
      return `/${path}`;
    },
    goToDetail(id) {
      this.$router.push(`/shop/${id}`);
    },
    resetFilters() {
      this.searchText = "";
      this.priceRange = "";
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.sold-count {
  font-size: 0.85rem;
}
.text-decoration-line-through {
  opacity: 0.6;
}

.shop-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #dfe9f3, #ffffff);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
}

.shop-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 40px;
  width: 95%;
  max-width: 1300px;
  color: #333;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.3rem;
  font-weight: bold;
  color: #8B2C31;
  display: flex;
  align-items: center;
}

/* Bộ lọc */
.filter-bar {
  background: #f8f9fa;
  border-radius: 12px;
  transition: box-shadow 0.3s ease;
}
.filter-bar:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}

/* Lưới sản phẩm */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 25px;
}

/* Thẻ sản phẩm */
.product-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: 0.3s ease;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #08175a;
}

.product-category {
  font-size: 0.9rem;
  color: #555;
}

.product-price {
  font-size: 1.1rem;
  color: #a01616;
  font-weight: bold;
}
/* Nền form */
.voucher-box {
  background: #ffe6f2; /* hồng cánh sen */
  border-radius: 14px;
  border: 1px solid #ffb3d9;
}

/* Hàng từng voucher */
.voucher-row {
  background: #fff0f6;
  border-radius: 12px;
  border: 1px solid #ffcce6;
  transition: 0.2s;
}

.voucher-row:hover {
  background: #ffe0ef;
}

/* Nút Nhận */
.btn-redeem {
  background: #d62828;       /* Đỏ đậm */
  color: white;
  border-radius: 8px;
  font-weight: 600;
  padding: 6px 14px;
  transition: 0.2s;
  border: none;
}

.btn-redeem:hover {
  background: #b71c1c;        /* Đỏ tối */
  transform: scale(1.05);
}

.btn-redeem {
  background: #d62828;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  padding: 6px 14px;
  border: none;
  transition: 0.2s;
}

.btn-redeem:hover {
  background: #b71c1c;
  transform: scale(1.05);
}

.btn-use {
  background: white; /* xanh */
  color: red;
  border-radius: 8px;
  font-weight: 600;
  padding: 6px 14px;
  border: none;
}

.btn-use:hover {
  background: wheat;
  transform: scale(1.05);
}
.voucher-valid {
  font-size: 13px;
  color: #cc3366; /* hồng cánh sen đậm */
  margin-top: 3px;
}


</style>
