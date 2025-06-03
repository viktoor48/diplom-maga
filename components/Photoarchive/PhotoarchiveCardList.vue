<script setup lang="ts">
import PhotoarchiveCardItem from "./PhotoarchiveCardItem.vue";

const { cards } = defineProps<{ cards: any }>();
const emit = defineEmits(["refreshPhotoArchivesList"]);
</script>

<template>
  <ul class="grid grid-cols-3 gap-5 relative pb-4">
    <PhotoarchiveCardItem v-for="card in cards" :key="card.id" :card="card" @refresh-photo-archives-list="emit('refreshPhotoArchivesList')" />
  </ul>
</template>
