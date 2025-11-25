<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { fetchClubInfo } from "@/utils";

const clubInfo = ref({});

onMounted(async () => {
  const response = await fetchClubInfo()
  clubInfo.value = response[0];
});
</script>

<template>
  <footer class="footer bg-dark text-light pt-5 pb-3 mt-5">
    <div class="container">
      <div class="row">
        <!-- Giới thiệu CLB -->
        <div class="col-md-3 mb-4">
          <div class="d-flex align-items-center mb-3">
            <img
              :src="
                clubInfo.logo ||
                'https://media.api-sports.io/football/teams/33.png'
              "
              alt="logo"
              width="50"
              class="me-2 rounded-circle border border-light"
            />
            <h5 class="mb-0 fw-bold">
              {{ clubInfo.ten || "Manchester United" }}
            </h5>
          </div>
          <p class="small text-muted">
            {{ clubInfo?.moTa }}
          </p>
        </div>

        <!-- Liên hệ -->
        <div class="col-md-3 mb-4">
          <h6 class="fw-bold text-danger">Contact Us</h6>
          <ul class="list-unstyled small">
            <li>
              <i class="fas fa-envelope me-2"></i>
              {{ clubInfo.lienHe?.email || "info@manutd.com" }}
            </li>
            <li>
              <i class="fas fa-phone me-2"></i>
              {{ clubInfo.lienHe?.soDienThoai || "+44 161 868 8000" }}
            </li>
            <li>
              <i class="fas fa-map-marker-alt me-2"></i>
              {{ clubInfo.sanNha?.ten || "Old Trafford Stadium" }},
              {{ clubInfo.sanNha?.diaChi || "Manchester, UK" }}
            </li>
          </ul>
        </div>

        <!-- Nhà tài trợ -->
        <div class="col-md-3 mb-4">
          <h6 class="fw-bold text-danger">Our Sponsors</h6>
          <div class="d-flex flex-column gap-2 small">
            <span
              v-for="(sponsor, index) in clubInfo.nhaTaiTro || []"
              :key="index"
            >
              • {{ sponsor.ten }}
            </span>
          </div>
        </div>

        <!-- Feedback / Newsletter -->
        <div class="col-md-3 mb-4">
          <h6 class="fw-bold text-danger">Feedback / Newsletter</h6>
          <p class="small text-muted">
            Share your thoughts or subscribe to get the latest updates.
          </p>
          <form>
            <div class="mb-2">
              <input
                type="text"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Your Name"
              />
            </div>
            <div class="mb-2">
              <input
                type="email"
                class="form-control bg-dark text-light border-secondary"
                placeholder="Your Email"
              />
            </div>
            <div class="mb-2">
              <textarea
                class="form-control bg-dark text-light border-secondary"
                rows="2"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button class="btn btn-danger w-100">
              <i class="fas fa-paper-plane me-1"></i> Send
            </button>
          </form>
        </div>
      </div>

      <hr class="border-secondary my-3" />

      <!-- Bottom -->
      <div class="text-center small text-muted">
        © 2024 {{ clubInfo.ten || "Manchester United" }}. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  color: #bbb;
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-link:hover {
  color: #fff;
}
</style>
