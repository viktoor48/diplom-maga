<script setup lang="ts">
const emit = defineEmits(["closeDialog", "deleteUser"]);
const { userId } = defineProps<{ userId: number | null }>();

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "unset";
});
</script>

<template>
  <div class="fixed z-[1500] top-0 left-0 w-screen h-screen bg-[#00000066] flex justify-center items-center">
    <div class="flex flex-col gap-4 p-6 items-start w-[25rem] h-[11.5rem] bg-white rounded-2xl">
      <p class="text-[#0D1421] font-medium text-[1.125rem] leading-[1.4]">Удаление пользователя</p>
      <span class="text-[#667085] text-sm">Удалить пользователя без возможности восстановления?</span>
      <div class="flex w-full gap-2">
        <button
          class="w-full text-[#101828] text-[1rem] py-2 font-medium border border-[#D0D5DD] shadow-sm rounded-[0.5rem] hover:bg-[#EFEFEF] duration-300"
          @click="emit('closeDialog')"
        >
          Отмена
        </button>
        <button
          class="w-full bg-[#B42318] text-white text-[1rem] font-medium rounded-[0.5rem] hover:bg-red-800 duration-300"
          @click="emit('deleteUser', userId)"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>
