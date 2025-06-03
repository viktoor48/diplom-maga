<script setup lang="ts">
import BlockHeader from "../BlockHeader.vue";
import TextInputComponent from "../UI/TextInputComponent.vue";
import Dropzone from "../Dropzone.vue";
import FileInputEdit from "./InputsForEdit/FileInputEdit.vue";

const emit = defineEmits(["deleteBlock", "moveUp", "moveDown", "createDocument"]);

const route = useRoute();

const defaultFileSize = ref<number>(5242880);
const defaultFileFormats = ref<string>("application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document");
const fileType = ref<string>("file");
const isLoading = ref<boolean>(false);

const deletingBlock = ref<boolean>(true);

const fileValue = defineModel<any>({
  default: {
    title: "",
    file: null,
    files: [],
  },
});

const updateTitleValue = (e: string) => {
  fileValue.value.title = e;
};

const updateFileValue = (e: any) => {
  fileValue.value.file = e;
  if (!fileValue.value.files) {
    fileValue.value.files = [];
  }
  fileValue.value.files.push({ link: e });
};

const clearFile = async () => {
  fileValue.value.file = null;
  fileValue.value.files = [];
};

onMounted(() => {
  if (route.path === "/documents" || route.path === `/documents/${route.params.id}`) {
    deletingBlock.value = false;
  }
});
</script>

<template>
  <div
    class="bg-[#F7F7F8] w-[50rem] mx-auto rounded-3xl p-4 border border-[#E4E4E7] shadow"
    :class="{ 'mt-10': route.path === `/documents/${route.params.id}` }"
    v-if="!isLoading"
  >
    <BlockHeader
      :deleting-block="deletingBlock"
      :file-type="fileType"
      @delete-block="emit('deleteBlock', fileType)"
      @move-up="emit('moveUp')"
      @move-down="emit('moveDown')"
    >
      <h3 class="text-sm text-[#101828] font-medium">Файл</h3>
      <p class="text-sm text-[#667085]">Используйте этот блок, чтобы разместить файлы доступные для загрузки на странице.</p>
    </BlockHeader>
    <TextInputComponent placeHolder="Введите отображаемое название файла" class="mb-2 w-full" @update:modelValue="updateTitleValue" v-model="fileValue.title" />
    <Dropzone
      v-if="!fileValue.file"
      v-model="fileValue.file"
      :file-size="defaultFileSize"
      :multiple="false"
      :file-formats="defaultFileFormats"
      :file-type="fileType"
      @uploadFile="updateFileValue"
      @update:modelValue="updateFileValue"
      @createDocument="emit('createDocument', fileValue.title, fileValue.file)"
    />
    <FileInputEdit
      :file-formats="defaultFileFormats"
      :file-value="fileValue.file"
      :file-title="fileValue.title"
      @clearFile="clearFile"
      @createDocument="emit('createDocument', fileValue.title, fileValue.file)"
      v-else
    />
  </div>
  <Loader v-if="isLoading" />
</template>
