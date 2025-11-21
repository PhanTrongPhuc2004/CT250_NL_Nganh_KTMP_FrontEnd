<template>
    <div>
        <div class="d-flex">
            <h2>Danh sách cầu thủ của trận đấu</h2>
            <button class="btn " @click="handleParamPlayer">Cập nhật thông số</button>
        </div>
        <div>
            <div v-for="(player, index) in players" class="col-md-3">
            <PlayerCard :item="player" :menu-items="menuFields"/>
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

const router = useRouter();
const route = useRoute();

const matchId = route.params.matchId
const players = ref([])
const showForm = ref(false)
const ortherField = ref([])
const matchInfo = ref({})
const thongSoCauThuApi = `${import.meta.env.VITE_API_BE_BASE_URL}/thongsocauthu`
const getPlayerByMatchId = async () => {
    try {
        const response = await instance.get(`${import.meta.env.VITE_API_BE_BASE_URL}/cauthu/trandau/id/${matchId}`)
        players.value = response.data.map((player) => {
            return {
                name: player.hoVaTen,
                _id: player.maNguoiDung
            }
        })
        console.log("danh sach cau thu", players.value)
        return players.value
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
            children: await getPlayerByMatchId()
        }
]
    showForm.value = !showForm.value;
}

onMounted(async () => {
    await getMatch()
    await getPlayerByMatchId()
})
</script>