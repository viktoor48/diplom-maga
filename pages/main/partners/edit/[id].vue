<script setup lang="ts">
import ImageInput from '~/components/Constructor/FileInputs/ImageInput.vue';
import TextInputComponent from '~/components/Constructor/UI/TextInputComponent.vue';
import { useValidation } from '#imports';
import { useFiles } from '~/composables/requests/useFiles';
import { usePartners } from "~/composables/requests/usePartners";

const currentId = useRoute().params.id;

const isLoading = ref<boolean>(false);

const { isValidURL } = useValidation();

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

const { fetchPartnerById, editPartner } = usePartners();


const loadPartner = async () => {
  isLoading.value = true;
  try {
    const response = (await fetchPartnerById(+currentId)) as {id: Number, photo: string, url: string };

    imageValue.value.link = response.photo;
    imageValue.value.url = response.url;
    tempImg.value = response.photo || null;
    link.value = response.url || '';
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  } finally {
    isLoading.value = false;
  }
};

await loadPartner();

watch(link, (newValue) => {
  if (newValue) {
    linkError.value = isValidURL(newValue) ? '' : 'Неверный тип данных'
  }
})

const uploadChanges = async () => {
  isLoading.value = true;
  try {
    if (imageValue.value.link && link.value) {
      await editPartner(+currentId, imageValue.value.link, link.value );
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

  if (!hasImage || !hasLink) return false;
  
  if (!isLinkValid) return false;
  
  return isChanged.value;
});

</script>

<template>
  <main class="relative">
    <EditingHeaderComponent class="bg-[#fff] sticky top-0 w-full" header-title="Добавление изображения"
      cancelLink="/main" :button_status="!isValid"  @making-request="uploadChanges"/>
    <div class="px-[20rem] py-[2.5rem] gap-[1.25rem] flex flex-col">
      <ImageInput v-model="imageValue" :delete-block="false">
        <TextInputComponent class="mt-3" v-model="link" place-holder="Введите ссылку, начиная с https://*"
          :errorMessage="linkError" title="Ссылка" />
      </ImageInput>
    </div>
    <Loader v-if="isLoading" />
  </main>
</template>

<style scoped></style>
