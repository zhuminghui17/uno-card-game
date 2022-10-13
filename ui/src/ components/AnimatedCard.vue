<template>
      <b-button class="mx-2 mb-2"
      size = 'lg'
      :variant = "card.locationType === 'last-card-played' ? 'danger' : card.locationType === 'unused' ? 'info': 'light'" 
      @click="pickCard(card.id)">{{card.suit + ' ' + card.rank}} </b-button>
  </template>

  <script setup lang="ts">
  //       :variant = "card.locationType === 'last-card-played' ? 'danger' : 'light'" 
  //:variant = "card.locationType === 'last-card-played' ? 'danger' : card.locationType === 'unused' ? 'info': 'light'" 
  import { Card, CardId, areCompatible, getLastPlayedCard} from "../../../server/model"
  import {computed} from "vue"
  
  // props
  interface Props {
    card?: Card
    campatible?: boolean
  }
  
  // default values for props
  const props = withDefaults(defineProps<Props>(), {
    card: undefined,
    compatible: true
  })

  const canPlay = computed(() => {
  return (props.compatible && (props.card.locationType === "player-hand"))
})
  // events

  //define a emit called 
  const emit = defineEmits<{
    (e:'picked', cardId:CardId):void
  }>()

  function pickCard(cardId:CardId){
    // emit the particular event called picked 
    emit('picked',cardId)
  }
  </script>