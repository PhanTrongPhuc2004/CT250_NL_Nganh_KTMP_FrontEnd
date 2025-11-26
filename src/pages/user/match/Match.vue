<!-- src/pages/user/match/Match.vue -->
<template>
    <div class="container py-4 py-lg-5">
        <!-- Header -->
        <div class="text-center mb-5">
            <h2 class="fw-bold text-danger display-5">
                <i class="bi bi-trophy-fill me-3"></i>Lịch Thi Đấu
            </h2>
            <p class="lead text-muted">Cập nhật mới nhất từ Ban huấn luyện • {{ filteredList.length }} trận đấu</p>
        </div>

        <!-- Bộ lọc & Tìm kiếm -->
        <div class="row g-3 mb-4">
            <div class="col-md-6 col-lg-4">
                <div class="input-group shadow-sm">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search text-danger"></i>
                    </span>
                    <input v-model="searchQuery" type="text" class="form-control border-start-0 ps-0"
                        placeholder="Tìm đối thủ, sân đấu..." @input="filterList" />
                </div>
            </div>

            <div class="col-md-6 col-lg-8">
                <div class="btn-group w-100 shadow-sm" role="group">
                    <input type="radio" class="btn-check" id="all-match" value="all" v-model="filterStatus"
                        @change="filterList">
                    <label class="btn btn-outline-danger" for="all-match">
                        <i class="bi bi-grid-3x3-gap"></i> Tất cả
                    </label>

                    <input type="radio" class="btn-check" id="today-match" value="today" v-model="filterStatus"
                        @change="filterList">
                    <label class="btn btn-outline-danger" for="today-match">
                        <i class="bi bi-sun-fill"></i> Hôm nay
                    </label>

                    <input type="radio" class="btn-check" id="upcoming-match" value="upcoming" v-model="filterStatus"
                        @change="filterList">
                    <label class="btn btn-outline-warning" for="upcoming-match">
                        <i class="bi bi-clock-history"></i> Sắp tới
                    </label>

                    <input type="radio" class="btn-check" id="finished" value="finished" v-model="filterStatus"
                        @change="filterList">
                    <label class="btn btn-outline-success" for="finished">
                        <i class="bi bi-check2-all"></i> Đã kết thúc
                    </label>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-danger" style="width: 4rem; height: 4rem;">
                <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-3 text-muted fs-5">Đang tải lịch thi đấu...</p>
        </div>

        <!-- Không có trận đấu -->
        <div v-else-if="filteredList.length === 0" class="text-center py-5">
            <i class="bi bi-shield-slash display-1 text-muted opacity-50"></i>
            <h4 class="mt-4 text-muted fw-normal">Chưa có lịch thi đấu</h4>
            <p v-if="searchQuery || filterStatus !== 'all'" class="text-muted">
                Thử thay đổi bộ lọc hoặc tìm kiếm lại nhé!
            </p>
            <p v-else class="text-muted">Ban huấn luyện sẽ sớm cập nhật lịch thi đấu!</p>
        </div>

        <!-- Danh sách trận đấu -->
        <div v-else class="row g-4">
            <div v-for="match in filteredList" :key="match._id" class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-lg border-0 overflow-hidden position-relative transition-all" :class="{
                    'border-danger border-4 shadow-danger': match.isToday,
                    'border-warning border-3': match.isUpcoming,
                    'border-success border-3': match.isFinished,
                    'opacity-80': match.isFinished
                }" style="cursor: pointer;" @click="goToMatchDetail(match.maTranDau)">
                    <!-- Badge trạng thái -->
                    <div class="position-absolute top-0 end-0 m-3 z-10">
                        <span class="badge fs-6 px-3 py-2 fw-bold" :class="{
                            'bg-danger text-white': match.isToday,
                            'bg-warning text-dark': match.isUpcoming,
                            'bg-success text-white': match.isFinished,
                            'bg-info text-white': match.trangThai === 'dang_dien_ra'
                        }">
                            <i :class="match.statusIcon"></i> {{ match.statusText }}
                        </span>
                    </div>

                    <!-- Card body -->
                    <div class="card-body p-4 text-center">
                        <!-- Ngày thi đấu -->
                        <h5 class="text-danger fw-bold mb-3">
                            {{ formatDateFull(match.ngayBatDau) }}
                        </h5>

                        <!-- Giờ thi đấu -->
                        <p class="text-muted mb-3">
                            <i class="bi bi-clock-fill text-primary me-2"></i>
                            <strong>{{ match.thoiGian }}</strong>
                        </p>

                        <!-- Đối đầu -->
                        <div class="d-flex align-items-center justify-content-center gap-3 my-4">
                            <div class="text-end">
                                <h5 class="fw-bold mb-0 text-danger">{{ match.doiNhaTen || 'Đội nhà' }}</h5>
                                <small class="text-muted">Chủ nhà</small>
                            </div>

                            <div class="px-3">
                                <h3 class="fw-bold text-dark">
                                    {{ match.trangThai === 'ket_thuc' ? `${match.tySoNha || 0} - ${match.tySoKhach ||
                                        0}` : 'VS' }}
                                </h3>
                            </div>

                            <div class="text-start">
                                <h5 class="fw-bold mb-0 text-dark">{{ match.doiKhachTen || 'Đối thủ' }}</h5>
                                <small class="text-muted">Khách</small>
                            </div>
                        </div>

                        <!-- Sân đấu -->
                        <div class="d-flex align-items-center justify-content-center text-success mb-3">
                            <i class="bi bi-geo-alt-fill me-2 fs-5"></i>
                            <span class="fw-semibold">{{ match.diaDiem || 'Sân trung lập' }}</span>
                        </div>

                        <!-- Giải đấu -->
                        <div v-if="match.maMuaGiai" class="text-center">
                            <span class="badge bg-primary fs-6">{{ match.tenMuaGiai || 'Giải đấu' }}</span>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="card-footer bg-gradient bg-light border-0 text-center py-3">
                        <small class="text-muted">
                            Mùa giải: <strong class="text-danger">{{ match.tenMuaGiai || '2025' }}</strong>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/utils/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const matchList = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const filterStatus = ref("all");

