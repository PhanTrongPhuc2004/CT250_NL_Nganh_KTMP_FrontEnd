<template>
  <div class="orders-page">
    <h1 class="orders-title mb-4">
      <i class="bi bi-box-seam-fill me-2"></i> Đơn hàng của bạn
    </h1>

    <div v-if="loading" class="loading">⏳ Đang tải dữ liệu...</div>

    <div v-else-if="orders.length" class="orders-grid">
      <div
        v-for="order in orders"
        :key="order._id"
        class="order-card mb-4 p-3 border rounded"
        :class="{
          'confirmed-card': order.status === 'Đã xác nhận',
          'waiting-card': order.status === 'Chờ xác nhận'
        }"
      >
        <!-- Thông tin đơn hàng -->
        <div class="invoice-header text-center mb-3">
          <h3 class="text-primary fw-bold">THÔNG TIN ĐƠN HÀNG</h3>
          <p class="text-muted">Mã đơn hàng: <b>DH{{ order._id.slice(-10).toUpperCase() }}</b></p>
        </div>

        <div class="invoice-info mb-3">
          <p><b>Người nhận:</b> {{ order.name }}</p>
          <p><b>SĐT:</b> {{ order.phone }}</p>
          <p><b>Địa chỉ:</b> {{ order.address }}</p>
          <p><b>Ngày đặt:</b> {{ formatDate(order.date || order.createdAt) }}</p>
        </div>

        <!-- Danh sách sản phẩm -->
        <div class="product-list mt-3">
          <div 
            v-for="item in order.cart" 
            :key="item._id || item.maSanPham"
            class="product-card mb-3 p-2 border rounded"
          >
            <img
              v-if="item.anhMinhHoa"
              :src="resolveImage(item.anhMinhHoa)"
              alt="Ảnh quà"
              class="product-img"
            />

            <div class="product-info">
              <h5>{{ item.tenQuaLuuNiem }}</h5>
              <p class="mb-1"><b>Giá:</b> {{ item.gia.toLocaleString() }} VND</p>
              <p class="mb-1"><b>Số lượng:</b> {{ item.soLuong }}</p>
              <p class="mb-1"><b>Thành tiền:</b> <span class="text-danger">{{ (item.gia * item.soLuong).toLocaleString() }} VND</span></p>

              <!-- Nút viết đánh giá -->
            <button
              v-if="order.status === 'Đã xác nhận'"
              class="btn btn-danger btn-sm mt-2 d-flex align-items-center gap-2"
              @click="toggleReviewForm(
                order._id, 
                item._id, 
                user.tenDangNhap || user.username
              )"
            >
              <i class="fa-solid fa-pen-to-square"></i>
              Viết đánh giá
            </button>

              <!-- Form viết bình luận -->
              <div
                v-if="isReviewActive(order._id, item._id || item.maSanPham)"
                class="review-form mt-3 p-3 border rounded shadow-sm bg-white"
              >

                <!-- Rating -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Đánh giá</label>
                  <select
                    class="form-select"
                    v-model.number="reviewForms[order._id][item._id || item.maSanPham].rating"
                    required
                  >
                    <option disabled value="">Chọn số sao</option>
                    <option v-for="n in 5" :key="n" :value="n">{{ n }} sao</option>
                  </select>
                </div>

                <!-- Nội dung -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Nội dung</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    placeholder="Nhập bình luận..."
                    required
                    v-model="reviewForms[order._id][item._id || item.maSanPham].content"
                  ></textarea>
                </div>

                <!-- Ảnh -->
                <div class="mb-3">
                  <label class="form-label fw-bold">Ảnh minh họa</label>

                  <div class="input-group">
                    <!-- <input
                      type="text"
                      class="form-control"
                      placeholder="Nhập URL ảnh..."
                      v-model="reviewForms[order._id][item._id || item.maSanPham].imageInput"
                    /> -->
                    <input
                    type="file"
                    class="form-control"
                    multiple
                    accept="image/*"
                    @change="handleFileUpload($event, order._id, item._id || item.maSanPham)"
                  />
