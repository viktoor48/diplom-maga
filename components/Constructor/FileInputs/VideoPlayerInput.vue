<script setup lang="ts">
import BlockHeader from "../BlockHeader.vue";
import TextAreaInput from "~/components/Constructor/UI/TextAreaInput.vue";

const emit = defineEmits(["deleteBlock", "moveUp", "moveDown"]);

const deletingBlock = ref<boolean>(true);
const fileType = ref<string>("player");

const videoFrameValue = defineModel({
  default: {
    url: "",
  }
});

const updateFrameValue = (e: string) => {
  videoFrameValue.value.url = e;
};

const { errors } = defineProps({
  errors: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({}),
  }
});
</script>
<template>
  <div class="bg-[#F7F7F8] rounded-3xl p-4 pb-2.5 border border-[#E4E4E7] shadow">
    <BlockHeader
      :deleting-block="deletingBlock"
      :file-type="fileType"
      @delete-block="emit('deleteBlock')"
      @move-up="emit('moveUp')"
      @move-down="emit('moveDown')"
    >
      <h3 class="text-sm text-[#101828] font-medium">Вставка видео</h3>
      <p class="text-sm text-[#667085]">Используйте этот блок, чтобы разместить видео на странице</p>
    </BlockHeader>
    <TextAreaInput required placeHolder="Вставьте ссылку на видео" @update:modelValue="updateFrameValue" v-model="videoFrameValue.url" :error-message="errors.url" />
  </div>
</template>
