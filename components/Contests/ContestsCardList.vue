<script setup lang="ts">
import ContestsCardItem from "./ContestsCardItem.vue";

const { cards } = defineProps<{ cards: any }>();
const emit = defineEmits(["refreshContestsList"]);
</script>
<template>
  <ul class="grid grid-cols-3 gap-5 relative pb-4">
    <ContestsCardItem v-for="card in cards" :card="card" :key="card.id" @refresh-contests-list="emit('refreshContestsList')" />
  </ul>
</template>
