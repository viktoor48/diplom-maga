<script setup lang="ts">
import { useDevelopments } from "~/composables/requests/useDevelopments";

const { deleteDevelopmentById } = useDevelopments();

const { card } = defineProps<{ card: any }>();
const emit = defineEmits(["refreshDevelopmentsList"]);

const deleteCard = () => {
  deleteDevelopmentById(card.id, { method: "DELETE" });
  emit("refreshDevelopmentsList");
};
</script>
<template>
  <li class="flex flex-col gap-6 h-[15rem] bg-gray-50 p-6 rounded-[1.25rem] hover:bg-[#F4FCF3] hover:shadow-md duration-300">
    <span class="text-[#667085] leading-[1.3] h-5"></span>
    <h3 class="text-[1.375rem] leading-[1.2] font-medium line-clamp-3" v-html="card.title"></h3>
    <EditDeleteButtons :to="`/education/developments/${card.id}`" class="mt-auto" @delete="deleteCard" />
  </li>
</template>
