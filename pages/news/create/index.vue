<script setup lang="ts">
import { useBlocks } from "~/composables/useBlocks";
import { useNews } from "~/composables/requests/useNews";

import HeaderComponent from "~/components/Editing/HeaderComponent.vue";
import MainComponent from "~/components/Editing/MainComponent.vue";
import TextAreaInput from "~/components/Constructor/UI/TextAreaInput.vue";
import SelectComponent from "~/components/Constructor/UI/SelectComponent.vue";
import ImageInput from "~/components/Constructor/FileInputs/ImageInput.vue";
import UIInput from "~/components/UI/Input.vue";
import { useValidation } from "#imports";

definePageMeta({
  layout: "auth",
});

const { maxLength, required, noLinks } = useValidation();

const { blocks, sorting, addBlock, deleteBlock, moveUpBlock, moveDownBlock, selectBottom, disabledButton, validateBlocks } = useBlocks();

const { createNews } = useNews();

const photo = ref({ id: Date.now(), type: "image", component: ImageInput, data: { link: "" } });

const isLoading = ref<boolean>(false);

const projectsTitle = ref<string>("");
const projectsSubtitle = ref<string>("");
const dateStart = ref<string>("");
const isPinned = ref<boolean>(false);

const isMaxPinned = ref<boolean>(false);

const fieldErrors = ref<Record<string, string>>({});

const addNews = async () => {
  isLoading.value = true;

  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const areFieldsValid = validateFields();
    const areBlocksValid = validateBlocks();
    if (!areFieldsValid || !areBlocksValid) {
      isLoading.value = false;
      return;
    }

    await createNews({
      title: projectsTitle.value,
      subtitle: projectsSubtitle.value,
      date: dateStart.value,
      photo: photo.value.data.link,
      is_pinned: isPinned.value,
      blocks: blocks.value.map((block) => {
        return {
          type: block.type,
          ...block.data,
        };
      }),
    });
    navigateTo("/news");
  } catch (error) {
    console.error("Произошла ошибка при добавлении новости", error);

    const responseErrors = error?.response?._data?.errors;

    if (responseErrors?.is_pinned?.includes("No more than 6 entries can be pinned.")) {
      isMaxPinned.value = true;
    }
  } finally {
    isLoading.value = false;
  }
};

const fieldValidations = {
  projectsTitle: [
    required,
    maxLength(255),
    noLinks,
  ],
  projectsSubtitle: [
    required,
    maxLength(1000),
    noLinks,
  ],
  dateStart: [
    required,
  ],
  photo: [
    required,
  ],
};

type FieldKey = keyof typeof fieldValidations;

const validateFields = (): boolean => {
  let isValid = true;
  for (const key in fieldValidations) {
    const fieldKey = key as FieldKey;
    let value;

    if (fieldKey === "photo") {
      value = photo.value.data.link;
    } else if (fieldKey === "projectsTitle") {
      value = projectsTitle.value;
    } else if (fieldKey === "projectsSubtitle") {
      value = projectsSubtitle.value;
    } else if (fieldKey === "dateStart") {
      value = dateStart.value;
    }

    for (const rule of fieldValidations[fieldKey]) {
      const result = rule(value ?? "");
      if (result !== true) {
        fieldErrors.value[fieldKey] = result as string;
        isValid = false;
        break;
      } else {
        fieldErrors.value[fieldKey] = "";
      }
    }
  }
  return isValid;
};

const isFormValid = computed(() => {
  return projectsTitle.value && projectsSubtitle.value && dateStart.value && photo.value.data.link && blocks.value.length > 0;
});

watch(
  isFormValid,
  (valid) => {
    disabledButton.value = !valid;
  },
  { immediate: true }
);

watch(isPinned, () => {
  if (!isPinned.value) {
    isMaxPinned.value = false;
  }
});
</script>
<template>
  <HeaderComponent :headerTitle="'Добавление новости'" :cancel-link="'/news'" :button_status="disabledButton" @making-request="addNews" />
  <MainComponent>
    <div class="flex w-full flex-col">
      <div class="flex w-full gap-[1.125rem]">
        <UIInput v-model="isPinned" />
        <label for="pinned">Закрепить новость на главной странице</label>
      </div>
      <span v-if="isMaxPinned" class="text-[#B42318] text-[0.875rem] mt-[0.375rem] font-medium leading-[142.857%]"
        >Достигнуто максимальное количество закрепленных новостей</span
      >
    </div>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="projects-title" class="text-[#344054] font-medium text-sm">Заголовок*</label>
      <TextAreaInput id="projects-title" placeHolder="Введите текст" class="w-full" v-model="projectsTitle" :charCount="255" :error-message="fieldErrors.projectsTitle" />
    </div>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="projects-subtitle" class="text-[#344054] font-medium text-sm">Подзаголовок</label>
      <TextAreaInput id="projects-subtitle" placeHolder="Введите текст" class="w-full" v-model="projectsSubtitle" :char-count="1000" :error-message="fieldErrors.projectsSubtitle" />
    </div>
    <div class="flex w-full gap-3">
      <div class="flex flex-col gap-1.5 w-full">
        <label for="date_start" class="text-[#344054] font-medium text-sm">Дата добавления*</label>
        <input type="date" id="date_start" class="border border-[#D0D5DD] px-3.5 py-2.5 rounded-xl" v-model="dateStart" />
      </div>
    </div>
    <ImageInput v-model="photo.data" :delete-block="false" title="Изображение*" />
    <div class="w-full h-[1px] bg-[#D0D5DD]"></div>
    <transition-group name="list" tag="article" class="flex flex-col gap-6 w-full" v-if="blocks.length >= 0">
      <article v-for="block in blocks" :key="block.id">
        <component
          :is="block.component"
          @delete-block="deleteBlock(block.id)"
          @move-up="moveUpBlock(block.id)"
          @move-down="moveDownBlock(block.id)"
          v-model="block.data"
          :errors="block.errors"
        />
      </article>
    </transition-group>
    <SelectComponent :sorting="sorting" class="margin-bottom self-start" @addBlock="addBlock" :select-bottom="selectBottom" />
  </MainComponent>
  <Loader v-if="isLoading" />
</template>
