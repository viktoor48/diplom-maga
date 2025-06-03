<script setup lang="ts">
import { getCoverName } from "~/utils/getCoverName";

const emit = defineEmits(["clearFile"]);

const { imageValue, errors } = defineProps<{ imageValue: string; errors: Array<string> }>();

const imageName = computed(() => {
  return getCoverName(imageValue);
});
const hasErrors = computed(() => errors && errors.length > 0);
</script>

<template>
  <div class="flex rounded-xl border border-gray-300 bg-white items-center h-[4.625rem]">
    <div class="w-[9rem] h-full flex">
      <img :src="`${$config.public.imageBase}${imageValue}`" alt="Фото" class="w-full h-full rounded-l-xl content-center text-center object-cover" />
    </div>
    <div class="flex p-4 w-full items-center">
      <div class="flex flex-col gap-1 mr-auto">
        <span class="font-medium text-sm text-[#101828]">{{ imageName.toUpperCase() }}</span>
        <span class="text-[0.75rem] leading-[150%] text-[#667085]">1 МБ</span>
      </div>
      <div class="flex gap-2 items-center ml-auto">
        <nuxt-link :href="`${$config.public.imageBase}${imageValue}`" target="_blank">
          <img src="~/assets/images/icons/show-pic-icon.svg" alt="Скачать" class="w-5 mx-2 cursor-pointer hover:opacity-80 transition-all" />
        </nuxt-link>
        <div class="w-[1px] h-6 bg-gray-300"></div>
        <img
          src="~/assets/images/icons/delete-pic-icon.svg"
          alt="Удалить"
          class="w-5 mx-2 cursor-pointer hover:opacity-80 transition-all"
          @click="emit('clearFile')"
        />
        <div v-if="hasErrors" class="w-[1px] h-6 bg-gray-300"></div>
        <img v-if="hasErrors" src="~/assets/images/icons/alert.svg" class="w-5 mx-2 cursor-pointer hover:opacity-80 transition-all" />
      </div>
    </div>
  </div>
</template>
