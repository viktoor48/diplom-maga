<script setup lang="ts">
const emit = defineEmits(["makingRequest"]);

const { headerTitle, cancelLink, button_status } = defineProps<{ headerTitle: string; cancelLink: string; button_status: boolean }>();

const router = useRouter();
</script>

<template>
  <header class="fixed z-[1000] w-full bg-white h-[5rem] pt-8 px-10 pb-4 flex justify-between items-center border-b border-[#D0D5DD]">
    <button class="py-1.5 px-3 rounded-lg border border-[#D0D5DD] hover:bg-gray-100 duration-300" @click="router.back()">Отменить</button>
    <h3 class="text-[1.25rem] text-[#667085] font-normal">{{ headerTitle }}</h3>
    <button
      class="text-black py-1.5 px-3 bg-[#D5F2CF] rounded-lg hover:bg-[#B9E9AE] duration-300"
      @click="emit('makingRequest')"
      :class="{ sending_request: button_status }"
      :disabled="button_status"
    >
      Сохранить
    </button>
  </header>
</template>

<style scoped>
.sending_request {
  background: #efefef;
}
</style>
