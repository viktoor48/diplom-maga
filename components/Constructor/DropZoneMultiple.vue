<script setup lang="ts">
const { apiBase } = useRuntimeConfig().public;

const emit = defineEmits(["uploadFiles"]);

const { fileSize, multiple, fileFormats, fileType } = defineProps<{ fileSize: number; multiple: boolean; fileFormats: string; fileType: string }>();

const id = ref(Math.random().toString());

const dropzoneFiles = ref<any>([]);
const emitFiles = ref<any>([]);
const isLoading = ref<boolean>(false);

const isSizeError = ref<boolean>(false);
const isFormatError = ref<boolean>(false);

const getFileSize = computed(() => {
  return fileSize / (1024 * 1024);
});

const getFileFormat = computed(() => {
  if (fileFormats === "image/jpg, image/jpeg, image/png") {
    return "JPEG и PNG";
  }
});

const dropFile = (e: any) => {
  isSizeError.value = false;
  isFormatError.value = false;

  const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
  const filesArray = Array.from(files);
  filesArray.forEach((item: any) => {
    if (item.size > getFileSize.value * 1024 * 1024) {
      isSizeError.value = true;
      setTimeout(() => {
        isSizeError.value = false;
      }, 5000);
      return;
    }

    if (!fileFormats.includes(item.type)) {
      isFormatError.value = true;
      setTimeout(() => {
        isFormatError.value = false;
      }, 5000);
      return;
    }

    dropzoneFiles.value.push(item);
    uploadFile(item);
  });
  dropzoneFiles.value = [];
};

const uploadFile = async (file: any) => {
  isLoading.value = true;
  const token = useCookie("access_token");
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${apiBase}/api/admin/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const data = await response.json();
    emitFiles.value.push(data.file);
    emit("uploadFiles", [...emitFiles.value]);
    emitFiles.value = [];
  } catch (error) {
    console.error("Произошла ошибка при загрузке файла:");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <div
      class="flex flex-col w-full items-center gap-5 p-8 rounded-xl border border-gray-300 bg-white mt-2 shadow"
      :class="{ 'border-red-500': isSizeError || isFormatError }"
      @dragover.prevent
      @drop.prevent="dropFile"
      @change="dropFile"
    >
      <img src="/assets/images/icons/upload-cloud.svg" class="w-6" />
      <div class="flex flex-col gap-1 items-center">
        <span class="font-medium text-sm text-[#101828]">Выберите {{ fileType === "file" ? "файлы" : "изображения" }} или переместите их в эту область</span>
        <span class="text-xs text-[#667085]">Поддерживаются форматы {{ getFileFormat }}, размером до {{ getFileSize }} МБ.</span>
        <!-- <span class="text-xs text-[#667085] mt-1">Порядок изображений определяется порядком загрузки.</span> -->
      </div>
      <label
        :for="id"
        class="text-sm text-[#475467] py-1.5 px-2.5 rounded-[0.625rem] border border-gray-300 cursor-pointer shadow hover:bg-[#EAECF0] duration-300"
        >Выбрать файлы</label
      >
      <input required type="file" :id="id" :name="fileType" class="hidden" :multiple="multiple" :accept="fileFormats" />
    </div>
    <span class="block text-[#B42318] text-sm mt-2.5" v-if="isSizeError">Размер одного или нескольких файлов превышает {{ getFileSize }} МБ</span>
    <span class="block text-[#B42318] text-sm mt-2.5" v-if="isFormatError">Неверный тип данных у одного или нескольких файлов</span>
  </div>
  <Loader v-if="isLoading" />
</template>
