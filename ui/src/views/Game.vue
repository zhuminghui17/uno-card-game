<template>
  <div>
    <b-button class="mx-2 my-2" size="sm" @click="socket.emit('new-game')">New Game</b-button>
    <b-badge class="mr-2 mb-2" :variant="myTurn ? 'primary' : 'secondary'">turn: {{ currentTurnPlayerIndex }}</b-badge>
    <b-badge class="mr-2 mb-2">{{ phase }}</b-badge>  
    <b-button class="mx-2 my-2" size="sm">players with 2 card or less: {{playersWithTwoCardsList.length === 0 ? 'None' : playersWithTwoCardsList}}</b-button>  
    <div>
      <b-button class="mx-2 my-2" size="sm" variant = 'light' >Card Illustration:</b-button>   
      <b-button class="mx-2 my-2" size="sm" variant = 'danger' >Last Card Played</b-button>       
      <b-button class="mx-2 my-2" size="sm" variant = 'info' >Unused</b-button>   
    </div>    
    <div
      v-for="card in cards"
      :key="card.id"
      @click="playCard(card.id)" 
    >
      <AnimatedCard :card = card :compatible = "compatible(card, lastCard)" @picked = "playCard"  />
    </div>
    <b-button class="mx-2 my-2" size="sm" @click="drawCard" :disabled="!myTurn">Draw Card</b-button> 
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue'
import { io } from "socket.io-client"
import { Card, GamePhase, Action, formatCard, CardId, areCompatible} from "../../../server/model"
import AnimatedCard from '@/ components/AnimatedCard.vue'; // already import

// props
interface Props {
  playerIndex?: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  playerIndex: "all",
})

const socket = io()
let x = props.playerIndex
let playerIndex: number | "all" = parseInt(x) >= 0 ? parseInt(x) : "all"
console.log("playerIndex", JSON.stringify(playerIndex))
socket.emit("player-index", playerIndex)

const cards: Ref<Card[]> = ref([])
const currentTurnPlayerIndex = ref(-1)
const phase = ref("")
const playCount = ref(-1)
const playersWithTwoCardsList: Ref<number[]> = ref([])

const myTurn = computed(() => currentTurnPlayerIndex.value === playerIndex && phase.value !== "game-over")

const lastCard = computed(() => cards.value.find(card => card.locationType === 'last-card-played'))

function compatible(card:Card, lastCard:Card|undefined){
  if (typeof lastCard === 'undefined'){
    return true
  }
  else {return areCompatible(card,lastCard)}
}

socket.on("all-cards", (allCards: Card[]) => {
  cards.value = allCards
})

socket.on("updated-cards", (updatedCards: Card[]) => {
  applyUpdatedCards(updatedCards)
})

socket.on("game-state", (newCurrentTurnPlayerIndex: number, newPhase: GamePhase, newPlayCount: number, newPlayersWithTwoCards: number[]) => {
  currentTurnPlayerIndex.value = newCurrentTurnPlayerIndex
  phase.value = newPhase
  playCount.value = newPlayCount
  playersWithTwoCardsList.value = newPlayersWithTwoCards
})

function doAction(action: Action) {
  return new Promise<Card[]>((resolve, reject) => {
    socket.emit("action", action)
    socket.once("updated-cards", (updatedCards: Card[]) => {
      resolve(updatedCards)
    })
  })
}

async function drawCard() {
  if (typeof playerIndex === "number") {
    const updatedCards = await doAction({ action: "draw-card", playerIndex })
    if (updatedCards.length === 0) {
      alert("didn't work")
    }
  }
}

async function playCard(cardId: CardId) {
  if (typeof playerIndex === "number") {
    const updatedCards = await doAction({ action: "play-card", playerIndex, cardId })
    if (updatedCards.length === 0) {
      alert("didn't work")
    }
  }
}

async function applyUpdatedCards(updatedCards: Card[]) {
  for (const x of updatedCards) {
    const existingCard = cards.value.find(y => x.id === y.id)
    if (existingCard) {
      Object.assign(existingCard, x)
    } else {
      cards.value.push(x)
    }
  }
}
</script>