<script setup lang="ts">
import Sidebar from "~/components/Layout/Sidebar.vue";
</script>

<template>
  <div class="flex min-w-screen">
    <Sidebar />
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
