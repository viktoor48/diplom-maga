<script setup lang="ts">
import BlockHeader from "../BlockHeader.vue";
import Dropzone from "../Dropzone.vue";
import ImageInputEdit from "./InputsForEdit/ImageInputEdit.vue";

const emit = defineEmits(["deleteBlock", "moveUp", "moveDown"]);

const { deleteBlock, imgFileFormats, title, subtitle } = defineProps({
  deleteBlock: {
    type: Boolean,
    default: true,
  },
  imgFileFormats: {
    type: String,
    default: "image/jpg, image/jpeg, image/png",
  },
  title: {
    type: String,
    default: "Изображение",
  },
  subtitle: {
    type: String,
    default: "Используйте этот блок, чтобы разместить изображение на странице",
  },
  errors: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({}),
  }
});

const imgFileSize = ref<number>(5242880);
const fileType = ref<string>("image");
const isLoading = ref<boolean>(false);

const imageValue = defineModel<any>({
  default: {
    link: "",
  },
});

const clearFile = () => {
  imageValue.value.link = "";
};
</script>

<template>
  <div class="w-full bg-[#F7F7F8] rounded-3xl p-4 border border-[#E4E4E7] shadow" v-if="!isLoading">
    <BlockHeader :deleting-block="deleteBlock" @delete-block="emit('deleteBlock')" @move-up="emit('moveUp')"
      @move-down="emit('moveDown')">
      <h3 class="text-sm text-[rgb(16,24,40)] font-medium">{{ title }}</h3>
      <p class="text-sm text-[#667085]">{{ subtitle }}</p>
    </BlockHeader>
    <Dropzone required v-if="!imageValue.link" :multiple="false" :file-size="imgFileSize" :file-formats="imgFileFormats"
      :file-type="fileType" v-model="imageValue.link" />
    <ImageInputEdit v-else :image-value="imageValue.link" :errors="errors" @clearFile="clearFile" />
    <slot name="description" />
    <slot></slot>
    <span v-if="errors" class="text-[#B42318] text-[0.875rem] font-medium leading-[142.857%]">{{ errors?.link }}</span>
  </div>
  <Loader v-if="isLoading" />
</template>
