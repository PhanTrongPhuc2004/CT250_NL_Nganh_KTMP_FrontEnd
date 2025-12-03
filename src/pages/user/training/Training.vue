<!-- src/pages/user/training/Training.vue -->
<template>
    <div class="container py-4 py-lg-5">
        <!-- Header -->
        <div class="text-center mb-5">
            <h2 class="fw-bold text-danger display-5">
                <i class="bi bi-calendar-heart-fill me-3"></i>Lịch Tập Luyện
            </h2>
            <p class="lead text-muted">Cập nhật mới nhất từ HLV • {{ filteredList.length }} buổi tập</p>
        </div>

        <!-- Bộ lọc & Tìm kiếm -->
        <div class="row g-3 mb-4">
            <div class="col-md-6 col-lg-4">
                <div class="input-group shadow-sm">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search text-danger"></i>
                    </span>
                    <input v-model="searchQuery" type="text" class="form-control border-start-0 ps-0"
                        placeholder="Tìm địa điểm, nội dung..." @input="filterList" />
                </div>
            </div>

            <div class="col-md-6 col-lg-8">
                <div class="btn-group w-100 shadow-sm" role="group">
                    <input type="radio" class="btn-check" id="all" value="all" v-model="filterStatus"
                        @change="filterList">
                    <label class="btn btn-outline-danger" for="all">
                        <i class="bi bi-grid-3x3-gap"></i> Tất cả
                    </label>

                    <input type="radio" class="btn-check" id="today" value="today" v-model="filterStatus"
                        @change="filterList">
                    <label class="btn btn-outline-danger" for="today">
                        <i class="bi bi-sun"></i> Hôm nay
                    </label>

                    <input type="radio" class="btn-check" id="upcoming" value="upcoming" v-model="filterStatus"
                        @change="filterList">
                    <label class="btn btn-outline-warning" for="upcoming">
                        <i class="bi bi-clock-history"></i> Sắp tới
                    </label>

                    <input type="radio" class="btn-check" id="past" value="past" v-model="filterStatus"
                        @change="filterList">
                    <label class="btn btn-outline-secondary" for="past">
                        <i class="bi bi-check2-all"></i> Đã qua
                    </label>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-danger" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-3 text-muted fs-5">Đang tải lịch tập luyện...</p>
        </div>

        <!-- Không có dữ liệu -->
        <div v-else-if="filteredList.length === 0" class="text-center py-5">
            <i class="bi bi-calendar-x display-1 text-muted opacity-50"></i>
            <h4 class="mt-4 text-muted fw-normal">Không tìm thấy lịch tập</h4>
            <p v-if="searchQuery || filterStatus !== 'all'" class="text-muted">
                Thử thay đổi bộ lọc hoặc tìm kiếm lại nhé!
            </p>
            <p v-else class="text-muted">HLV sẽ sớm cập nhật lịch tập cho đội!</p>
        </div>

        <!-- Danh sách lịch tập -->
        <div v-else class="row g-4">
            <div v-for="session in filteredList" :key="session._id" class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-lg border-0 overflow-hidden position-relative transition-all" :class="{
                    'border-danger border-4 shadow-danger': session.isToday,
                    'border-warning border-3': session.isSoon && !session.isToday,
                    'opacity-75': session.isPast
                }" @click="showDetail(session)" style="cursor: pointer;">
                    <!-- Badge trạng thái -->
                    <div class="position-absolute top-0 end-0 m-3 z-10">
                        <span class="badge fs-6 px-3 py-2 fw-bold" :class="{
                            'bg-danger text-white': session.isToday,
                            'bg-warning text-dark': session.isSoon && !session.isToday,
                            'bg-secondary text-white': session.isPast
                        }">
                            <i :class="session.statusIcon"></i> {{ session.statusText }}
                        </span>
                    </div>

                    <!-- Card body -->
                    <div class="card-body p-4">
                        <h5 class="card-title text-danger fw-bold mb-3">
                            {{ formatDateFull(session.ngayBatDau) }}
                        </h5>

                        <div class="d-flex align-items-center mb-3 text-muted">
                            <i class="bi bi-clock-fill text-primary me-2"></i>
                            <strong>{{ session.thoiGian }}</strong>
                        </div>

                        <div class="d-flex align-items-center mb-3">
                            <i class="bi bi-geo-alt-fill text-success me-2 fs-5"></i>
                            <span class="fw-semibold">{{ session.diaDiem || 'Sân tập chính' }}</span>
                        </div>

                        <!-- Nội dung tập -->
                        <div v-if="session.noiDung" class="mt-3 p-3 bg-light rounded">
                            <p class="mb-1 fw-bold text-dark small">
                                <i class="bi bi-list-check text-danger"></i> Nội dung buổi tập:
                            </p>
                            <p class="text-muted small mb-0">{{ session.noiDung }}</p>
                        </div>

                        <!-- Ghi chú HLV -->
                        <div v-if="session.ghiChu"
                            class="mt-3 p-3 bg-primary bg-opacity-10 rounded border-start border-primary border-4">
                            <p class="mb-0 text-primary small">
                                <i class="bi bi-chat-quote-fill me-2"></i>
                                <em>{{ session.ghiChu }}</em>
                            </p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="card-footer bg-gradient bg-light border-0 text-center py-3">
                        <small class="text-muted">
                            Đội: <strong class="text-danger">{{ session.maDoiHinh?.tenDoiHinh || 'CTU FC' }}</strong>
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

