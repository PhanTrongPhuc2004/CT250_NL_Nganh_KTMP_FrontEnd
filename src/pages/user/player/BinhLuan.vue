<template>
  <div class="comments-page">
    <h2 class="title">Bình luận sản phẩm</h2>

    <div v-if="loading" class="loading">⏳ Đang tải bình luận...</div>

    <div v-else>
      <!-- Nếu không có bình luận -->
      <div v-if="comments.length === 0" class="no-comments">
        Chưa có bình luận nào. Hãy là người đầu tiên đánh giá sản phẩm!
      </div>

      <!-- Danh sách bình luận -->
      <div
        v-for="cmt in comments"
        :key="cmt._id"
        class="comment-card"
      >
        <div class="comment-header">
        <div class="avatar">{{ cmt.userName[0] }}</div>

        <div class="user-info">
            <div class="name">{{ cmt.userName }}</div>

            <!-- Rating ngay dưới tên -->
            <div class="rating-stars">
            <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ active: n <= cmt.rating }"
            >★</span>
            </div>
        </div>
        </div>

        <div class="comment-content">
          {{ cmt.content }}
        </div>

        <!-- Ảnh bình luận -->
        <div class="comment-images" v-if="cmt.images && cmt.images.length">
          <img
            v-for="img in cmt.images"
            :src="img"
            :key="img"
            class="comment-img"
            alt="comment image"
          />
        </div>

        <div class="comment-date">
          {{ formatDate(cmt.date) }}
        </div>

        <hr />
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

  methods: {
    async fetchComments() {
      try {
        const productId = this.$route.params.id; // lấy id từ URL

        const res = await axios.get(
          `http://localhost:5000/binhluan/${productId}`
        );

        this.comments = res.data;
      } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
  },

  mounted() {
    this.fetchComments();
  },
};
</script>

<style scoped>
.comments-page {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

.loading {
  font-size: 18px;
  text-align: center;
}

.no-comments {
  padding: 20px;
  text-align: center;
  font-size: 17px;
  color: #777;
}

.comment-card {
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.comment-header {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.avatar {
  width: 42px;
  height: 42px;
  background: #ff5722;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.name {
  font-weight: bold;
  font-size: 15px;
  margin-top: 3px;
}

.rating-stars {
  color: #ffce3d;
  font-size: 17px;
  display: flex;
  gap: 2px;
}

.star {
  opacity: 0.2;
}

.star.active {
  opacity: 1;
}

/* Nội dung bình luận */
.comment-content {
  margin: 10px 0;
  line-height: 1.5;
  font-size: 15px;
}

.comment-images {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.comment-date {
  font-size: 13px;
  color: #777;
  margin-bottom: 10px;
}

</style>
