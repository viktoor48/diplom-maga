<script setup lang="ts">
import { documentLink } from "~/utils/documentLink";

import BlockHeader from "../BlockHeader.vue";
import TextInputComponent from "../UI/TextInputComponent.vue";
import DropZoneMultiple from "../DropZoneMultiple.vue";

const emit = defineEmits(["deleteBlock", "moveUp", "moveDown"]);

const fileSize = ref<number>(5242880);
const fileFormats = ref<string>("application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document");
const fileType = ref<string>("file");

const previewImage = ref<string>("images/file-formats/doc-format.svg");
const deletingBlock = ref<boolean>(true);

const filesMultipleValue = defineModel<any>({
  default: {
    title: "",
    files: [],
  },
});

const updateFilesMultipleValue = (newFiles: any) => {
  filesMultipleValue.value.files = [...filesMultipleValue.value.files, ...newFiles];
};

const removeFile = (i: number) => {
  filesMultipleValue.value.files.splice(i, 1);
};

const moveUpFile = (i: number) => {
  if (i > 0) {
    const file = filesMultipleValue.value.files[i];
    filesMultipleValue.value.files.splice(i, 1);
    filesMultipleValue.value.files.splice(i - 1, 0, file);
  }
};

const moveDownFile = (i: number) => {
  if (i < filesMultipleValue.value.files.length - 1) {
    const file = filesMultipleValue.value.files[i];
    filesMultipleValue.value.files.splice(i, 1);
    filesMultipleValue.value.files.splice(i + 1, 0, file);
  }
};

const { errors } = defineProps({
  errors: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({}),
  },
});
</script>

<template>
  <div class="bg-[#F7F7F8] rounded-3xl p-4 border border-[#E4E4E7] shadow">
    <BlockHeader @delete-block="emit('deleteBlock')" @move-up="emit('moveUp')" @move-down="emit('moveDown')" :deleting-block="deletingBlock">
      <h3 class="text-sm text-[#101828] font-medium">Файлы</h3>
      <p class="text-sm text-[#667085]">Используйте этот блок, чтобы разместить файлы доступные для загрузки на странице.</p>
    </BlockHeader>
    <TextInputComponent class="mb-2" placeHolder="Введите заголовок" v-model="filesMultipleValue.title" :error-message="errors?.title" />
    <DropZoneMultiple :multiple="true" :file-size="fileSize" :file-formats="fileFormats" :file-type="fileType" @upload-files="updateFilesMultipleValue" />
    <transition-group class="flex flex-col gap-1 mt-3" name="list" tag="article">
      <div
        class="flex p-4 gap-3 rounded-xl border border-gray-300 bg-white items-center h-[4.625rem]"
        v-for="(file, i) in filesMultipleValue.files"
        :key="file"
      >
        <nuxt-img src="images/file-formats/doc-format.svg" alt="Файл" class="min-w-10 min-h-10 rounded-l-xl content-center text-center object-cover" />
        <div class="flex w-full items-center">
          <div class="flex flex-col gap-1 mr-auto">
            <span class="font-medium text-sm text-[#101828]">{{
              file.title ? file.title.toUpperCase() : file.substring(file.lastIndexOf("/") + 1).toUpperCase()
            }}</span>
            <span class="text-xs text-[#474a52]">1 МБ</span>
          </div>
          <div class="flex gap-3 items-center ml-auto">
            <div class="flex gap-4">
              <img
                src="/assets/images/icons/move-block-icon.svg"
                alt="MoveUp"
                class="cursor-pointer w-5 hover:opacity-80 duration-300"
                @click="moveUpFile(i)"
              />
              <img
                src="/assets/images/icons/move-block-icon.svg"
                alt="MoveDown"
                class="transform scale-y-[-1] w-5 cursor-pointer hover:opacity-80 duration-300"
                @click="moveDownFile(i)"
              />
            </div>
            <div class="w-[1px] h-6 bg-gray-300"></div>
            <nuxt-link :to="documentLink(`${file}`)" target="_blank">
              <img src="/assets/images/icons/download-file-icon.svg" alt="Скачать" class="w-5 hover:opacity-80 duration-300" />
            </nuxt-link>
            <div class="w-[1px] h-6 bg-gray-300"></div>
            <img src="/assets/images/icons/delete-pic-icon.svg" alt="Удалить" class="w-5 cursor-pointer hover:opacity-80 duration-300" @click="removeFile(i)" />
          </div>
        </div>
      </div>
    </transition-group>
    <span v-if="errors" class="text-[#B42318] text-[0.875rem] font-medium leading-[142.857%]">{{ errors.files }}</span>
  </div>
</template>
