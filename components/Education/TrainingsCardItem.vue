<script setup lang="ts">
import { useFormattedDate } from "~/composables/useFormattedDate";
import { useTrainings } from "~/composables/requests/useTrainings";

const { deleteTrainingById } = useTrainings();

const { card } = defineProps<{ card: any }>();
const emit = defineEmits(["refreshTrainingsList"]);

const formattedStartDate = computed(() => useFormattedDate(card.date_start));
const formattedEndDate = computed(() => useFormattedDate(card.date_end));

const deleteCard = () => {
  deleteTrainingById(card.id, { method: "DELETE" });
  emit("refreshTrainingsList");
};
</script>
<template>
  <li class="flex flex-col gap-6 h-[15rem] bg-gray-50 p-6 rounded-[1.25rem] hover:bg-[#F4FCF3] hover:shadow-md duration-300">
    <span class="text-[#667085] leading-[1.3]">{{ formattedStartDate }} - {{ formattedEndDate }}</span>
    <h3 class="text-[1.375rem] leading-[1.2] font-medium line-clamp-3" v-html="card.title"></h3>
    <EditDeleteButtons :to="`education/trainings/${card.id}`" class="mt-auto" @delete="deleteCard" />
  </li>
</template>
