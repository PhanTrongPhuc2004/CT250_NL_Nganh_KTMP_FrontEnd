<template>
  <footer class="footer bg-dark text-light pt-5 pb-3 mt-5">
    <div class="container">
      <div class="row">
        <!-- Giới thiệu -->
        <div class="col-md-3 mb-4">
          <div class="d-flex align-items-center mb-3">
            <img
              src="https://media.api-sports.io/football/teams/33.png"
              alt="logo"
              width="50"
              class="me-2"
            />
            <h5 class="mb-0 fw-bold">Manchester United</h5>
          </div>
          <p class="small text-muted">
            The world's most successful football club, home to legends and
            dreams.
          </p>
          <div class="d-flex gap-3 mt-3 fs-5">
            <a href="#" class="text-light"><i class="fab fa-facebook"></i></a>
            <a href="#" class="text-light"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-light"><i class="fab fa-instagram"></i></a>
            <a href="#" class="text-light"><i class="fab fa-youtube"></i></a>
            <a href="#" class="text-light"><i class="fab fa-tiktok"></i></a>
            <a href="#" class="text-light"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>

        <!-- Liên hệ -->
        <div class="col-md-3 mb-4">
          <h6 class="fw-bold text-danger">Contact Us</h6>
          <ul class="list-unstyled small">
            <li><i class="fas fa-envelope me-2"></i> info@manutd.com</li>
            <li><i class="fas fa-phone me-2"></i> +44 161 868 8000</li>
            <li>
              <i class="fas fa-map-marker-alt me-2"></i> Old Trafford Stadium,
              Sir Matt Busby Way, Manchester, UK
            </li>
          </ul>
        </div>

        <!-- Hỗ trợ -->
        <div class="col-md-3 mb-4">
          <h6 class="fw-bold text-danger">Quick Links</h6>
          <ul class="list-unstyled">
            <li><a href="#" class="footer-link">Team</a></li>
            <li><a href="#" class="footer-link">Fixtures</a></li>
            <li><a href="#" class="footer-link">Results</a></li>
            <li><a href="#" class="footer-link">Tickets</a></li>
            <li><a href="#" class="footer-link">Membership</a></li>
            <li><a href="#" class="footer-link">Hospitality</a></li>
            <li><a href="#" class="footer-link">Academy</a></li>
            <li><a href="#" class="footer-link">Contact</a></li>
          </ul>
        </div>

        <!-- Newsletter / Form phản hồi -->
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

      <!-- Sponsors -->
      <div class="text-center mb-3">
        <h6 class="fw-bold mb-3">Our Sponsors</h6>
        <div class="d-flex justify-content-center gap-4 flex-wrap">
          <!--<img src="/sponsor-adidas.png" alt="Adidas" height="40" />
          <img src="/sponsor-teamviewer.png" alt="TeamViewer" height="40" />
          <img src="/sponsor-dxc.png" alt="DXC" height="40" />
          <img src="/sponsor-apollo.png" alt="Apollo" height="40" />-->
        </div>
      </div>

      <!-- Bottom -->
      <div class="text-center small text-muted">
        © 2024 Manchester United Football Club. All rights reserved.
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
