<script setup lang="ts">
import type { NavigationButtons } from "~/types";

const emit = defineEmits<{
  (e: "prev"): void;
  (e: "next"): void;
}>();

const prev = () => {
  emit("prev");
};

const next = () => {
  emit("next");
};

const props = defineProps<NavigationButtons>();

const getStyle = () => {};
</script>

<template>
  <div class="w-[56.25rem] max-sm:w-full mx-auto flex justify-end items-center gap-1 px-6 pt-4">
    <button
      @click="prev"
      class="p-2 border border-[#D0D5DD] hover:opacity-70 transition-all duration-300 rounded-2xl flex justify-center items-center w-10 h-10"
      :class="{ 'border-[#98A2B3]': props.inFullScreen === true }"
    >
      <svg class="max-w-full text-[#475467]" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <path
          class="svg-path"
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="#475467"
          :class="{ 'stroke-[#F2F4F7]': props.inFullScreen === true }"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <div
      class="text-[#475467] text-[1rem] w-[3.5rem] font-medium leading-[120%] flex gap-1 justify-center"
      :class="{ 'text-[#F2F4F7]': props.inFullScreen === true }"
    >
      <div>
        {{ props.currentSlide }}
      </div>
      <div>/</div>
      <div>{{ props.totalSlides }}</div>
    </div>
    <button
      @click="next"
      class="p-2 border border-[#D0D5DD] hover:opacity-70 transition-all duration-300 rounded-2xl flex justify-center items-center w-10 h-10"
      :class="{ 'border-[#98A2B3]': props.inFullScreen === true }"
    >
      <svg class="max-w-full icon-grey" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="#475467"
          :class="{ 'stroke-[#F2F4F7]': props.inFullScreen === true }"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped></style>
