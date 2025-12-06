<template>
  <div class="comments-page">
    <h2 class="title mb-2">Đánh giá của khách hàng</h2>

    <!-- ⭐ Hiển thị tổng điểm + số lượng đánh giá -->
    <p v-if="!loading" class="count-review d-flex align-items-center gap-2 mb-3">
      <span>
        <i 
          v-for="n in 5" 
          :key="n" 
          :class="n <= Math.round(averageRating) ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"
          class="me-1"
        ></i>
      </span>

      <span>
        <strong>{{ averageRating }}</strong> <strong>/ 5</strong>
        | <strong>{{ comments.length }}</strong> <strong>đánh giá</strong>
      </span>
    </p>

    <!-- Đang tải dữ liệu -->
    <div v-if="loading" class="loading">⏳ Đang tải bình luận...</div>

    <div v-else>
      
      <!-- Nếu chưa có bình luận -->
      <div v-if="comments.length === 0" class="no-comments">
        Chưa có bình luận nào. Hãy là người đầu tiên đánh giá sản phẩm!
      </div>

      <!-- Danh sách bình luận -->
      <div v-for="cmt in comments" :key="cmt._id" class="comment-card p-3 mb-2 border rounded shadow-sm">

        <!-- Avatar + tên + sao -->
        <div class="comment-header d-flex align-items-center mb-2">
          <div class="avatar bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2" style="width:36px;height:36px;">
            {{ cmt.userName[0] }}
          </div>

          <div class="user-info">
            <div class="fw-bold">{{ cmt.userName }}</div>
            <div>
              <i 
                v-for="n in 5" 
                :key="n" 
                :class="n <= cmt.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"
                class="me-1"
              ></i>
            </div>
          </div>
        </div>

        <!-- Nội dung -->
        <div class="comment-content mb-2">
          {{ cmt.content }}
        </div>

        <!-- Hình ảnh -->
        <div class="comment-images d-flex gap-2 mb-2" v-if="cmt.images && cmt.images.length">
          <img 
            v-for="img in cmt.images"
            :key="img"
            :src="img"
            class="rounded border"
            style="width:90px; height:90px; object-fit:cover;"
          />
        </div>

        <!-- Ngày -->
        <div class="comment-date text-muted small">
          {{ formatDate(cmt.date) }}
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CommentList",

  data() {
    return {
      comments: [],
      loading: true,
    };
  },

  computed: {
    averageRating() {
      if (!this.comments.length) return 0;
      const total = this.comments.reduce((sum, c) => sum + c.rating, 0);
      return (total / this.comments.length).toFixed(1);
    }
  },

  methods: {
    async fetchComments() {
      try {
        const productId = this.$route.params.id;
        const res = await axios.get(`http://localhost:5000/binhluan/${productId}`);
        this.comments = res.data;
      } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    }
  },

  mounted() {
    this.fetchComments();
  },
};
</script>


<style scoped>
.comments-page {
  background: #fff;
  padding: 28px;
  border-radius: 12px;
  width: 95%;
  max-width: 1100px;
  margin: 0 auto;
  border: 1px solid #eee;
  box-shadow: 0 4px 18px rgba(0,0,0,0.06);
}

/* Tiêu đề */
.title {
  font-size: 22px;
  font-weight: 700;
  color: #222;
  border-left: 4px solid #ff4d4f;
  padding-left: 10px;
}

/* Load text */
.loading {
  font-size: 18px;
  text-align: center;
  padding: 20px 0;
}

/* Không có bình luận */
.no-comments {
  padding: 28px;
  font-size: 18px;
  text-align: center;
  border-radius: 10px;
  background: #fafafa;
  color: #666;
  font-style: italic;
}

/* Card comment */
.comment-card {
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 18px;
  transition: 0.25s;
}

/* Hover nổi giống Shopee */
.comment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

/* Header */
.comment-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Avatar */
.avatar {
  width: 44px;
  height: 44px;
  font-size: 17px;
  font-weight: 700;
  border-radius: 50%;
  background: linear-gradient(45deg,#ff4d4f,#ff9a3c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

/* Tên + sao */
.user-info .fw-bold {
  font-size: 15px;
  color: #111;
}

.user-info i {
  font-size: 16px;
}

/* Nội dung bình luận */
.comment-content {
  margin: 10px 0 14px;
  font-size: 15px;
  line-height: 1.55;
  color: #333;
}

/* Ảnh kèm theo */
.comment-images img {
  width: 95px;
  height: 95px;
  border-radius: 8px;
  border: 1px solid #ddd;
  object-fit: cover;
  transition: 0.2s ease;
}

/* Zoom nhẹ giống Shopee */
.comment-images img:hover {
  transform: scale(1.05);
  border-color: #ff4d4f;
}

/* Ngày */
.comment-date {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

/* Hàng tổng sao */
.count-review {
  font-size: 17px;
  padding: 12px 0 20px;
  background: #fff8e6;
  border-radius: 10px;
  border: 1px solid #ffdd99;
  font-weight: 500;
  justify-content: center;
}

.count-review strong {
  font-size: 20px;
  color: #ff9500;
}
</style>

