<script setup lang="ts">
import type { Document } from "~/types";

const { block } = defineProps<{ block: { title: string; files: Document[] } }>();
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 class="font-medium text-[2rem] max-sm:text-[1.5rem]">{{ block.title }}</h2>
    <div class="max-sm:overflow-auto scroll-hidden">
      <DocumentsCardList :documents="block.files" :is-documents-page="false" :is-education-page="false" />
    </div>
  </div>
</template>