<!-- 
                    <button
                      class="btn btn-outline-primary"
                      type="button"
                      @click="addReviewImage(order._id, item._id || item.maSanPham)"
                    >
                      Thêm ảnh
                    </button> -->
                  </div>

                  <!-- Preview ảnh đã thêm -->
                  <div
                    v-if="reviewForms[order._id][item._id || item.maSanPham].images.length"
                    class="mt-3"
                  >
                    <label class="fw-bold">Ảnh đã thêm:</label>

                    <div class="d-flex flex-wrap gap-3 mt-2">
                      <div
                        v-for="(img, index) in reviewForms[order._id][item._id || item.maSanPham].images"
                        :key="index"
                        class="position-relative"
                        style="width: 90px; height: 90px"
                      >
                        <img
                          :src="img"
                          class="rounded border"
                          style="width: 100%; height: 100%; object-fit: cover"
                        />

                        <button
                          class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-0 px-1"
                          @click="removeReviewImage(order._id, item._id || item.maSanPham, index)"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Submit -->
                <button
                  class="btn btn-success w-100 mt-2"
                  @click="submitReview(order._id, item._id || item.maSanPham)"
                >
                  Gửi bình luận
                </button>

                <!-- Thông báo -->
                <div
                  v-if="reviewForms[order._id][item._id || item.maSanPham].message"
                  class="alert alert-success mt-3 py-2"
                >
                  {{ reviewForms[order._id][item._id || item.maSanPham].message }}
                </div>
              </div>

            </div>
          </div>

          <p v-if="order.cart.length === 0" class="text-center text-muted">
            Chưa có sản phẩm
          </p>
        </div>

        <!-- Tổng tiền + voucher -->
        <div class="total-section d-flex flex-column align-items-start mt-3">
          <div>
            <b>Tổng ban đầu:</b>
            <span>{{ totalBeforeDiscount(order).toLocaleString() }} VND</span>
          </div>

          <div v-if="discount(order) > 0" class="text-success fw-bold">
            Giảm giá: -{{ discount(order).toLocaleString() }} VND
            <span>({{ appliedVoucherLabel(order) }})</span>
          </div>

          <div class="fs-5 fw-bold text-danger mt-1">
            Tổng thanh toán: {{ finalAmount(order).toLocaleString() }} VND
          </div>

          <!-- QR code -->
          <div class="mt-2">
            <img
              :src="generateQR(order, finalAmount(order))"
              alt="QR Code"
              class="qr-code"
              style="width:120px; height:80px;"
            />
          </div>
        </div>


        <!-- Trạng thái -->
        <div class="status-section mt-3">
          <b>Trạng thái:</b>
          <span
            class="badge"
            :class="order.status === 'Đã xác nhận' ? 'bg-success' : 'bg-warning text-dark'"
          >
            {{ order.status }}
          </span>
        </div>

        <!-- Nút xóa đơn hàng -->
        <div class="mt-3 text-end" v-if="order.status === 'Chờ xác nhận'">
          <button
            class="btn btn-danger btn-sm"
            @click="deleteOrder(order._id)"
          >
            <i class="bi bi-trash3 me-1"></i> Hủy đơn hàng
          </button>
        </div>

      </div>
    </div>

    <p v-else>Bạn chưa có đơn hàng nào.</p>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "OrdersPage",
  data() {
    const userStore = useUserStore();
    let user = userStore.user || JSON.parse(localStorage.getItem("user"));
    return {
      user,
      orders: [],
      loading: true,
      reviewForms: {}, // reactive object chứa tất cả form review
    };
  },

  async mounted() {
    const userStore = useUserStore();
    if (!userStore.user && userStore.checkAuth) {
      await userStore.checkAuth();
      this.user = userStore.user || JSON.parse(localStorage.getItem("user"));
    }
    await this.fetchOrders();
  },

  methods: {
    async fetchOrders() {
      const username = this.user?.tenDangNhap || this.user?.username;
      if (!username) {
        this.loading = false;
        alert("⚠️ Vui lòng đăng nhập để xem đơn hàng!");
        return;
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BE_BASE_URL}/donhang/${username}`
        );
        this.orders = res.data.map(order => {
          const cart = order.cart.map(item => ({
            ...item,
            soLuong: Number(item.soLuong ?? item.quantity ?? 1),
            gia: Number(item.gia ?? 0)
          }));
          const total = cart.reduce((sum, i) => sum + i.gia * i.soLuong, 0);
          return { ...order, cart, total };
        });
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
        alert("Không thể tải dữ liệu đơn hàng!");
      } finally {
        this.loading = false;
      }
    },
    handleFileUpload(event, orderId, productKey) {
  const files = event.target.files;

  if (!this.reviewForms[orderId][productKey].files) {
    this.reviewForms[orderId][productKey].files = [];
  }

  for (let f of files) {
    this.reviewForms[orderId][productKey].files.push(f);
  }

  // preview ảnh
  for (let file of files) {
    const url = URL.createObjectURL(file);
    this.reviewForms[orderId][productKey].images.push(url);
  }
},


    async deleteOrder(id) {
      if (confirm("Bạn có chắc muốn xóa hoàn toàn đơn hàng này?")) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BE_BASE_URL}/donhang/${id}`);
          alert("🗑️ Đơn hàng đã được xóa!");
          this.orders = this.orders.filter(order => order._id !== id);
        } catch (err) {
          console.error("❌ Lỗi khi xóa đơn hàng:", err);
          alert("Không thể xóa đơn hàng!");
        }
      }
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    },

    resolveImage(anh) {
      if (!anh) return "/default-player.jpg";
      if (anh.startsWith("http") || anh.startsWith("data:image")) return anh;
      return anh;
    },

    totalBeforeDiscount(order) {
      return order.cart.reduce((sum, item) => sum + item.gia * item.soLuong, 0);
    },

    discount(order) {
      const total = this.totalBeforeDiscount(order);
      if (total >= 1000_000) return Math.floor(total * 0.15); // 15%
      if (total >= 500_000) return 50000;                     // 50k
      if (total >= 250_000) return 30000;                     // 30k
      return 0;
    },

    finalAmount(order) {
      return this.totalBeforeDiscount(order) - this.discount(order);
    },

    appliedVoucherLabel(order) {
      const total = this.totalBeforeDiscount(order);
      if (total >= 1000_000) return "Giảm 15%";
      if (total >= 500_000) return "Giảm 50.000₫";
      if (total >= 250_000) return "Giảm 30.000₫";
      return "";
    },

    // QR code update để dùng tổng đã giảm
    generateQR(order, amount) {
      const data = encodeURIComponent(`
        Mã đơn: ${order._id}
        Người nhận: ${order.name}
        Tổng tiền: ${amount.toLocaleString()} VND
        Trạng thái: ${order.status}
        Sản phẩm: ${order.cart.map(i => `${i.tenQuaLuuNiem} x${i.soLuong}`).join(", ")}
      `);
      return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${data}`;
    },

    toggleReviewForm(orderId, productKey, userName) {
      if (!this.reviewForms[orderId]) {
        this.reviewForms = {
          ...this.reviewForms,
          [orderId]: {}
        };
      }

        if (!this.reviewForms[orderId][productKey]) {
          this.reviewForms[orderId] = {
            ...this.reviewForms[orderId],
            [productKey]: {
              active: true,
              productId: productKey,
              userName,
              rating: null,
              content: "",
              images: [],
              imageInput: "",
              message: "",
            }
          };
        } else {
          this.reviewForms[orderId][productKey] = {
            ...this.reviewForms[orderId][productKey],
            active: !this.reviewForms[orderId][productKey].active
          };
        }
      },

    isReviewActive(orderId, productKey) {
      return !!(
        this.reviewForms[orderId] &&
        this.reviewForms[orderId][productKey] &&
        this.reviewForms[orderId][productKey].active
      );
    },

    addReviewImage(orderId, productKey) {
      const form = this.reviewForms[orderId][productKey];
      if (form.imageInput.trim() !== "") {
        form.images.push(form.imageInput.trim());
        form.imageInput = "";
      }
    },

    removeReviewImage(orderId, productKey, index) {
      this.reviewForms[orderId][productKey].images.splice(index, 1);
    },

    async submitReview(orderId, productKey) {
      const form = this.reviewForms[orderId][productKey];
      const data = {
        productId: form.productId,
        userName: form.userName,
        rating: form.rating,
        content: form.content,
        images: form.images,
      };
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BE_BASE_URL}/binhluan`, data);
        form.message = res.data.message || "Gửi bình luận thành công!";
        form.rating = null;
        form.content = "";
        form.images = [];
      } catch (err) {
        form.message = err.response?.data?.message || "Lỗi gửi bình luận";
      }
    },
  },
};
</script>

