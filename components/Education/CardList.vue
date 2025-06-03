<script setup lang="ts">
import TrainingsCardItem from "./TrainingsCardItem.vue";
import CoursesCardItem from "./CoursesCardItem.vue";
import DevelopmentsCardItem from "./DevelopmentsCardItem.vue";

const { cards, tabs } = defineProps<{ cards: any; tabs: string }>();

const emit = defineEmits(["refreshTrainingsList", "refreshCoursesList", "refreshDevelopmentsList"]);

const refreshTrainingsList = () => {
  emit("refreshTrainingsList");
};

const refreshCoursesList = () => {
  emit("refreshCoursesList");
};

const refreshDevelopmentsList = () => {
  emit("refreshDevelopmentsList");
};
</script>
<template>
  <ul class="grid grid-cols-3 gap-5 relative pb-4">
    <TrainingsCardItem v-if="tabs === 'trainings'" :card="card" v-for="card in cards" :key="card.id" @refresh-trainings-list="refreshTrainingsList" />
    <CoursesCardItem v-if="tabs === 'courses'" :card="card" v-for="card in cards" :key="card.id" @refresh-courses-list="refreshCoursesList" />
    <DevelopmentsCardItem
      v-if="tabs === 'developments'"
      :card="card"
      v-for="card in cards"
      :key="card.id"
      @refresh-developments-list="refreshDevelopmentsList"
    />
  </ul>
</template>
