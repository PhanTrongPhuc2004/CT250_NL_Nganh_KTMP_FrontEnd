<!-- src/pages/admin/ticketManagement/components/TicketStats.vue -->
<script setup>
defineProps({
    stats: {
        type: Object,
        required: true,
        default: () => ({ total: 0, sold: 0, available: 0, revenue: 0 })
    }
});
</script>

<template>
    <div class="row mb-4">
        <!-- Tổng vé -->
        <div class="col-md-3">
            <div class="card text-center bg-primary text-white">
                <div class="card-body">
                    <h5>{{ stats.total }}</h5>
                    <p>Tổng vé</p>
                </div>
            </div>
        </div>

        <!-- Đã bán -->
        <div class="col-md-3">
            <div class="card text-center bg-success text-white">
                <div class="card-body">
                    <h5>{{ stats.sold }}</h5>
                    <p>Đã bán</p>
                </div>
            </div>
        </div>

        <!-- Còn lại -->
        <div class="col-md-3">
            <div class="card text-center bg-warning text-white">
                <div class="card-body">
                    <h5>{{ stats.available }}</h5>
                    <p>Còn lại</p>
                </div>
            </div>
        </div>

        <!-- Doanh thu -->
        <div class="col-md-3">
            <div class="card text-center bg-info text-white">
                <div class="card-body">
                    <h5>{{ stats.revenue.toLocaleString('vi-VN') }}đ</h5>
                    <p>Doanh thu</p>
                </div>
            </div>
        </div>
    </div>
</template>