<script setup lang="ts">
const { redirectLink } = defineProps<{ redirectLink: any }>();
</script>

<template>
  <button class="py-2 pr-2 pl-3 bg-[#D5F2CF] rounded-lg hover:bg-[#B9E9AE] duration-300">
    <nuxt-link :to="`${redirectLink}`"> Добавить + </nuxt-link>
  </button>
</template>
