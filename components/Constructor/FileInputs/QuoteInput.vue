<script setup lang="ts">
import CkEditor from "../CkEditor.vue";
import BlockHeader from "../BlockHeader.vue";
import TextInputComponent from "../UI/TextInputComponent.vue";

const emit = defineEmits(["deleteBlock", "moveUp", "moveDown"]);

const deletingBlock = ref<boolean>(true);

const props = defineProps<{
  errors?: Record<string, string>
}>();

const textValue = defineModel({
  default: {
    title: "",
    text: "",
  },
});
</script>

<template>
  <div class="bg-[#F7F7F8] rounded-3xl p-4 pb-2.5 border border-[#E4E4E7] shadow">
    <BlockHeader @move-up="emit('moveUp')" @move-down="emit('moveDown')" @delete-block="emit('deleteBlock')" :deleting-block="deletingBlock">
      <h3 class="text-sm text-[#101828] font-medium">Блок цитата</h3>
      <p class="text-sm text-[#667085]">Используйте этот блок, чтобы разместить секцию текста на странице</p>
    </BlockHeader>
    <TextInputComponent class="mb-2" place-holder="Введите заголовок" v-model="textValue.title" :error-message="errors?.title" />
    <CkEditor v-model="textValue.text" :error-message="errors?.text" />
    <!-- <p class="text-[#667085] text-sm mt-2 ml-2">
      Для вставки текста без сохранения форматирования используйте сочетание клавиш
      <span class="bg-[#E9EAEC] rounded-md px-1.5 py-0.5 inline-block font-medium">Ctrl+Shift+V</span>
    </p> -->
  </div>
</template>
