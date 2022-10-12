<template>
      <b-button class="mx-2 mb-2" :pill = "false"
                :size = "card.locationType === 'player-hand' ? 'lg' : 'sm'" 
      :variant = "card.locationType === 'last-card-played' ? 'danger' : 'light'" >{{card.suit + ' ' + card.rank}} </b-button>
  </template>
  
  <script setup lang="ts">
  
  import { Card, GamePhase, Action, formatCard, CardId } from "../../../server/model"
  
  // props
  interface Props {
    card?: Card
  }
  
  // default values for props
  const props = withDefaults(defineProps<Props>(), {
    card: undefined,
  })

  // events
  // const emit = defineEmits<{
  //   (e: 'change', card: Card): void
  // }>()

  // function undoRedo(undoRedoIndex: number) {
  //   emit("change", undoRedoIndex)
  // }
  </script>