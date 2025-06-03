<script setup lang="ts">
import { getFormattedPhotosCount } from "~/utils/formatters";
import { useFormattedDate } from "~/composables/useFormattedDate";
import { usePhotoArchives } from "~/composables/requests/usePhotoArchives";

import EditDeleteButtons from "../EditDeleteButtons.vue";

const { deleteArchiveById } = usePhotoArchives();

const { card } = defineProps<{ card: any }>();
const emit = defineEmits(["refreshPhotoArchivesList"]);

const imageConfig = useRuntimeConfig().public.imageBase;

const deleteCard = () => {
  deleteArchiveById(card.id, { method: "DELETE" });
  emit("refreshPhotoArchivesList");
};
</script>

<template>
  <li class="flex flex-col relative z-10 items-start w-full h-[32.125rem] bg-gray-50 rounded-[1.5rem] hover:bg-[#F4FCF3] hover:shadow-md duration-300">
    <nuxt-img :src="`${imageConfig}${card.photo}`" :placeholder="true" format="webp" class="h-[20.125rem] w-full rounded-[1.5rem] object-cover" />
    <div class="absolute top-4 right-4 text-[#208656] bg-[#EBF7EB] py-2 px-3 rounded-xl">{{ getFormattedPhotosCount(+card.count) }}</div>
    <div class="flex flex-col gap-4 p-6">
      <h2 class="flex h-[4.125rem] text-[1.375rem] leading-[1.4] font-medium title-line-clamp" v-html="card.title"></h2>
      <span class="text-[0.875rem] text-[#829086]">{{ useFormattedDate(card.date) }}</span>
    </div>
    <EditDeleteButtons :to="`photoarchive/${card.id}`" class="mt-auto px-6 pb-6 w-full" @delete="deleteCard" />
  </li>
</template>

<style scoped>
.title-line-clamp {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.024rem !important;
}
</style>
