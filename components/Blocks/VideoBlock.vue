<script setup lang="ts">
import Video from "../Video.vue";
const { block } = defineProps<{ block: { url: any } }>();
</script>

<template>
  <Video :video-src="block.url" />
</template>
