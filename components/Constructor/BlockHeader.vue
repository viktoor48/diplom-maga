<script setup lang="ts">
const emit = defineEmits(["moveUp", "moveDown", "deleteBlock"]);

const { deletingBlock } = defineProps<{ deletingBlock: boolean }>();
</script>

<template>
  <header class="flex justify-between items-center w-full mb-4 px-2">
    <div class="flex flex-col gap-1">
      <slot></slot>
    </div>
    <div class="flex items-center gap-4 h-9">
      <div class="flex items-center gap-4" v-if="deletingBlock">
        <img src="assets/images/icons/move-block-icon.svg" alt="MoveUp" class="cursor-pointer w-5 hover:opacity-80 transition-all" @click="emit('moveUp')" />
        <img
          src="assets/images/icons/move-block-icon.svg"
          alt="MoveUp"
          class="transform scale-y-[-1] cursor-pointer w-5 hover:opacity-80 transition-all"
          @click="emit('moveDown')"
        />
      </div>
      <div class="w-[1px] h-6 bg-gray-300" v-if="deletingBlock"></div>
      <img
        src="assets/images/icons/delete-pic-icon.svg"
        alt="Delete"
        class="cursor-pointer w-5 hover:opacity-80 transition-all"
        @click="emit('deleteBlock')"
        v-if="deletingBlock"
      />
      <!-- <img src="assets/images/icons/delete-inactive-pic-icon.svg" alt="Delete" class="w-5" v-else /> -->
    </div>
  </header>
</template>
