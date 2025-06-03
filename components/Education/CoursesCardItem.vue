<script setup lang="ts">
import { useFormattedDate } from "~/composables/useFormattedDate";
import { useCourses } from "~/composables/requests/useCourses";

const { deleteCourseById } = useCourses();

const { card } = defineProps<{ card: any }>();
const emit = defineEmits(["refreshCoursesList"]);

const formattedStartDate = computed(() => useFormattedDate(card.date_start));
const formattedEndDate = computed(() => useFormattedDate(card.date_end));

const deleteCard = () => {
  deleteCourseById(card.id, { method: "DELETE" });
  emit("refreshCoursesList");
};
</script>
<template>
  <li class="flex flex-col gap-6 h-[15rem] bg-gray-50 p-6 rounded-[1.25rem] hover:bg-[#F4FCF3] hover:shadow-md duration-300">
    <span class="text-[#667085] leading-[1.3]">{{ formattedStartDate }} - {{ formattedEndDate }}</span>
    <h3 class="text-[1.375rem] leading-[1.2] font-medium line-clamp-3" v-html="card.title"></h3>
    <EditDeleteButtons :to="`/education/courses/${card.id}`" class="mt-auto" @delete="deleteCard" />
  </li>
</template>
