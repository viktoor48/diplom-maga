<script setup lang="ts">
const { block } = defineProps<{ block: { title?: string; text?: string } }>();
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 v-if="block.title" class="font-medium text-[2rem] max-sm:text-[1.5rem]">{{ block.title }}</h2>
    <p v-if="block.text" v-html="block.text"></p>
  </div>
</template>
