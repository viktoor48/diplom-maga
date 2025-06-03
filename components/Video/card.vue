<script setup lang="ts">
import type { VideoCard } from "~/types";
import { useVideos } from "~/composables/requests/useVideos";

const { deleteVideoById } = useVideos();

const props = defineProps<{
  video: VideoCard;
}>();
const emit = defineEmits(["refresh-videos-list"]);

const isPlaying = ref(false);

const handlePause = () => {
  isPlaying.value = false;
};

const handlePlay = () => {
  isPlaying.value = true;
};

const deleteCard = async () => {
  await deleteVideoById(props.video.id, { method: "DELETE" });
  emit("refresh-videos-list");
};
</script>

<template>
  <li class="relative h-[14.4rem] cursor-pointer pt-3 px-3 pb-[0.188rem] bg-gray-50 rounded-3xl hover:bg-[#F4FCF3] hover:shadow-md duration-300">
    <video class="rounded-3xl w-full h-[11rem] object-cover" v-if="props.video" controls @play="handlePlay" @pause="handlePause">
      <source :src="props.video.video_url" />
    </video>
    <span
      class="absolute left-[1.5rem] top-[1.5rem] max-sm:left-[0.73rem] max-sm:right-[0.73rem] text-white text-[1.5rem] leading-[130%] max-sm:text-[1rem]"
      v-if="props.video.title && !isPlaying"
      >{{ props.video.title }}</span
    >
    <EditDeleteButtons :hide-edit-button="true" @delete="deleteCard" />
  </li>
</template>

<style scoped></style>
