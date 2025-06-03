<script setup lang="ts">
import { useBlocks } from "~/composables/useBlocks";
import { useTrainings } from "~/composables/requests/useTrainings";

import MainComponent from "~/components/Editing/MainComponent.vue";
import HeaderComponent from "~/components/Editing/HeaderComponent.vue";
import TextInputComponent from "~/components/Constructor/UI/TextInputComponent.vue";
import TextAreaInput from "~/components/Constructor/UI/TextAreaInput.vue";
import SelectComponent from "~/components/Constructor/UI/SelectComponent.vue";
import { useValidation } from "#imports";

definePageMeta({
  layout: "auth",
});

const { maxLength, required, isInvalidDateRange, noLinks } = useValidation();

const { blocks, sorting, addBlock, deleteBlock, moveUpBlock, moveDownBlock, selectBottom, disabledButton, validateBlocks } = useBlocks();

const { createTraining } = useTrainings();

const isLoading = ref<boolean>(false);

const trainingsTitle = ref<string>("");
const trainingsSubtitle = ref<string>("");
const dateStart = ref<string>("");
const dateEnd = ref<string>("");
const hours = ref<number | null>(null);
const people = ref<number | null>(null);
const curatorName = ref<string>("");
const educationForm = ref<string>("");
const listenersCategory = ref<string>("");

const fieldErrors = ref<Record<string, string>>({});

const addTrainings = async () => {
  isLoading.value = true;
  
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 500));

  const areFieldsValid = validateFields();
  const areBlocksValid = validateBlocks();

  const dateError = isInvalidDateRange(dateStart.value, dateEnd.value);
  fieldErrors.value.dateStart = dateError;

  if (!areFieldsValid || !areBlocksValid || dateError) {
    isLoading.value = false;
    return;
  }

  try {
    await createTraining({
      title: trainingsTitle.value,
      subtitle: trainingsSubtitle.value,
      date_start: dateStart.value,
      date_end: dateEnd.value,
      hour: hours.value,
      people: people.value,
      tutor: curatorName.value,
      education_form: educationForm.value,
      listener: listenersCategory.value,
      blocks: blocks.value.map((block) => {
        return {
          type: block.type,
          ...block.data,
        };
      }),
    });
    navigateTo("/education");
  } catch (error) {
    console.error("Произошла ошибка при создании программы", error);
  } finally {
    isLoading.value = false;
  }
};

const isFormValid = computed(() => {
  return (
    trainingsTitle.value &&
    trainingsSubtitle.value &&
    dateStart.value &&
    dateEnd.value &&
    hours.value &&
    people.value &&
    curatorName.value &&
    educationForm.value &&
    listenersCategory.value &&
    blocks.value.length > 0
  );
});

const fieldValidations = {
  trainingsTitle: [
    required,
    maxLength(255),
    noLinks,
  ],
  trainingsSubtitle: [
    required,
    maxLength(1000),
    noLinks,
  ],
  dateStart: [
    required,
  ],
  dateEnd: [
    required,
  ],
  curatorName: [
    required, noLinks,
  ],
  educationForm: [
    required, noLinks,
  ],
  listenersCategory: [
    required, noLinks,
  ],
};

type FieldKey = keyof typeof fieldValidations;

