<script setup lang="ts">
const { apiBase } = useRuntimeConfig().public;

const emit = defineEmits(["uploadImage"]);

const { fileSize, multiple, fileFormats, fileType } = defineProps<{ fileSize: number; multiple: boolean; fileFormats: string; fileType: string }>();

const id = ref<string>(Math.random().toString());
const modelValue = defineModel();

const dropzoneFile = ref<any>(null);
const previewImage = ref<string>("");
const isLoading = ref<boolean>(false);

const isSizeError = ref<boolean>(false);
const isFormatError = ref<boolean>(false);

const getFileSize = computed(() => {
  return fileSize / (1024 * 1024);
});

const getFileFormat = computed(() => {
  switch (fileFormats) {
    case "image/jpg, image/jpeg, image/png":
      return "JPEG и PNG";
    case "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "WORD и PDF";
    case "image/png, image/svg+xml":
      return "PNG и SVG";
    case "image/jpg, image/jpeg, image/png, image/svg+xml":
      return "JPEG, PNG и SVG";
  }
});

const dropFile = (e: any) => {
  isSizeError.value = false;
  isFormatError.value = false;

  dropzoneFile.value = null;
  previewImage.value = "";

  const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
  if (!files || files.length === 0) return;

  const file = files[0];

  if (file.size > getFileSize.value * 1024 * 1024) {
    isSizeError.value = true;
    setTimeout(() => {
      isSizeError.value = false;
    }, 5000);
    return;
  }

  if (!fileFormats.includes(file.type)) {
    isFormatError.value = true;
    setTimeout(() => {
      isFormatError.value = false;
    }, 5000);
    return;
  }

  dropzoneFile.value = file;

  if (fileType === "image") {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadFile();
};

const uploadFile = async () => {
  if (!dropzoneFile.value || isLoading.value) return;
  isLoading.value = true;

  try {
    const token = useCookie("access_token");
    const formData = new FormData();
    formData.append("file", dropzoneFile.value);

    const response = await fetch(`${apiBase}/api/admin/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    const data = await response.json();
    modelValue.value = data.file;
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
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
      v-if="!dropzoneFile"
    >
      <img src="/assets/images/icons/upload-cloud.svg" alt="Upload" class="w-6" />
      <div class="flex flex-col gap-1 items-center">
        <span class="font-medium text-sm text-[#101828]">Выберите файл или переместите его в эту область</span>
        <span class="text-xs text-[#667085]">Поддерживаются форматы {{ getFileFormat }}, размером до {{ getFileSize }} МБ.</span>
      </div>
      <label
        :for="id"
        class="text-sm text-[#475467] py-1.5 px-2.5 rounded-[0.625rem] border border-gray-300 cursor-pointer shadow hover:bg-[#EAECF0] duration-300"
        >Выбрать файл</label
      >
      <input type="file" :id="id" :name="fileType" class="hidden" :multiple="multiple" :accept="fileFormats" @change="dropFile" />
    </div>
    <span class="block text-[#B42318] text-sm mt-2.5" v-if="isSizeError">Файл превышает размер {{ getFileSize }} МБ</span>
    <span class="block text-[#B42318] text-sm mt-2.5" v-if="isFormatError">Неверный тип данных</span>

    <!-- <div class="flex rounded-xl border border-gray-300 bg-white items-center h-[4.625rem]" v-if="dropzoneFile && fileType !== 'file'">
      <div class="w-[9rem] h-full flex">
        <img :src="previewImage" class="w-full h-full rounded-l-xl content-center text-center object-cover" />
      </div>
      <div class="flex p-4 w-full items-center">
        <div class="flex flex-col gap-1 mr-auto">
          <span class="font-medium text-sm text-[#101828]">{{ dropzoneFile ? dropzoneFile?.name.toUpperCase() : "IMAGE" }}</span>
          <span class="text-xs text-[#474a52]">{{ dropzoneFile ? (+dropzoneFile?.size / 1048576).toFixed(1) : "1" }} МБ</span>
        </div>
      </div>
    </div> -->
  </div>
  <Loader v-if="isLoading" />
</template>