const trainingList = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const filterStatus = ref("all");

// Lấy dữ liệu
const fetchTraining = async () => {
    try {
        const res = await axios.get("/lichtapluyen/doihinh");
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        trainingList.value = res.data.map(s => {
            const sessionDate = new Date(s.ngayBatDau);
            const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
            const diffTime = sessionDate - now;
            const diffHours = diffTime / (1000 * 60 * 60);
            const diffDays = (sessionDay - today) / (1000 * 60 * 60 * 24);

            const isToday = diffDays === 0;
            const isSoon = diffDays > 0 && diffDays <= 7;
            const isPast = diffDays < 0;

            return {
                ...s,
                isToday,
                isSoon,
                isPast,
                statusText: isToday ? "Hôm nay" : isSoon ? "Sắp tới" : "Đã qua",
                statusIcon: isToday ? "bi bi-fire" : isSoon ? "bi bi-hourglass-split" : "bi bi-check2-circle"
            };
        });
    } catch (err) {
        console.error("Lỗi tải lịch tập:", err);
        alert("Không thể tải lịch tập luyện!");
    } finally {
        loading.value = false;
    }
};

// Bộ lọc + tìm kiếm
const filteredList = computed(() => {
    let list = trainingList.value;

    // Lọc theo trạng thái
    if (filterStatus.value === "today") {
        list = list.filter(s => s.isToday);
    } else if (filterStatus.value === "upcoming") {
        list = list.filter(s => s.isSoon && !s.isToday);
    } else if (filterStatus.value === "past") {
        list = list.filter(s => s.isPast);
    }

    // Tìm kiếm
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        list = list.filter(s =>
            (s.diaDiem?.toLowerCase().includes(query)) ||
            (s.noiDung?.toLowerCase().includes(query)) ||
            (s.ghiChu?.toLowerCase().includes(query))
        );
    }

    // Sắp xếp: gần nhất lên đầu
    return list.sort((a, b) => new Date(a.ngayBatDau) - new Date(b.ngayBatDau));
});

// Hàm format ngày đẹp
const formatDateFull = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

const showDetail = (session) => {
    alert(`Buổi tập: ${session.thoiGian} - ${session.diaDiem}\nNội dung: ${session.noiDung || 'Không có'}\nGhi chú: ${session.ghiChu || 'Không có'}`);
};

onMounted(fetchTraining);
</script>

<style scoped>
.transition-all {
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 40px rgba(224, 33, 40, 0.2) !important;
    z-index: 10;
}

.shadow-danger {
    box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3) !important;
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
    box-shadow: 0 0 0 0.2rem rgba(224, 33, 40, 0.25);
}
</style>