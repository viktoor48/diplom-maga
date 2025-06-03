<script setup lang="ts">
import type { EventViewMode } from '~/types';

const props = defineProps<{
    modelValue: EventViewMode;
}>()

const emit = defineEmits(['update:modelValue']);

const toggleTab = (tab: EventViewMode) => {
  if (tab === props.modelValue) return;

  emit('update:modelValue', tab)
}
</script>

<template>
    <div class="flex p-1 gap-1 bg-white text-[#000] font-medium leading-[125%] rounded-2xl max-sm:w-full">
        <div class="flex justify-center py-2 px-4 max-sm:px-2 max-sm:py-[0.375rem] rounded-xl duration-300 cursor-pointer hover:bg-[#F2F4F7] w-[7.938rem] max-sm:basis-1/2"
            :class="{ 'bg-[#F2F4F7]': modelValue === 'calendar' }" @click="toggleTab('calendar')">
            Календарь
        </div>
        <div class="flex justify-center py-2 px-4 max-sm:px-2 max-sm:py-[0.375rem] rounded-xl duration-300 cursor-pointer hover:bg-[#F2F4F7] w-[7.938rem]  max-sm:basis-1/2"
            :class="{ 'bg-[#F2F4F7]': modelValue === 'list' }" @click="toggleTab('list')">
            Список
        </div>
    </div>
</template>