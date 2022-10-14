<template>
    <!-- Todo:
    finish the assessibility requirement 
    -->
    <div class = 'container' style="width: 500px;">
        <b-overlay :show="busy" rounded="sm">
            <b-card
            class="my-5"
            style="max-width: 30rem;"
            >
            <b-form>
            <b-form-group
            id = 'input-group-number-of-deck'
            label = 'Number of Deck:'
            description = 'Please only input numbers'
            >
            <b-form-input
            id = 'input-for-number-of-deck'
            placeholder="number of deck"
            v-model.number="numOfDeck"
            >
            </b-form-input>
            </b-form-group>

            <b-form-group
            id = 'input-group-rank-limit'
            label = 'Maximun Number of Rank:'
            description = 'Please only input numbers'
            >
            <b-form-input
            id = 'input-for-rank-limit'
            placeholder="maximun number of rank"
            v-model.number="rankLimit"
            >
            </b-form-input>
            </b-form-group>

            <b-button variant="primary" @click="updateConfig">Submit</b-button>
            <b-button class = 'mx-2' variant="danger" type = 'reset'>Reset</b-button>

        </b-form>
        </b-card>
        </b-overlay>

    

    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue'
import { io } from "socket.io-client"

const socket = io()
const numOfDeck = ref(-1)
const rankLimit = ref(-2)
const busy = ref(false)

onMounted(() => {  // last step of q7
    /* call to emit get-config goes here */ 
    socket.emit("get-config")
})

socket.on('get-config-reply', (config) => {
        numOfDeck.value = config.numOfDeck
        rankLimit.value = config.rankLimit
    })

async function updateConfig() {
    socket.emit('update-config', {numOfDeck: numOfDeck.value, rankLimit: rankLimit.value})
    busy.value = true

    let result = await new Promise((resolve, reject) => {
        socket.on('update-config-reply', (result) => {
            resolve(result)
        })
    })
    busy.value = false
}


</script>






<style scoped>
.container {
  width: auto;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%)
}
</style>