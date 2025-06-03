<script setup lang="ts">
import { useBlocksEdit } from "~/composables/useBlocksEdit";
import { useDevelopments } from "~/composables/requests/useDevelopments";

import MainComponent from "~/components/Editing/MainComponent.vue";
import HeaderComponent from "~/components/Editing/HeaderComponent.vue";
import TextAreaInput from "~/components/Constructor/UI/TextAreaInput.vue";
import SelectComponent from "~/components/Constructor/UI/SelectComponent.vue";
import { useValidation } from "#imports";

definePageMeta({
  layout: "auth",
});

const { maxLength, required, noLinks } = useValidation();

const { blocks, sorting, addBlock, deleteBlock, moveUpBlock, moveDownBlock, selectBottom, disabledButton, fillFields, validateBlocks } = useBlocksEdit();

const { fetchDevelopmentById, updateDevelopmentById } = useDevelopments();

const isLoading = ref<boolean>(false);

const developmentsTitle = ref<string>("");
const developmentsSubtitle = ref<string>("");
const fieldErrors = ref<Record<string, string>>({});

const { error } = await useAsyncData<any>("development", async () => {
  const response: any = await fetchDevelopmentById(Number(useRoute().params.id), { method: "GET" });
  developmentsTitle.value = response.title;
  developmentsSubtitle.value = response.subtitle;

  fillFields(response);
  return response;
});

if (error.value) {
  console.error("Ошибка при получении данных:", error.value);
}

const updateDevelopment = async () => {
  isLoading.value = true;

  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 500));

  const areFieldsValid = validateFields();
  const areBlocksValid = validateBlocks();

  if (!areFieldsValid || !areBlocksValid) {
    isLoading.value = false;
    return;
  }

  try {
    await updateDevelopmentById(Number(useRoute().params.id), {
      title: developmentsTitle.value,
      subtitle: developmentsSubtitle.value,
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

const fieldValidations = {
  developmentsTitle: [
    required,
    maxLength(255),
    noLinks,
  ],
  developmentsSubtitle: [
    required,
    maxLength(1000),
    noLinks,
  ],
};

type FieldKey = keyof typeof fieldValidations;

const validateFields = (): boolean => {
  let isValid = true;
  for (const key in fieldValidations) {
    const fieldKey = key as FieldKey;
    let value;

    if (fieldKey === "developmentsTitle") {
      value = developmentsTitle.value;
    } else if (fieldKey === "developmentsSubtitle") {
      value = developmentsSubtitle.value;
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
  return developmentsTitle.value && developmentsSubtitle.value && blocks.value.length > 0;
});

watch(
  isFormValid,
  (valid) => {
    disabledButton.value = !valid;
  },
  { immediate: true }
);
</script>

<template>
  <HeaderComponent
    :headerTitle="'Редактирование методических разработок'"
    :cancel-link="'/education'"
    :button_status="disabledButton"
    @making-request="updateDevelopment"
  />
  <MainComponent>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="developments-title" class="text-[#344054] font-medium text-sm">Заголовок</label>
      <TextAreaInput id="developments-title" placeHolder="Введите текст" class="w-full" v-model="developmentsTitle" :char-count="255" :error-message="fieldErrors.developmentsTitle" />
    </div>
    <div class="flex flex-col gap-1.5 w-full">
      <label for="developments-subtitle" class="text-[#344054] font-medium text-sm">Подзаголовок</label>
      <TextAreaInput id="developments-subtitle" placeHolder="Введите текст" class="w-full" v-model="developmentsSubtitle" :char-count="1000" :error-message="fieldErrors.developmentsSubtitle" />
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
