<script setup lang="ts">
import { useProjects } from "~/composables/requests/useProjects";

const { deleteProjectById } = useProjects();

const { cards } = defineProps<{ cards: any }>();
const emit = defineEmits(["refreshProjectsList"]);

const deleteCard = (card: any) => {
  deleteProjectById(card.id, { method: "DELETE" });
  emit("refreshProjectsList");
};
</script>
<template>
  <ul class="grid grid-cols-3 gap-5 relative pb-4">
    <li v-for="card in cards" class="flex flex-col h-[15rem] bg-gray-50 p-6 rounded-[1.25rem] hover:bg-[#F4FCF3] hover:shadow-md duration-300">
      <h3 class="text-[1.375rem] leading-[1.2] font-medium line-clamp-3 h-[5.2rem] mb-[0.375rem]" v-html="card.title"></h3>
      <p class="text-[1rem] leading-[150%] line-clamp-3">{{ card.subtitle }}</p>
      <EditDeleteButtons :to="`projects/${card.id}`" class="mt-auto" @delete="deleteCard(card)" />
    </li>
  </ul>
</template>
