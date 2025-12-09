<template>
  <div class="comments-page">
    
    <h2 class="title mb-2">Đánh giá của khách hàng</h2>

    <!-- ⭐ Tổng rating -->
    <p v-if="!loading" class="count-review d-flex align-items-center gap-2 mb-3">
      <span>
        <i v-for="n in 5" :key="n"
           :class="n <= Math.round(averageRating) ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"
           class="me-1"></i>
      </span>

      <span>
        <strong>{{ averageRating }}</strong> <strong> / 5 | </strong>
        <strong>{{ comments.length }}</strong> <strong>đánh giá</strong>
      </span>
    </p>

    <!-- Đang tải -->
    <div v-if="loading" class="loading">⏳ Đang tải bình luận...</div>

    <!-- =================📌 BỘ LỌC THEO SỐ SAO ================= -->
    <div v-if="comments.length" class="filter-box mb-3 d-flex gap-2 flex-wrap">
      <button class="btn"
        :class="selectedStar === 0 ? 'btn-primary' : 'btn-outline-primary'"
        @click="setFilter(0)">
        Tất cả ({{ comments.length }})
      </button>
        <!--  Lọc từ 5 sao -> 1 sao + icon Bootstrap -->
        <button 
          v-for="n in [5,4,3,2,1]" 
          :key="n"
          class="btn"
          :class="selectedStar === n ? 'btn-primary' : 'btn-outline-primary'"
          @click="setFilter(n)"
        >
          <i class="bi bi-star-fill text-warning"></i> {{ n }} sao ({{ countByStar(n) }})
        </button>

    </div>

    <div v-else class="no-comments">
      Chưa có bình luận nào. Hãy là người đầu tiên đánh giá!
    </div>

    <!--  DANH SÁCH BÌNH LUẬN -->
    <div v-for="cmt in visibleComments" :key="cmt._id" class="comment-card p-3 mb-2">
      
      <!-- User + Avatar -->
      <div class="comment-header d-flex align-items-center mb-2">
        <div class="avatar">{{ cmt.userName[0] }}</div>

        <div class="user-info">
          <div class="fw-bold">{{ cmt.userName }}</div>
          <div>
            <i v-for="n in 5" :key="n" 
               :class="n <= cmt.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"
               class="me-1"></i>
          </div>
        </div>
      </div>

      <!-- Nội dung -->
      <div class="comment-content mb-2">{{ cmt.content }}</div>

      <!-- Ảnh đính kèm -->
      <div v-if="cmt.images?.length" class="comment-images d-flex gap-2 mb-2">
        <img v-for="img in cmt.images" :key="img" :src="img" />
      </div>

      <!-- Ngày -->
      <div class="comment-date text-muted small">{{ formatDate(cmt.date) }}</div>
    </div>


    <!-- 📌 Nút xem thêm / thu gọn -->
    <div v-if="filteredComments.length > 4" class="text-center mt-2">
      <button class="btn btn-outline-primary"
              @click="showAll = !showAll">
        {{ showAll ? "Thu gọn" : "Xem thêm bình luận" }}
      </button>
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
      selectedStar: 0,  //  Bộ lọc sao
      showAll: false    // Xem thêm
    };
  },

  computed: {
    //  Tính rating trung bình
    averageRating() {
      if (!this.comments.length) return 0;
      return (this.comments.reduce((t, c) => t + c.rating, 0) / this.comments.length).toFixed(1);
    },

    //  Lọc theo sao
    filteredComments() {
      return this.selectedStar === 0 
        ? this.comments
        : this.comments.filter(c => c.rating === this.selectedStar);
    },

    //  Giới hạn hiển thị 4 bình luận
    visibleComments() {
      return this.showAll ? this.filteredComments : this.filteredComments.slice(0, 4);
    }
  },

  methods: {
    async fetchComments() {
      try {
        const id = this.$route.params.id;
        const res = await axios.get(`http://localhost:5000/binhluan/${id}`);

        // 🔥 Mới nhất lên đầu
        this.comments = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (e) {
        console.log("Lỗi tải bình luận: ", e);
      }
      this.loading = false;
    },

    setFilter(star) {
      this.selectedStar = star;
      this.showAll = false; // Reset khi đổi bộ lọc
    },

    countByStar(n) {
      return this.comments.filter(c => c.rating === n).length;
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    }
  },

  mounted() {
    this.fetchComments();
  }
};
</script>

<style scoped>
.comments-page {
  background: #fff;
  padding: 32px;
  border-radius: 14px;
  width: 95%;
  max-width: 900px;
  margin: auto;
  border: 1px solid #e9e9e9;
  box-shadow: 0 0 12px rgba(0,0,0,.05);
}

/*----------------- TITLE ----------------*/
.title {
  font-size: 22px;
  font-weight: 700;
  color: #222;
  padding-left: 12px;
  border-left: 4px solid #ff6a00;
  margin-bottom: 20px;
}

/*----------------- AVERAGE RATING / COUNT ----------------*/
.count-review {
  background: #fff6e0;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #ffd68a;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-review strong {

  font-size: 19px;
}

/*----------------- FILTER ----------------*/
.filter-box {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-box button {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: .25s;
}

.filter-box button:hover {
  transform: translateY(-1px);
}

/*----------------- COMMENT CARD ----------------*/
.comment-card {
  border: 1px solid #ececec;
  background: #fff;
  border-radius: 10px;
  padding: 18px;
  transition: .25s;
}

/* .comment-card:hover {
  transform: translateY(-3px);
  border-color: #ff8a3d;
  box-shadow: 0 4px 15px rgba(0,0,0,.07);
} */

/*----------------- AVATAR + USER ----------------*/
.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(45deg,#ff6a00,#ff9d3d);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/*----------------- TEXT CONTENT ----------------*/
.comment-content {
  font-size: 15px;
  line-height: 1.5;
  margin-top: 8px;
  margin-bottom: 12px;
}

/*----------------- IMAGES ----------------*/
.comment-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.comment-images img {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ddd;
  transition: .25s;
}

/* .comment-images img:hover {
  transform: scale(1.07);
  border-color: #ff6500;
} */

/*----------------- DATE ----------------*/
.comment-date {
  font-size: 13px;
  color: #777;
}

/*----------------- LOAD / EMPTY STATE ----------------*/
.loading,
.no-comments {
  font-size: 16px;
  padding: 22px;
  text-align: center;
  color: #666;
}

.no-comments {
  font-size: 17px;
}

/*----------------- SEE MORE BUTTON ----------------*/
.text-center .btn {
  margin-top: 6px;
  padding: 7px 16px;
  border-radius: 7px;
  font-size: 15px;
  font-weight: 500;
  transition: .25s;
}

.text-center .btn:hover {
  transform: scale(1.04);
}
</style>