<style scoped>
/* ===== Orders Page ===== */
.orders-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  font-family: "Poppins", sans-serif;
  color: #333;
}

.orders-title {
  font-size: 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: var(--primary-color, #ff5722);
}

/* ===== Loading ===== */
.loading {
  text-align: center;
  font-size: 1.2rem;
  padding: 40px 0;
  color: #666;
}

/* ===== Orders Grid ===== */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* ===== Order Card ===== */
.order-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

/* Status cards */
.confirmed-card {
  border-left: 4px solid #28a745;
}
.waiting-card {
  border-left: 4px solid #ffc107;
}

/* ===== Invoice Header ===== */
.invoice-header h3 {
  font-size: 1.4rem;
  margin-bottom: 6px;
  color: var(--primary-color, #ff5722);
}

.invoice-header p {
  font-size: 0.9rem;
  color: #666;
}

/* ===== Invoice Info ===== */
.invoice-info p {
  margin: 4px 0;
  font-size: 0.95rem;
}

/* ===== Product List ===== */
.product-list {
  margin-top: 15px;
}

.product-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  border: 1px solid #e0e0e0;
  padding: 12px;
  border-radius: 10px;
  transition: background 0.3s;
}

.product-card:hover {
  background: #f9f9f9;
}

.product-img {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ddd;
}

/* Product info */
.product-info h5 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.product-info p {
  margin: 2px 0;
  font-size: 0.9rem;
}

/* Review button */
.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

/* ===== Review Form ===== */
.review-form {
  background: #f8f9fa;
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.review-form .form-label {
  font-weight: 500;
}

.review-form textarea,
.review-form select,
.review-form input {
  border-radius: 8px;
}

/* Image preview */
.review-form .image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.review-form .image-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  position: relative;
}

.review-form .image-preview button {
  position: absolute;
  top: -6px;
  right: -6px;
  padding: 0 4px;
  font-size: 12px;
}

/* ===== Total + QR ===== */
.total-section {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qr-code {
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* ===== Status Section ===== */
.status-section {
  margin-top: 12px;
}

.status-section .badge {
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 12px;
}

/* ===== Buttons ===== */
.btn {
  border-radius: 8px;
  font-size: 0.85rem;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-outline-primary {
  border-radius: 8px;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .orders-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .product-card {
    flex-direction: column;
    align-items: center;
  }

  .product-img {
    width: 100px;
    height: 100px;
  }

  .review-form {
    padding: 10px;
  }
}

</style>