const fetchMatches = async () => {
    try {
        // Gọi API lấy trận đấu của đội hiện tại (theo maDoiHinh trong token)
        const res = await axios.get("/trandau");
        const now = new Date();

        matchList.value = res.data.map(match => {
            const matchDate = new Date(match.ngayBatDau);
            const diffTime = matchDate - now;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            const isToday = Math.abs(diffDays) < 1;
            const isUpcoming = diffDays >= 1 && diffDays <= 30;
            const isFinished = match.trangThai === 'ket_thuc';
            const isLive = match.trangThai === 'dang_dien_ra';

            return {
                ...match,
                isToday,
                isUpcoming,
                isFinished,
                isLive,
                statusText: isLive ? "Đang diễn ra" : isToday ? "Hôm nay" : isUpcoming ? "Sắp tới" : "Đã kết thúc",
                statusIcon: isLive ? "bi bi-broadcast" : isToday ? "bi bi-fire" : isUpcoming ? "bi bi-hourglass-split" : "bi bi-trophy"
            };
        });
    } catch (err) {
        console.error("Lỗi tải lịch thi đấu:", err);
        alert("Không thể tải lịch thi đấu!");
    } finally {
        loading.value = false;
    }
};

// Bộ lọc + tìm kiếm
const filteredList = computed(() => {
    let list = matchList.value;

    if (filterStatus.value === "today") {
        list = list.filter(m => m.isToday);
    } else if (filterStatus.value === "upcoming") {
        list = list.filter(m => m.isUpcoming);
    } else if (filterStatus.value === "finished") {
        list = list.filter(m => m.isFinished);
    }

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(m =>
            (m.doiNhaTen?.toLowerCase().includes(q)) ||
            (m.doiKhachTen?.toLowerCase().includes(q)) ||
            (m.diaDiem?.toLowerCase().includes(q)) ||
            (m.tenMuaGiai?.toLowerCase().includes(q))
        );
    }

    return list.sort((a, b) => new Date(a.ngayBatDau) - new Date(b.ngayBatDau));
});

const formatDateFull = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

const goToMatchDetail = (maTranDau) => {
    router.push(`/match/${maTranDau}`);
};

onMounted(fetchMatches);
</script>

<style scoped>
.transition-all {
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-12px) scale(1.03);
    box-shadow: 0 25px 50px rgba(224, 33, 40, 0.25) !important;
    z-index: 10;
}

.shadow-danger {
    box-shadow: 0 15px 35px rgba(220, 53, 69, 0.4) !important;
}

.bg-gradient {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.text-danger {
    color: #E02128 !important;
}

.btn-check:checked+.btn {
    background-color: #E02128 !important;
    color: white !important;
    border-color: #E02128 !important;
}

.input-group input:focus {
    border-color: #E02128;
    box-shadow: 0 0 0 0.25rem rgba(224, 33, 40, 0.25);
}
</style>