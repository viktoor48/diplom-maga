<script setup lang="ts">
import ImageInput from '~/components/Constructor/FileInputs/ImageInput.vue';
import TextInputComponent from '~/components/Constructor/UI/TextInputComponent.vue';
import { useMain } from "~/composables/requests/useMain";
import { useValidation } from '#imports';
import { useFiles } from '~/composables/requests/useFiles';

const { removeFiles } = useFiles();

const isLoading = ref<boolean>(false);

const { isValidURL } = useValidation();

const subtitle = "Используйте этот блок, чтобы разместить баннер на странице.";

definePageMeta({
  layout: "auth",
});

interface MainData {
  url: string | null,
  link: string | null
}

const imageValue = ref<MainData>({
  url: null,
  link: null,
})

const tempImg = ref<string | null>();

const link = ref('');
const linkError = ref('');

const { fetchMain, editMain } = useMain();


const loadMainImg = async () => {
  isLoading.value = true;
  try {
    const response = (await fetchMain({
      params: {},
    })) as { photo: string, link: string };

    imageValue.value.link = response.photo || null;
    imageValue.value.url = response.link || null;
    tempImg.value = response.photo || null;
    link.value = response.link || '';
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  } finally {
    isLoading.value = false;
  }
};

await loadMainImg();

watch(link, (newValue) => {
  if (newValue) {
    linkError.value = isValidURL(newValue) ? '' : 'Неверный тип данных'
  } else {
    linkError.value = '';
  }
})

const uploadChanges = async () => {
  isLoading.value = true;
  try {
    if (tempImg.value && tempImg.value !== imageValue.value.link) {
      await removeFiles([tempImg.value]);
      await editMain(null, null);
    }

    if (imageValue.value.link || link.value) {
      await editMain(imageValue.value.link, link.value );
    }

    navigateTo('/main');
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
  } finally {
    isLoading.value = false;
  }
};

const isChanged = computed(() => {
  return imageValue.value.link !== tempImg.value || imageValue.value.url !== link.value;
});

const isValid = computed(() => {
  const hasImage = !!imageValue.value.link;
  const hasLink = !!link.value;
  const isLinkValid = !linkError.value;

  if (hasImage && !hasLink) return false;

  return !!(isChanged.value && isLinkValid);
});
</script>

<template>
  <main class="relative">
    <EditingHeaderComponent class="bg-[#fff] sticky top-0 w-full" header-title="Добавление изображения"
      cancelLink="/main" :button_status="!isValid"  @making-request="uploadChanges"/>
    <div class="px-[20rem] py-[2.5rem] gap-[1.25rem] flex flex-col">
      <ImageInput v-model="imageValue" :delete-block="false" :subtitle="subtitle">
        <TextInputComponent class="mt-3" v-model="link" place-holder="Введите ссылку, начиная с https://*"
          :errorMessage="linkError" title="Ссылка" />
      </ImageInput>
    </div>
    <Loader v-if="isLoading" />
  </main>
</template>

<style scoped></style>
