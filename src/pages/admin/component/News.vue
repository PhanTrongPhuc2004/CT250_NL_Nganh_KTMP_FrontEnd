<template>
  <div class="news-wrapper">

    <!-- 🟢 Tin từ Bongda.com.vn -->
    <div class="news-box">
      <!-- <img
        src="https://bongda.com.vn/images/logo.png"
        alt="bongda.com.vn"
        class="news-img"
      /> -->
      <h3 class="news-title">Tin tức bóng đá mới nhất</h3>
      <p class="news-desc">Theo dõi các tin tức nóng hổi về bóng đá thế giới và Việt Nam.</p>

      <a class="news-btn" href="https://bongda.com.vn/" target="_blank">
        🔗 Xem trên bongda.com.vn
      </a>
    </div>

    <!-- 🟡 Tin từ 24h.com.vn -->
    <div class="news-box">
      <!-- <img
        src="https://cdn.24h.com.vn/images/icon_24h.png"
        alt="24h.com.vn"
        class="news-img"
      /> -->
      <h3 class="news-title"> Bóng đá tổng hợp - 24h</h3>
      <p class="news-desc">Đọc tin nhanh, video highlight & chuyển nhượng mới nhất.</p>

      <a class="news-btn" href="https://www.24h.com.vn/bong-da-c48.html" target="_blank">
        🔗 Xem trên 24h.com.vn
      </a>
    </div>

  </div>
</template>

<script setup>
// Không cần script nếu chỉ hiển thị thẻ tĩnh
</script>

<style scoped>
.news-wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* --- Thẻ vuông tin tức --- */
.news-box {
  width: 320px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  transition: .3s;
}

/* Hover đẹp */
.news-box:hover {
  transform: scale(1.04);
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

/* Logo tin tức */
.news-img {
  width: 90px;
  height: 90px;
  margin-bottom: 12px;
}

/* Text */
.news-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
}

.news-desc {
  font-size: 14px;
  color: #444;
  margin-bottom: 14px;
}

/* Button */
.news-btn {
  display: inline-block;
  padding: 6px 10px;
  background: #0076ff;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  text-decoration: none;
  transition: .2s;
}

.news-btn:hover {
  background: #005ed6;
}
</style>
