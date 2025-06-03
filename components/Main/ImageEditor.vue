<script setup lang="ts">
import { useFiles } from '~/composables/requests/useFiles';

const { removeFiles } = useFiles();

const emit = defineEmits(['clearFile']);

const isLoading = defineModel();

const props = defineProps<{
  image: string | null | undefined;
  hide_button: boolean | null | undefined;
  link?: string;
  to: string;
}>();

const handleClearFile = () => {
  emit('clearFile');
};

const onRemoveFile = async () => {
  isLoading.value = true;
  if (!props.image) return;

  try {
    await removeFiles([props.image]);
    handleClearFile();
  } catch (error) {
    console.error("Ошибка удаления файла:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = () => {
  onRemoveFile();
}
</script>

<template>
  <section class="flex flex-col">
    <h3 class="text-[1.25rem] pl-2 mb-5">Изображение</h3>
    <div class="bg-[#F1F1F1] rounded-[1.25rem] h-[25rem] flex justify-center items-center">
      <p v-if="!image" class="text-[#7C7C7C] text-[1.5rem] leading-[83.333%]">Изображение еще не загружено</p>
      <nuxt-img :src="`${$config.public.imageBase}${image}`" v-if="image" class="object-cover rounded-2xl h-full w-full"
        :placeholder="true" format="webp" alt="" />
    </div>
    <EditDeleteButtons :hide_button="!!hide_button" :to="to" class="py-2 px-6 mb-3" @delete="handleDelete" />
    <Loader v-if="isLoading" />
  </section>
</template>