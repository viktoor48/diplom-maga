<script setup lang="ts">
const { redirectUrl, isEditPage } = defineProps<{ redirectUrl: string; isEditPage: boolean }>();

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "unset";
});
</script>

<template>
  <div class="fixed z-[1500] top-0 left-0 w-screen h-screen bg-[#00000066] flex justify-center items-center">
    <div class="flex flex-col gap-6 p-6 items-start w-[27.625rem] h-[11.5rem] bg-white rounded-2xl">
      <p class="text-[#0D1421] font-medium text-[1.125rem] leading-[1.4]">Информация сохранена</p>
      <span class="text-[#667085] text-sm">Ваша карточка успешно {{ isEditPage ? "обновлена" : "сохранена" }}!</span>
      <button class="w-full text-black py-2.5 px-3 bg-[#E6F1E5] rounded-lg hover:bg-[#D0E5CF] duration-300" @click="navigateTo(`${redirectUrl}`)">
        Вернуться
      </button>
    </div>
  </div>
</template>
