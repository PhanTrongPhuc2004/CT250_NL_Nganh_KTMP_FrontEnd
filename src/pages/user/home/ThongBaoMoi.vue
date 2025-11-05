<template>
  <div class="container my-5">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="fw-bold text-danger">
        <i class="bi bi-bell-fill me-2"></i> Thông Báo Bóng Đá Mới Nhất
      </h2>
      <!-- <button class="btn btn-outline-primary">
        <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
      </button> -->
    </div>

    <div class="row g-4">
      <div
        v-for="(item, index) in thongBaoList"
        :key="index"
        class="col-md-6 col-lg-4"
      >
        <div class="card shadow-sm h-100 news-card">
          <img
            :src="item.image"
            class="card-img-top news-image"
            :alt="item.title"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark">{{ item.title }}</h5>
            <p class="card-text text-muted">{{ item.desc }}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <a
                :href="item.link"
                target="_blank"
                class="btn btn-sm btn-danger"
              >
                <i class="bi bi-box-arrow-up-right me-1"></i> Đọc ngay
              </a>
              <small class="text-secondary">
                <i class="bi bi-newspaper me-1"></i>{{ item.source }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const thongBaoList = [
  {
    title: "Việt Nam công bố danh sách 25 cầu thủ dự AFF Cup 2025",
    desc: "HLV Philippe Troussier triệu tập nhiều gương mặt trẻ triển vọng chuẩn bị cho AFF Cup 2025.",
    image:
      "https://toquoc.mediacdn.vn/thumb_w/640/280518851207290880/2024/11/18/epak2689-17319216108211418153467.jpg",
    link: "https://toquoc.vn/danh-sach-doi-tuyen-viet-nam-tham-du-aff-cup-vang-que-ngoc-hai-do-hung-dung-20241118162225447.htm",
    source: "toquoc.vn",
  },
    {
    title: "U23 Việt Nam thắng Thái Lan 4-0 tại SEA Games",
    desc: "Các cầu thủ trẻ Việt Nam thi đấu bùng nổ và khiến người hâm mộ phấn khích.",
    image:
      "https://cdn.24h.com.vn/upload/1-2019/images/2019-03-27/U23-Viet-Nam-dai-thang-Thai-Lan-Cong-Phuong-Van-Lam-con-cua-du-SEA-Games-55495130_2185100588405926_4739839544663212032_n-1553682014-193-width660height440.jpg",
    link: "https://www.24h.com.vn/bong-da/u23-viet-nam-dai-thang-thai-lan-co-can-cong-phuong-van-lam-du-sea-games-c48a1038636.html",
    source: "Vietnamnet",
  },
    {
    title: "Tuyển Việt Nam gặp lại ba “cố nhân” ở bảng B",
    desc: "Tuyển Việt Nam rơi vào bảng B vòng chung kết Futsal Asian Cup 2026 gặp toàn người quen.",
    image:
      "https://photo-baomoi.bmcdn.me/w700_r16x9/2025_11_05_114_53678502/c13295bbc2f22bac72e3.jpg.avif",
    link: "https://plo.vn/tuyen-viet-nam-gap-lai-ba-co-nhan-o-bang-b-post879623.html",
    source: "UEFA",
  },
  {
    title: "Messi rực sáng giúp Inter Miami vô địch MLS Cup",
    desc: "Lionel Messi ghi hat-trick và giành danh hiệu đầu tiên tại Mỹ, tiếp tục khẳng định vị thế GOAT.",
    image:
      "https://cdn-img.thethao247.vn/storage/files/hungtm/2025/11/05/c1-690b23d897cd6.jpg",
    link: "https://bongda.com.vn",
    source: "Bóng Đá",
  },
    {
    title: "Chiến thắng ấn tượng của HLV Harry Kewell cùng Hà Nội FC",
    desc: "HLV Harry Kewell đã có những chia sẻ sau thắng lợi của Hà Nội FC trước PVF_CAND ở V-League mới đây.",
    image:
      "https://media.bongda.com.vn/news/editor/20251105_044631_nhzlvllg.jpg",
    link: "https://www.bongda.com.vn/chien-thang-an-tuong-cua-hlv-harry-kewell-cung-ha-noi-fc-d806817.html",
    source: "bongda.com",
  },
  {
    title: "MU thắng Liverpool 3-2 trong trận derby kịch tính",
    desc: "Bruno Fernandes ghi bàn phút bù giờ, mang về chiến thắng nghẹt thở cho Quỷ Đỏ.",
    image:
      "https://cdn-img.thethao247.vn/origin_842x0/storage/files/camhm/2025/01/06/dlbeatsnoopcom-final-kl0nvbijjd-677ad05fd0c48.jpg",
    link: "https://thethao247.vn/426-kwt-qua-liverpool-vs-mu-23h30-ngay-5-1-2025-d353400.html",
    source: "Thể Thao 247",
  },


  {
    title: "Real Madrid chính thức ký hợp đồng với Kylian Mbappé",
    desc: "Sau nhiều năm đồn đoán, Mbappé cuối cùng cũng cập bến Santiago Bernabéu.",
    image:
      "https://cdn-img.thethao247.vn/origin_842x0/storage/files/camhm/2024/06/02/665c555c97d58.jpg",
    link: "https://thethao247.vn/426-kylian-mbappe-ky-hop-dong-voi-real-madrid-d330102.html",
    source: "thethao247",
  },


  {
    title: "Bóng đá Việt Nam chạm trán đại diện Thái Lan ở giải đấu châu lục",
    desc: "VOV.VN - ĐT Futsal Việt Nam sẽ gặp ĐT Futsal Thái Lan ở VCK Futsal châu Á 2026.",
    image:
      "https://media.vov.vn/sites/default/files/styles/large/public/2025-11/fs_tl.png.jpg",
    link: "https://vov.vn/the-thao/bong-da-viet-nam-cham-tran-dai-dien-thai-lan-o-giai-dau-chau-luc-post1243551.vov",
    source: "the-thao",
  },

  {
    title: "Man City lập kỷ lục 100 điểm tại Premier League",
    desc: "Đội bóng của Pep Guardiola tiếp tục thống trị Ngoại Hạng Anh với phong độ hủy diệt.",
    image:
      "https://cdnphoto.dantri.com.vn/m9AEgEtPPs556dG6YnADhAsHGdo=/thumb_w/1360/2024/05/20/foden-1716138868588.jpg",
    link: "https://dantri.com.vn/the-thao/man-city-lap-ky-luc-vo-dich-4-lan-lien-tiep-tai-premier-league-20240519214220655.htm",
    source: "dantri",
  },
 
];
</script>

<style scoped>
.news-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.news-image {
  height: 200px;
  object-fit: cover;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-danger:hover {
  background-color: #bb2d3b;
}

@media (max-width: 768px) {
  .news-image {
    height: 180px;
  }
}
</style>

<!-- ✅ Thêm Bootstrap và Icons (chỉ cần thêm 1 lần trong main.js hoặc index.html) -->
<!--
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
  rel="stylesheet"
/>
-->
