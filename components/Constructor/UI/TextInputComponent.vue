<script setup lang="ts">
const emit = defineEmits(["update:modelValue"]);

const { modelValue, placeHolder } = defineProps({
  modelValue: String,
  placeHolder: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="flex flex-col gap-[0.375rem]">
    <span v-if="title" class="text-[#344054] text-[0.875rem] font-medium leading-[142.857%]">{{ title }}</span>
    <input
      required
      type="text"
      name="text"
      class="border border-[#D0D5DD] px-3.5 py-2.5 rounded-xl"
      @drop.prevent
      :value="modelValue"
      :placeholder="placeHolder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="{ '!border-[#B42318]': errorMessage }"
    />
    <span v-if="errorMessage" class="text-[#B42318] text-[0.875rem] leading-[142.857%]">{{ errorMessage }}</span>
  </div>
</template>