const validateFields = (): boolean => {
  let isValid = true;
  for (const key in fieldValidations) {
    const fieldKey = key as FieldKey;
    let value;

    if (fieldKey === "trainingsTitle") {
      value = trainingsTitle.value;
    } else if (fieldKey === "trainingsSubtitle") {
      value = trainingsSubtitle.value;
    } else if (fieldKey === "dateStart") {
      value = dateStart.value;
    } else if (fieldKey === "dateEnd") {
      value = dateEnd.value;
    } else if (fieldKey === "curatorName") {
      value = curatorName.value;
    } else if (fieldKey === "educationForm") {
      value = educationForm.value;
    } else if (fieldKey === "listenersCategory") {
      value = listenersCategory.value;
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

watch(
  isFormValid,
  (valid) => {
    disabledButton.value = !valid;
  },
  { immediate: true }
);
</script>
<template>
  <HeaderComponent :headerTitle="'Добавление программы'" :cancel-link="'/education'" :button_status="disabledButton" @making-request="addTrainings" />
  <MainComponent>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="contests-title" class="text-[#344054] font-medium text-sm">Заголовок</label>
      <TextAreaInput id="contests-title" placeHolder="Введите текст" class="w-full" v-model="trainingsTitle" :char-count="255" :error-message="fieldErrors.trainingsTitle"/>
    </div>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="contests-subtitle" class="text-[#344054] font-medium text-sm">Подзаголовок</label>
      <TextAreaInput id="contests-subtitle" placeHolder="Введите текст" class="w-full" v-model="trainingsSubtitle" :char-count="1000" :error-message="fieldErrors.trainingsSubtitle"/>
    </div>
    <div class="flex w-full gap-3">
      <div class="flex flex-col gap-1.5 w-full">
        <label for="date_start" class="text-[#344054] font-medium text-sm">Дата начала</label>
        <input type="date" id="date_start" class="border border-[#D0D5DD] px-3.5 py-2.5 rounded-xl" v-model="dateStart" />
        <span v-if="fieldErrors?.dateStart" class="text-[#B42318] text-[0.875rem] font-medium leading-[142.857%]">{{ fieldErrors.dateStart }}</span>
      </div>
      <div class="flex flex-col gap-1.5 w-full">
        <label for="date_end" class="text-[#344054] font-medium text-sm">Дата окончания</label>
        <input type="date" id="date_end" class="border border-[#D0D5DD] px-3.5 py-2.5 rounded-xl" v-model="dateEnd" />
      </div>
    </div>
    <div class="flex w-full gap-3">
      <div class="flex flex-col gap-1.5 w-full">
        <label for="hours" class="text-[#344054] font-medium text-sm">Кол-во часов</label>
        <input type="number" id="hours" placeHolder="Введите количество часов" class="border border-[#D0D5DD] px-3.5 py-2.5 rounded-xl" v-model="hours" />
      </div>
      <div class="flex flex-col gap-1.5 w-full">
        <label for="people" class="text-[#344054] font-medium text-sm">Кол-во людей</label>
        <input type="number" id="people" placeHolder="Введите количество людей" class="border border-[#D0D5DD] px-3.5 py-2.5 rounded-xl" v-model="people" />
      </div>
    </div>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="curator" class="text-[#344054] font-medium text-sm">Куратор</label>
      <TextInputComponent id="curator" placeHolder="Введите имя куратора" class="w-full" v-model="curatorName" :error-message="fieldErrors.curatorName" />
    </div>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="education-form" class="text-[#344054] font-medium text-sm">Форма обучения</label>
      <TextInputComponent id="education-form" placeHolder="Введите форму обучения" class="w-full" v-model="educationForm" :error-message="fieldErrors.educationForm" />
    </div>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="listeners" class="text-[#344054] font-medium text-sm">Категория слушателей</label>
      <TextInputComponent id="listeners" placeHolder="Введите категорию слушателей" class="w-full" v-model="listenersCategory" :error-message="fieldErrors.listenersCategory" />
    </div>
    <div class="w-full h-[1px] bg-[#D0D5DD]"></div>
    <transition-group name="list" tag="article" class="flex flex-col gap-6 w-full" v-if="blocks.length >= 0">
      <article v-for="block in blocks" :key="block.id">
        <component
          :is="block.component"
          @delete-block="deleteBlock(block.id)"
          @move-up="moveUpBlock(block.id)"
          @move-down="moveDownBlock(block.id)"
          v-model="block.data"
          :deleting-block="true"
          :errors="block.errors"
        />
      </article>
    </transition-group>
    <SelectComponent :sorting="sorting" class="margin-bottom self-start" @addBlock="addBlock" :select-bottom="selectBottom" />
  </MainComponent>
  <Loader v-if="isLoading" />
</template>
