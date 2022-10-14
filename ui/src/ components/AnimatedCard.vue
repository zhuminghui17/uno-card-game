<template>
  <div :v-if = "!(card.locationType != 'unused')">
    <b-button class="mx-2 mb-2"
      size = 'lg'
      :variant = "card.locationType === 'last-card-played' ? 'danger' : card.locationType === 'unused' ? 'info': compatible && myTurn && card.locationType === 'player-hand' ? 'outline-danger' : 'light' " 
      @click="pickCard(card.id)">{{card.suit + ' ' + card.rank}} </b-button> 
  </div>
  </template>

  <script setup lang="ts">
  import { Card, CardId} from "../../../server/model"
  
  // props
  interface Props {
    card?: Card
    compatible: boolean
    myTurn: boolean
  }
  
  // default values for props
  const props = withDefaults(defineProps<Props>(), {
    card: undefined,
    compatible: false,
    myTurn: true
  })

  // events
  const emit = defineEmits<{
    (e:'picked', cardId:CardId):void
  }>()

  function pickCard(cardId:CardId){
    emit('picked',cardId)
  }
  </script>