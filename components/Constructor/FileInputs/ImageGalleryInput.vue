<script setup lang="ts">
import BlockHeader from "../BlockHeader.vue";
import DropZoneMultiple from "../DropZoneMultiple.vue";

const emit = defineEmits(["deleteBlock", "moveUp", "moveDown"]);

const { deletingBlock } = defineProps({
  deletingBlock: { type: Boolean, default: true },
  errors: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({}),
  },
});

const imgFileSize = ref<number>(5242880);
const imgFileFormats = ref<string>("image/jpg, image/jpeg, image/png");
const fileType = ref<string>("gallery");

const imageGalleryValue = defineModel<any>({
  default: {
    title: "",
    links: [],
  },
});

const updateGalleryValue = (newFiles: any) => {
  imageGalleryValue.value.links = [...imageGalleryValue.value.links, ...newFiles];
};

const removeFile = (i: number) => {
  imageGalleryValue.value.links.splice(i, 1);
};

const moveUpPhoto = (i: number) => {
  if (i > 0) {
    const photo = imageGalleryValue.value.links[i];
    imageGalleryValue.value.links.splice(i, 1);
    imageGalleryValue.value.links.splice(i - 1, 0, photo);
  }
};

const moveDownPhoto = (i: number) => {
  if (i < imageGalleryValue.value.links.length - 1) {
    const photo = imageGalleryValue.value.links[i];
    imageGalleryValue.value.links.splice(i, 1);
    imageGalleryValue.value.links.splice(i + 1, 0, photo);
  }
};
</script>

<template>
  <div class="bg-[#F7F7F8] rounded-3xl p-4 border border-[#E4E4E7] shadow">
    <BlockHeader :deleting-block="deletingBlock" @delete-block="emit('deleteBlock')" @move-up="emit('moveUp')" @move-down="emit('moveDown')">
      <h3 class="text-sm text-[#101828] font-medium">Галерея изображений</h3>
      <p class="text-sm text-[#667085]">Описание блока и для чего следует использовать</p>
    </BlockHeader>
    <DropZoneMultiple :multiple="true" :file-size="imgFileSize" :file-formats="imgFileFormats" :file-type="fileType" @upload-files="updateGalleryValue" />
    <transition-group name="list" tag="article" class="flex flex-col gap-1 mt-3">
      <div
        class="flex rounded-xl border border-gray-300 bg-white items-center h-[4.625rem] file gallery-image"
        v-for="(file, i) in imageGalleryValue.links"
        :key="file"
      >
        <div class="w-[10rem] h-full flex">
          <img :src="`${$config.public.imageBase}${file}`" alt="File" class="w-full h-full rounded-l-xl content-center text-center object-cover" />
        </div>
        <div class="flex p-4 w-full items-center">
          <div class="flex flex-col gap-1 w-[calc(100%-10rem)]">
            <span class="font-medium text-sm text-[#101828]">{{ file.substring(file.lastIndexOf("/") + 1).toUpperCase() }}</span>
            <span class="text-xs text-[#474a52]">1 МБ</span>
          </div>
          <div class="flex gap-3 items-center ml-auto">
            <div class="flex gap-4 mr-1">
              <img
                src="/assets/images/icons/move-block-icon.svg"
                alt="MoveUp"
                class="cursor-pointer w-5 hover:opacity-80 duration-300"
                @click="moveUpPhoto(i)"
              />
              <img
                src="/assets/images/icons/move-block-icon.svg"
                alt="MoveDown"
                class="transform scale-y-[-1] w-5 cursor-pointer hover:opacity-80 duration-300"
                @click="moveDownPhoto(i)"
              />
            </div>
            <div class="w-[1px] h-6 bg-gray-300"></div>
            <nuxt-link :to="`${$config.public.imageBase}${file}`" target="_blank">
              <img src="/assets/images/icons/show-pic-icon.svg" alt="Показать" class="w-5 hover:opacity-80 duration-300" />
            </nuxt-link>
            <div class="w-[1px] h-6 bg-gray-300"></div>
            <img src="/assets/images/icons/delete-pic-icon.svg" alt="Удалить" class="w-5 cursor-pointer hover:opacity-80 duration-300" @click="removeFile(i)" />
          </div>
        </div>
      </div>
    </transition-group>
    <span v-if="errors.links" class="text-[#B42318] text-[0.875rem] font-medium leading-[142.857%]">{{ errors.links }}</span>
  </div>
</template>
