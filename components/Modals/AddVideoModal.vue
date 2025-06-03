<script setup lang="ts">
import { useVideos } from "~/composables/requests/useVideos";
import { useValidation } from "~/composables/useValidation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/UI/alert-dialog";

const { isValidVideoLink } = useValidation();

const emit = defineEmits(["refresh-videos-list"]);

const { fetchVideos } = useVideos();

const link = ref<string>("");
const isValid = ref<boolean>(true);
const isTouched = ref<boolean>(false);

const clearInput = () => {
  link.value = "";
  isValid.value = true;
  isTouched.value = false;
};

const saveVideo = async () => {
  if (isValid) {
    await fetchVideos({ method: "POST", body: { video_url: link.value } });
    link.value = "";
    emit('refresh-videos-list');
  }
}

const handleInput = () => {
  if (!isTouched.value) {
    isTouched.value = true;
  }
  isValid.value = isValidVideoLink(link.value);

  if (!link.value.length) {
    isTouched.value = false;
  }
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger
      class="flex justify-center items-center bg-gray-50 rounded-[1.5rem] cursor-pointer hover:bg-[#F4FCF3] hover:shadow-md duration-300">
      Добавить ссылку</AlertDialogTrigger>
    <AlertDialogContent class="flex flex-col bg-white !rounded-3xl min-w-[37.5rem] max-w-[37.5rem] p-4">
      <AlertDialogHeader class="flex flex-col gap-1 pt-2">
        <AlertDialogTitle class="text-[#101828] leading-[1.5] font-medium text-[1rem]">Видеофайл</AlertDialogTitle>
        <AlertDialogDescription class="text-[#667085]"> Используйте этот блок, чтобы разместить плеер с видеофайлом на
          странице</AlertDialogDescription>
      </AlertDialogHeader>
      <div class="flex flex-col gap-2 pb-2">
        <label for="link" class="text-[#344054] text-sm font-medium">Ссылка</label>
        <input type="text" name="link" id="link" placeholder="Вставте ссылку на видео"
          class="border border-[#D0D5DD] rounded-[0.75rem] w-full px-[0.875rem] py-2.5" v-model="link"
          @input="handleInput" />
        <span v-if="isTouched && !isValid" class="text-[#B42318] text-[0.875rem] font-medium leading-[142.857%]">Укажите
          ссылку на .mp4 или .avi файл.</span>
      </div>
      <AlertDialogFooter class="!flex !w-full !justify-center">
        <AlertDialogCancel
          class="w-full text-[#ACACAC] border border-[#D0D5DD] rounded-[0.5rem] hover:bg-[#EFEFEF] duration-300"
          @click="clearInput">Отменить</AlertDialogCancel>
        <AlertDialogAction class="w-full bg-[#B9E9AE] text-black rounded-[0.5rem] hover:bg-[#86C577] duration-300"
          :class="{ 'disabled-button': link === '' || !isValid }" @click="saveVideo" :disabled="link === '' || !isValid">Сохранить
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>
.disabled-button {
  border: 1px solid #d0d5dd;
  color: #acacac;
  background-color: #efefef;
}
</style>
