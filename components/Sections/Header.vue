<script setup lang="ts">
const { hideSearchAndButton } = defineProps<{
  hideSearchAndButton?: boolean;
}>();
const searchQuery = defineModel<string>();
</script>

<template>
  <header class="flex flex-col pr-10 pl-6">
    <div class="flex items-center justify-between">
      <h2 class="font-medium text-[2rem]">
        <slot name="title" />
      </h2>
      <div v-if="!hideSearchAndButton" class="flex gap-4">
        <div class="w-[17.5rem] relative">
          <input
            type="text"
            placeholder="Введите запрос"
            class="w-full text-[#020202] text-[0.875rem] border border-transparent bg-gray-100 cursor-pointer py-2 pr-8 pl-4 rounded-xl hover:border hover:border-[#D0E5CF] focus:border-[#D0E5CF] duration-300"
            v-model="searchQuery"
          />
          <img v-if="searchQuery === ''" src="/assets/images/icons/search-icon.svg" class="absolute top-1/2 right-3 transform -translate-y-1/2 w-4" />
          <img
            v-else
            class="absolute right-3 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 cursor-pointer hover:opacity-70 duration-300"
            src="@/assets/images/icons/clear-icon.svg"
            alt="Очистить поиск"
            @click="searchQuery = ''"
          />
        </div>
        <!-- <button
          class="py-2 pr-2 pl-3 bg-[#B9E9AE] rounded-lg hover:bg-[#86C577] duration-300"
        >
          <nuxt-link :to="createItemLink"> Добавить + </nuxt-link>
        </button> -->
        <slot name="add-button" />
      </div>
    </div>
    <div>
      <slot name="footer" />
    </div>
  </header>
</template>
