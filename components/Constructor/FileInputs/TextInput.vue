<script setup lang="ts">
import CkEditor from "../CkEditor.vue";

const emit = defineEmits(["updateTextValue"]);
const textValue = defineModel<any>({
  default: {
    text: "",
  },
});

const updateTextValue = (e: string) => {
  textValue.text = e;
  emit("updateTextValue", e);
};
</script>

<template>
  <div class="w-full bg-[#F7F7F8] rounded-3xl p-4 pb-2.5 border border-[#E4E4E7] shadow">
    <header class="flex justify-between items-center w-full mb-4 px-2">
      <div class="flex flex-col gap-1">
        <h3 class="text-sm text-[#101828] font-medium">Текстовый блок*</h3>
        <p class="text-sm text-[#667085]">Используйте этот блок, чтобы разместить секцию текста на странице</p>
      </div>
    </header>
    <CkEditor v-model="textValue.text" @update:modelValue="updateTextValue" />
    <p class="text-[#667085] text-sm mt-2 ml-2">
      Для вставки текста без сохранения форматирования используйте сочетание клавиш
      <span class="bg-[#E9EAEC] rounded-md px-1.5 py-0.5 inline-block font-medium">Ctrl+Shift+V</span>
    </p>
  </div>
</template>
