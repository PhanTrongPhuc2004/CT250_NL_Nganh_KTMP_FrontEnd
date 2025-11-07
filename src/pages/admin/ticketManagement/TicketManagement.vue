<template>
    <div class="container py-4">
        <!-- Tiêu đề -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-semibold text-dark m-0">Quản lý cấu hình vé</h4>
            <button class="btn btn-sm text-white" style="background-color: #8b2c31" @click="handleOpenForm('add')"
                :disabled="!selectedMatch">
                <i class="bi bi-plus-lg me-1"></i> Thêm cấu hình vé
            </button>
        </div>

        <!-- Bộ lọc: Giải đấu → Mùa giải → Trận đấu -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label fw-medium text-muted small">Giải đấu</label>
                        <select class="form-select form-select-sm" v-model="selectedGiaiDau" @change="onGiaiDauChange">
                            <option value="">Chọn giải đấu</option>
                            <option v-for="gd in giaiDauList" :key="gd._id" :value="gd.maGiaiDau">
                                {{ gd.tenGiaiDau }}
                            </option>
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label fw-medium text-muted small">Mùa giải</label>
                        <select class="form-select form-select-sm" v-model="selectedMuaGiai" @change="onMuaGiaiChange"
                            :disabled="!selectedGiaiDau">
                            <option value="">Chọn mùa giải</option>
                            <option v-for="mg in muaGiaiList" :key="mg._id" :value="mg.maMuaGiai">
                                {{ mg.tenMuaGiai }}
                            </option>
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label fw-medium text-muted small">Trận đấu</label>
                        <select class="form-select form-select-sm" v-model="selectedMatch" @change="fetchCauHinhVe"
                            :disabled="!selectedMuaGiai">
                            <option value="">Chọn trận đấu</option>
                            <option v-for="td in tranDauList" :key="td._id" :value="td.maTranDau">
                                {{ getMatchName(td) }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bảng cấu hình vé -->
        <div class="card border-0 shadow-sm" v-if="selectedMatch">
            <div class="card-body p-0">
                <table class="table align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 40px">#</th>
                            <th>Loại vé</th>
                            <th>Khu vực</th>
                            <th>Hàng ghế</th>
                            <th>Số ghế</th>
                            <th>Giá vé</th>
                            <th class="text-center">Còn lại</th>
                            <th class="text-center" style="width: 120px">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(config, index) in cauHinhVeList" :key="config._id">
                            <td class="text-center text-muted">{{ index + 1 }}</td>
                            <td>
                                <span class="badge bg-primary small px-2 py-1">
                                    {{ config.loaiVe }}
                                </span>
                            </td>
                            <td>{{ config.khuVuc }}</td>
                            <td>{{ config.hangGhe }}</td>
                            <td>{{ config.soGheBatDau }} - {{ config.soGheKetThuc }}</td>
                            <td class="fw-semibold text-success">
                                {{ formatCurrency(config.giaVe) }}
                            </td>
                            <td class="text-center">
                                <span class="badge" :class="config.soGheConLai > 0 ? 'bg-success' : 'bg-danger'">
                                    {{ config.soGheConLai }} / {{ config.tongSoGhe }}
                                </span>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-secondary me-1"
                                    @click="handleOpenForm('edit', config)">
                                    <FontAwesomeIcon icon="fa-solid fa-pen" />
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="deleteCauHinhVe(config._id)">
                                    <FontAwesomeIcon icon="fa-solid fa-trash" />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="cauHinhVeList.length === 0">
                            <td colspan="8" class="text-center text-muted py-3 fst-italic">
                                Chưa có cấu hình vé cho trận đấu này.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else class="text-center text-muted py-5">
            <i class="bi bi-ticket-perforated fs-1"></i>
            <p class="mt-3">Vui lòng chọn trận đấu để xem cấu hình vé</p>
        </div>

        <!-- Modal Form RIÊNG – KHÔNG DÙNG Form.vue cũ -->
        <TicketForm v-if="formStore.isCurrent(formName)" :mode="formMode" :initial-data="formData"
            :api="formMode === 'edit' ? `/cauhinhve/id/${formData._id}` : '/cauhinhve'"
            :method="formMode === 'add' ? 'POST' : 'PUT'" @success="fetchCauHinhVe" @closed="formStore.closeForm" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios";
import Form from "@/components/common/form/TicketForm.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useFormStore } from "@/stores/formStore";

const formStore = useFormStore();

// --- Dữ liệu
const giaiDauList = ref([]);
const muaGiaiList = ref([]);
const tranDauList = ref([]);
const cauHinhVeList = ref([]);

const selectedGiaiDau = ref("");
const selectedMuaGiai = ref("");
const selectedMatch = ref("");

const formMode = ref("add");
const formData = ref({});
const formName = ref("");

// --- API Calls
const fetchGiaiDau = async () => {
    const res = await axios.get("/giaidau");
    giaiDauList.value = res.data;
};

const fetchMuaGiaiByGiaiDau = async () => {
    if (!selectedGiaiDau.value) return;
    const res = await axios.get(`/muagiai?maGiaiDau=${selectedGiaiDau.value}`);
    muaGiaiList.value = res.data;
};

const fetchTranDauByMuaGiai = async () => {
    if (!selectedMuaGiai.value) return;
    const res = await axios.get(`/trandau?maMuaGiai=${selectedMuaGiai.value}`);
    tranDauList.value = res.data;
};

const fetchCauHinhVe = async () => {
    if (!selectedMatch.value) return;
    const res = await axios.get(`/cauhinhve/trandau/${selectedMatch.value}`);
    cauHinhVeList.value = res.data;
};

const deleteCauHinhVe = async (id) => {
    if (!confirm("Xóa cấu hình vé này?")) return;
    await axios.delete(`/cauhinhve/id/${id}`);
    fetchCauHinhVe();
};

// --- Xử lý sự kiện
const onGiaiDauChange = () => {
    selectedMuaGiai.value = "";
    selectedMatch.value = "";
    muaGiaiList.value = [];
    tranDauList.value = [];
    cauHinhVeList.value = [];
    fetchMuaGiaiByGiaiDau();
};

const onMuaGiaiChange = () => {
    selectedMatch.value = "";
    tranDauList.value = [];
    cauHinhVeList.value = [];
    fetchTranDauByMuaGiai();
};

const getMatchName = (td) => {
    const doiNha = td.doiNha || "Chưa xác định";
    const doiKhach = td.doiKhach || "Chưa xác định";
    const date = new Date(td.ngayBatDau).toLocaleDateString("vi-VN");
    return `${doiNha} vs ${doiKhach} - ${date}`;
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
};

const handleOpenForm = (mode, config = null) => {
    formMode.value = mode;

    if (mode === "add") {
        formData.value = {
            maTranDau: selectedMatch.value,
            loaiVe: "Thường",
            khuVuc: "",
            hangGhe: "",
            soGheBatDau: 1,
            soGheKetThuc: 10,
            giaVe: 100000,
        };
    } else {
        formData.value = {
            ...config,
            _id: config._id,
        };
    }

    formName.value = mode === "add" ? "Thêm cấu hình vé" : "Chỉnh sửa cấu hình vé";
    formStore.openForm(formName.value);
};

// --- Lifecycle
onMounted(() => {
    fetchGiaiDau();
});
</script>

<style scoped>
.table {
    font-size: 0.9rem;
}

.card {
    border-radius: 12px;
}

select.form-select,
button.btn {
    border-radius: 6px;
}

.badge {
    font-size: 0.75rem;
}
</style>