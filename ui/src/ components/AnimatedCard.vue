<template>
      <b-button class="mx-2 mb-2"
      size = 'lg'
      :variant = "card.locationType === 'last-card-played' ? 'danger' : 'light'" 
      @click="pickCard(card.id)">{{card.suit + ' ' + card.rank}} </b-button>
  </template>
  
  <script setup lang="ts">
  
  import { Card, CardId, areCompatible, getLastPlayedCard} from "../../../server/model"
  
  // props
  interface Props {
    card?: Card
    // campatible: boolean
  }
  
  // default values for props
  const props = withDefaults(defineProps<Props>(), {
    card: undefined,
    // compatible: true
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