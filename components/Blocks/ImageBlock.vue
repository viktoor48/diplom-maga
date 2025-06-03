<script setup lang="ts">
const { block } = defineProps<{ block: { link: string } }>();

const imageConfig = useRuntimeConfig().public.imageBase;
</script>

<template>
  <div>
    <nuxt-img :src="`${imageConfig}${block.link}`" class="w-full h-[25rem] object-cover rounded-3xl shadow-md" />
  </div>
</template>
