<script setup lang="ts">
import type { Video } from "~/types";

const props = defineProps<{
  videoSrc: Video;
}>();

const isPlaying = ref(false);

const handlePause = () => {
  isPlaying.value = false;
};

const handlePlay = () => {
  isPlaying.value = true;
};
</script>

<template>
  <div class="relative cursor-pointer w-full h-[27.25rem] max-sm:h-[13.313rem]">
    <video class="w-full h-full rounded-3xl object-cover" v-if="props.videoSrc" controls @play="handlePlay" @pause="handlePause">
      <source :src="props.videoSrc.url" />
    </video>
    <span
      class="absolute left-[1.5rem] top-[1.5rem] max-sm:left-[0.73rem] max-sm:right-[0.73rem] text-white text-[1.5rem] leading-[130%] max-sm:text-[1rem]"
      v-if="props.videoSrc.title && !isPlaying"
      >{{ props.videoSrc.title }}</span
    >
  </div>
</template>

<style scoped></style>
