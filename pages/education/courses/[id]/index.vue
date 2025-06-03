<script setup lang="ts">
import { useBlocksEdit } from "~/composables/useBlocksEdit";
import { useCourses } from "~/composables/requests/useCourses";

import MainComponent from "~/components/Editing/MainComponent.vue";
import HeaderComponent from "~/components/Editing/HeaderComponent.vue";
import TextInputComponent from "~/components/Constructor/UI/TextInputComponent.vue";
import TextAreaInput from "~/components/Constructor/UI/TextAreaInput.vue";
import SelectComponent from "~/components/Constructor/UI/SelectComponent.vue";
import { useValidation } from "#imports";

definePageMeta({
  layout: "auth",
});

const { maxLength, required, isInvalidDateRange, noLinks, validateURLWithErrorMessage } = useValidation();

const { blocks, sorting, addBlock, deleteBlock, moveUpBlock, moveDownBlock, selectBottom, disabledButton, fillFields, validateBlocks } = useBlocksEdit();

const { fetchCourseById, updateCourseById } = useCourses();

const isLoading = ref<boolean>(false);

const coursesTitle = ref<string>("");
const coursesSubtitle = ref<string>("");
const dateStart = ref<string>("");
const dateEnd = ref<string>("");
const hours = ref<number | null>(null);
const people = ref<number | null>(null);
const curatorName = ref<string>("");
const educationForm = ref<string>("");
const listenersCategory = ref<string>("");
const link = ref<string>("");

const fieldErrors = ref<Record<string, string>>({});

const { error } = await useAsyncData<any>(
  "course",
  async () => {
    const response: any = await fetchCourseById(Number(useRoute().params.id), { method: "GET" });

    coursesTitle.value = response.title;
    coursesSubtitle.value = response.subtitle;
    dateStart.value = response.date_start;
    dateEnd.value = response.date_end;
    hours.value = response.hour;
    people.value = response.people;
    curatorName.value = response.tutor;
    educationForm.value = response.education_form;
    listenersCategory.value = response.listener;
    link.value = response.url;

    fillFields(response);
    return response;
  },
  { server: false, default: () => ({ data: {} }) }
);

if (error.value) {
  console.error("Ошибка при получении данных:", error.value);
}

const updateCourse = async () => {
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
    await updateCourseById(Number(useRoute().params.id), {
      title: coursesTitle.value,
      subtitle: coursesSubtitle.value,
      date_start: dateStart.value,
      date_end: dateEnd.value,
      hour: hours.value,
      people: people.value,
      tutor: curatorName.value,
      education_form: educationForm.value,
      listener: listenersCategory.value,
      url: link.value,
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
    coursesTitle.value &&
    coursesSubtitle.value &&
    dateStart.value &&
    dateEnd.value &&
    hours.value &&
    people.value &&
    curatorName.value &&
    educationForm.value &&
    listenersCategory.value &&
    blocks.value.length > 0 &&
    link.value
  );
});

const fieldValidations = {
  coursesTitle: [
    required,
    maxLength(255),
    noLinks,
  ],
  coursesSubtitle: [
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
  link: [
    required,
    validateURLWithErrorMessage,
  ]
};

type FieldKey = keyof typeof fieldValidations;

const validateFields = (): boolean => {
  let isValid = true;
  for (const key in fieldValidations) {
    const fieldKey = key as FieldKey;
    let value;

    if (fieldKey === "coursesTitle") {
      value = coursesTitle.value;
    } else if (fieldKey === "coursesSubtitle") {
      value = coursesSubtitle.value;
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
    } else if (fieldKey === "link") {
      value = link.value;
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
  <HeaderComponent :headerTitle="'Редактирование курса'" :cancel-link="'/education'" :button_status="disabledButton" @making-request="updateCourse" />
  <MainComponent>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="courses-title" class="text-[#344054] font-medium text-sm">Заголовок</label>
      <TextAreaInput id="courses-title" placeHolder="Введите текст" class="w-full" v-model="coursesTitle" :char-count="255" :error-message="fieldErrors.coursesTitle" />
    </div>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="courses-subtitle" class="text-[#344054] font-medium text-sm">Подзаголовок</label>
      <TextAreaInput id="courses-subtitle" placeHolder="Введите текст" class="w-full" v-model="coursesSubtitle" :char-count="1000" :error-message="fieldErrors.coursesSubtitle" />
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
    <div class="flex flex-col gap-1.5 w-full">
      <label for="link" class="text-[#344054] font-medium text-sm">Ссылка</label>
      <TextAreaInput id="link" placeHolder="Введите ссылку на запись" class="w-full" v-model="link" :error-message="fieldErrors.link" />
    </div>
    <div class="w-full h-[1px] bg-[#D0D5DD]"></div>
    <transition-group name="list" tag="article" class="flex flex-col gap-6 w-full" v-if="blocks.length >= 0">
      <article v-for="(block, i) in blocks" :key="block.id">
        <component :is="block.component" @delete-block="deleteBlock(i)" @move-up="moveUpBlock(i)" @move-down="moveDownBlock(i)" v-model="block.data" :errors="block.errors" />
      </article>
    </transition-group>
    <SelectComponent :sorting="sorting" class="margin-bottom self-start" @addBlock="addBlock" :select-bottom="selectBottom" />
  </MainComponent>
  <Loader v-if="isLoading" />
</template>
