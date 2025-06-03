<script setup lang="ts">
const emit = defineEmits(["closeModal", "sendComment"]);

const comment = ref<string>("");

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "unset";
});
</script>

<template>
  <div class="fixed z-[1500] top-0 left-0 w-screen h-screen bg-[#00000066] flex justify-center items-center">
    <div class="flex flex-col gap-6 p-6 items-start w-[27.625rem] h-fit bg-white rounded-2xl">
      <p class="text-[#0D1421] font-medium text-[1.25rem] leading-[1.2]">Комментарий к мероприятию</p>
      <div class="flex flex-col gap-1 w-full">
        <label for="comment" class="text-[#354153] text-sm font-medium">Комментарий к мероприятию</label>
        <textarea
          v-model="comment"
          name="comment"
          id="comment"
          placeholder="Введите текст"
          class="border border-[#D0D5DD] resize-none rounded-lg w-full min-h-[9rem] py-3 px-4 text-[#202140]"
        ></textarea>
      </div>
      <div class="flex gap-2 items-center justify-between w-full *:w-full *:h-full">
        <button class="border border-[#D0D5DD] rounded-lg py-2 px-3 hover:bg-[#F8F8F8] duration-300" @click="emit('closeModal')">Отменить</button>
        <button
          class="bg-[#E6F1E5] rounded-lg py-2 px-3 hover:bg-[#D0E5CF] duration-300"
          :class="{ 'bg-[#EFEFEF] hover:bg-[#EFEFEF]': !comment }"
          :disabled="!comment"
          @click="emit('sendComment', comment)"
        >
          Отправить
        </button>
      </div>
    </div>
  </div>
</template>
