<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex h2 align-items-center gap-3" style="cursor: pointer; color: var(--primary-color);" @click="router.back()">
                <FontAwesomeIcon icon="fas fa-angle-left" />
            <h2 class="m-0">Danh sách cầu thủ của trận đấu</h2>
            </div>
            <button class="btn text-white" @click="handleParamPlayer" style="background-color: var(--primary-color)">Cập nhật thông số</button>
        </div>
        <div class="d-flex flex-wrap  pt-3 mt-3 border-top">
            <div v-for="(player, index) in players" class="col-md-4">
            <PlayerCard :item="player"/>
        </div>
        </div>
    </div>
    <Form 
        v-if="showForm" 
        form-name="Cập nhật thông số" 
        :input-fields="thongSoFields" 
        :orther-fields="ortherField" 
        :api="thongSoCauThuApi"
        :orther-data="{maTranDau: matchInfo?.maTranDau}"
        @closed="handleParamPlayer" 
        @submitted="handleParamPlayer" 
    />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import instance from '@/utils/axios';
import { onMounted, ref } from 'vue';
import PlayerCard from '@/components/common/cards/playerCard/PlayerCard.vue';
import Form from '@/components/common/form/Form.vue';
import { thongSoFields } from '../../../utils/constanst';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const router = useRouter();
const route = useRoute();

const matchId = route.params.matchId
const playersChoose = ref([])
const showForm = ref(false)
const ortherField = ref([])
const matchInfo = ref({})
const players = ref([])
const thongSoCauThuApi = `${import.meta.env.VITE_API_BE_BASE_URL}/thongsocauthu`
const getPlayerByMatchId = async () => {
    try {
        const response = await instance.get(`${import.meta.env.VITE_API_BE_BASE_URL}/cauthu/trandau/id/${matchId}`)
        playersChoose.value = response.data.map((player) => {
            return {
                name: player.hoVaTen,
                _id: player.maNguoiDung
            }
        })
        console.log("danh sach cau thu", players.value)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

const getMatch = async () => {
    try {
        const response = await instance.get(`${import.meta.env.VITE_API_BE_BASE_URL}/trandau/id/${matchId}`)
        matchInfo.value = response.data
        return response.data
    } catch (error) {
        console.log(error);
    }
}
const handleParamPlayer = async() => {
     ortherField.value = [
        {
            name: "maCauThu",
            type:'select',
            label: 'Chọn cầu thủ',
            required: true,
            children: playersChoose.value
        }
]
    showForm.value = !showForm.value;
}


onMounted(async () => {
    await getMatch()
    players.value = await getPlayerByMatchId()
})
</script>