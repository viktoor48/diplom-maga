<script setup lang="ts">
const emit = defineEmits(["apply", "cancel"]);

const apply = () => {
  emit("apply");
};

const cancel = () => {
  emit("cancel");
};
</script>

<template>
  <hr class="bg-[#EAECF0]/10 my-[0.25rem] w-full rounded-full mt-4" />
  <div class="flex justify-center gap-4 p-5">
    <button @click="cancel" class="w-[9.5rem] text-[1rem] leading-[125%] font-medium py-3 px-4 bg-white rounded-2xl border border-[#D0D5DD] text-center">
      Отменить
    </button>
    <button @click="apply" class="w-[9.5rem] text-[1rem] leading-[125%] font-medium py-3 px-4 rounded-2xl border border-black bg-[#B9E9AE] text-center">
      Применить
    </button>
  </div>
</template>
