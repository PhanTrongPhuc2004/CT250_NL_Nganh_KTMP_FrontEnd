<!-- src/pages/user/trainingManagement/TrainingManagement.vue -->
<template>
    <div class="container py-4">
        <!-- Tiêu đề -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-semibold text-dark m-0">Quản lý lịch tập luyện</h4>
            <button class="btn btn-sm text-white" style="background-color: #8b2c31" @click="handleOpenForm('add')"
                :disabled="!selectedMatch">
                <i class="bi bi-plus-lg me-1"></i> Thêm lịch tập
            </button>
        </div>

        <!-- Bộ lọc: Đội bóng → Đội hình → Trận đấu -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <!-- Đội bóng -->
                    <div class="col-md-4">
                        <label class="form-label fw-medium text-muted small">Đội bóng</label>
                        <select class="form-select form-select-sm" v-model="selectedDoiBong" @change="onDoiBongChange">
                            <option value="">Chọn đội bóng</option>
                            <option v-for="db in doiBongList" :key="db._id" :value="db.maDoiBong">
                                {{ db.tenDoiBong }}
                            </option>
                        </select>
                    </div>

                    <!-- Đội hình -->
                    <div class="col-md-4">
                        <label class="form-label fw-medium text-muted small">Đội hình</label>
                        <select class="form-select form-select-sm" v-model="selectedDoiHinh" @change="onDoiHinhChange"
                            :disabled="!selectedDoiBong">
                            <option value="">Chọn đội hình</option>
                            <option v-for="dh in doiHinhList" :key="dh._id" :value="dh.maDoiHinh">
                                {{ dh.tenDoiHinh }}
                            </option>
                        </select>
                    </div>

                    <!-- Trận đấu -->
                    <div class="col-md-4">
                        <label class="form-label fw-medium text-muted small">Trận đấu</label>
                        <select class="form-select form-select-sm" v-model="selectedMatch" @change="fetchLichTap"
                            :disabled="!selectedDoiHinh">
                            <option value="">Chọn trận đấu</option>
                            <option v-for="td in tranDauList" :key="td._id" :value="td.maTranDau">
                                {{ getMatchName(td) }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bảng lịch tập -->
        <div class="card bordersthe-0 shadow-sm" v-if="selectedMatch">
            <div class="card-body p-0">
                <table class="table align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center" style="width: 40px">#</th>
                            <th @click="sortBy('maDoiHinh')" class="sortable">Đội hình <i
                                    :class="sortIcon('maDoiHinh')"></i></th>
                            <th @click="sortBy('diaDiem')" class="sortable">Địa điểm <i
                                    :class="sortIcon('diaDiem')"></i></th>
                            <th @click="sortBy('ngayBatDau')" class="sortable">Ngày <i
                                    :class="sortIcon('ngayBatDau')"></i></th>
                            <th @click="sortBy('thoiGian')" class="sortable">Giờ <i :class="sortIcon('thoiGian')"></i>
                            </th>
                            <th>Nội dung</th>
                            <th class="text-center" style="width: 120px">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(lich, index) in sortedLichTapList" :key="lich._id">
                            <td class="text-center text-muted">{{ index + 1 }}</td>
                            <td>
                                <span class="badge bg-info text-dark small px-2 py-1">
                                    {{ lich.tenDoiHinh || lich.maDoiHinh }}
                                </span>
                            </td>
                            <td>{{ lich.diaDiem }}</td>
                            <td>{{ formatDate(lich.ngayBatDau) }}</td>
                            <td>{{ lich.thoiGian }}</td>
                            <td class="text-muted small">{{ lich.noiDung || '—' }}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-secondary me-1"
                                    @click="handleOpenForm('edit', lich)">
                                    <FontAwesomeIcon icon="fa-solid fa-pen" />
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="deleteLichTap(lich._id)">
                                    <FontAwesomeIcon icon="fa-solid fa-trash" />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="lichTapList.length === 0">
                            <td colspan="7" class="text-center text-muted py-3 fst-italic">
                                Chưa có lịch tập cho trận đấu này.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Không chọn trận đấu -->
        <div v-else class="text-center text-muted py-5">
            <i class="bi bi-calendar-check fs-1"></i>
            <p class="mt-3">Vui lòng chọn trận đấu để xem lịch tập luyện</p>
        </div>

        <!-- Form -->
        <TrainingForm v-if="formStore.isCurrent(formName)" :mode="formMode" :initial-data="formData"
            :api="formMode === 'edit' ? `/tapluyen/id/${formData._id}` : '/tapluyen'"
            :method="formMode === 'add' ? 'POST' : 'PUT'" @success="fetchLichTap" @closed="formStore.closeForm" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import axios from "@/utils/axios";
import TrainingForm from "./components/TrainingForm.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useFormStore } from "@/stores/formStore";

const formStore = useFormStore();

// --- Dữ liệu
const doiBongList = ref([]);
const doiHinhList = ref([]);
const tranDauList = ref([]);
const lichTapList = ref([]);

const selectedDoiBong = ref("");
const selectedDoiHinh = ref("");
const selectedMatch = ref("");

const formMode = ref("add");
const formData = ref({});
const formName = ref("");

// --- Sắp xếp
const sortKey = ref("");
const sortOrder = ref(1);

const sortBy = (key) => {
    if (sortKey.value === key) sortOrder.value *= -1;
    else { sortKey.value = key; sortOrder.value = 1; }
};

const sortIcon = (key) => {
    if (sortKey.value !== key) return "bi bi-dash";
    return sortOrder.value === 1 ? "bi bi-arrow-up" : "bi bi-arrow-down";
};

const sortedLichTapList = computed(() => {
    if (!sortKey.value) return lichTapList.value;
    return [...lichTapList.value].sort((a, b) => {
        let valA = a[sortKey.value], valB = b[sortKey.value];
        if (sortKey.value === "ngayBatDau") {
            valA = new Date(valA); valB = new Date(valB);
        }
        return (valA > valB ? 1 : -1) * sortOrder.value;
    });
});

// --- API
const fetchDoiBong = async () => {
    const res = await axios.get("/doibong");
    doiBongList.value = res.data;
};

const fetchDoiHinhByDoiBong = async () => {
    if (!selectedDoiBong.value) return;
    const res = await axios.get(`/doihinh/doibong/ma/${selectedDoiBong.value}`);
    doiHinhList.value = res.data;
};

const fetchTranDauByDoiHinh = async () => {
    if (!selectedDoiHinh.value) return;
    const res = await axios.get(`/trandau?maDoiHinh=${selectedDoiHinh.value}`);
    tranDauList.value = res.data;
};

const fetchLichTap = async () => {
    if (!selectedMatch.value) return;
    const res = await axios.get(`/trandau/${selectedMatch.value}/lichtap`);
    lichTapList.value = res.data.map(lich => ({
        ...lich,
        tenDoiHinh: lich.maDoiHinh?.tenDoiHinh || lich.maDoiHinh
    }));
};

const deleteLichTap = async (id) => {
    if (!confirm("Xóa lịch tập này?")) return;
    await axios.delete(`/tapluyen/id/${id}`);
    fetchLichTap();
};

// --- Sự kiện
const onDoiBongChange = async () => {
    selectedDoiHinh.value = "";
    selectedMatch.value = "";
    doiHinhList.value = [];
    tranDauList.value = [];
    lichTapList.value = [];
    await nextTick();
    fetchDoiHinhByDoiBong();
};

const onDoiHinhChange = async () => {
    selectedMatch.value = "";
    tranDauList.value = [];
    lichTapList.value = [];
    await nextTick();
    fetchTranDauByDoiHinh();
};

const getMatchName = (td) => {
    const doiNha = td.doiNha || "Đội nhà";
    const doiKhach = td.doiKhach || "Đội khách";
    const date = new Date(td.ngayBatDau).toLocaleDateString("vi-VN");
    return `${doiNha} vs ${doiKhach} - ${date}`;
};

const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', {
    weekday: 'short', day: 'numeric', month: 'short'
});

const handleOpenForm = (mode, lich = null) => {
    formMode.value = mode;
    if (mode === "add") {
        formData.value = {
            maTranDau: selectedMatch.value,
            maDoiHinh: selectedDoiHinh.value,
            diaDiem: "",
            ngayBatDau: "",
            thoiGian: "",
            noiDung: ""
        };
    } else {
        formData.value = { ...lich };
    }
    formName.value = mode === "add" ? "Thêm lịch tập" : "Chỉnh sửa lịch tập";
    formStore.openForm(formName.value);
};

// --- Lifecycle
onMounted(() => {
    fetchDoiBong();
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

.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable i {
    font-size: 0.8rem;
    margin-left: 4px;
    opacity: 0.5;
}

.sortable:hover i {
    opacity: 1;
}
</style>