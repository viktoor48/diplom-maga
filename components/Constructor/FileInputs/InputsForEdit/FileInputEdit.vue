<script setup lang="ts">
import { documentLink } from "~/utils/documentLink";
import { getCoverName } from "~/utils/getCoverName";

const emit = defineEmits(["clearFile", "createDocument"]);

const { fileValue, fileTitle } = defineProps<{ fileValue: string; fileTitle: string }>();
const route = useRoute();

const fileName = ref<string>("");
fileName.value = getCoverName(fileValue);

let lastDotIndex = fileValue.lastIndexOf(".");
let extension = fileValue.substring(lastDotIndex + 1);

let icon = ref("");

switch (extension) {
  case "pdf":
    icon.value = "/admin/images/file-formats/pdf-format.svg";
    break;
  case "doc":
  case "docx":
    icon.value = "/admin/images/file-formats/doc-format.svg";
    break;
  default:
    icon.value = "/admin/images/file-formats/doc-format.svg";
    break;
}
</script>

<template>
  <div class="flex p-4 gap-3 pl-3.5 rounded-xl border border-gray-300 bg-white items-center h-[4.625rem]">
    <img :src="icon" alt="Файл" class="min-w-10 max-w-10 h-10 rounded-l-xl text-center object-fill" />
    <div class="flex h-full w-full items-center">
      <div class="flex flex-col gap-1 mr-auto">
        <span class="font-medium text-sm text-[#101828]">{{ fileName }}</span>
        <span class="text-xs text-[#474a52]">1 МБ</span>
      </div>
      <div class="flex gap-3 items-center ml-auto">
        <nuxt-link :to="documentLink(`${fileValue}`)" target="_blank">
          <img src="/assets/images/icons/download-file-icon.svg" alt="Скачать" class="w-5 hover:opacity-80 duration-300" />
        </nuxt-link>
        <div class="w-[1px] h-6 bg-gray-300"></div>
        <img src="/assets/images/icons/delete-pic-icon.svg" alt="Удалить" class="w-5 cursor-pointer hover:opacity-80 duration-300" @click="emit('clearFile')" />
        <div v-if="route.path !== `/documents/${route.params.id}`" class="w-[1px] h-6 bg-gray-300"></div>
        <button
          v-if="route.path !== `/documents/${route.params.id}`"
          class="bg-[#B9E9AE] rounded-lg py-2 px-3 hover:bg-[#86C577] duration-300"
          :class="{ 'text-[#A0A0A0] bg-[#EFEFEF] hover:bg-[#EFEFEF]': !fileTitle }"
          :disabled="!fileTitle"
          @click="emit('createDocument')"
        >
          Добавить
        </button>
      </div>
    </div>
  </div>
</template>
