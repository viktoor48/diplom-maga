<script setup lang="ts">
const { baseUrl } = useRuntimeConfig().public;

const { galleryImages } = defineProps<{ galleryImages: Array<string> }>();

const emit = defineEmits(["clearFile"]);

const removeFile = (i) => {
  galleryImages.splice(i, 1);
};

const moveUpPhoto = (i) => {
  if (i > 0) {
    const photo = galleryImages[i];
    galleryImages.splice(i, 1);
    galleryImages.splice(i - 1, 0, photo);
  }
};

const moveDownPhoto = (i) => {
  if (i < galleryImages.length - 1) {
    const photo = galleryImages[i];
    galleryImages.splice(i, 1);
    galleryImages.splice(i + 1, 0, photo);
  }
};

let fileName = ref("");

const getFileName = (file) => {
  let lastSlashIndex = file.lastIndexOf("/");
  fileName.value = file.substring(lastSlashIndex + 1);
  return fileName.value;
};
</script>

<template>
  <transition-group name="list" tag="article">
    <div class="flex rounded-xl border border-gray-300 bg-white items-center h-[4.625rem] mb-2" v-for="(file, i) in galleryImages" :key="file">
      <div class="w-[10rem] h-full flex">
        <img :src="`${baseUrl}/${file}`" alt="File" class="w-[7.5rem] h-full rounded-l-xl content-center text-center object-cover" />
      </div>
      <div class="flex p-4 w-full items-center">
        <div class="flex flex-col gap-1 mr-auto">
          <span class="font-medium text-sm text-[#101828]">{{ getFileName(file) }}</span>
          <!-- <span class="text-xs text-[#474a52]">1 МБ</span> -->
        </div>
        <div class="flex gap-2 items-center ml-auto">
          <div class="flex gap-6 mr-1">
            <img src="/public/imgs/icons/move-block-icon.svg" alt="MoveUp" class="w-5 cursor-pointer hover:opacity-80 transition-all" @click="moveUpPhoto(i)" />
            <img
              src="/public/imgs/icons/move-block-icon.svg"
              alt="MoveDown"
              class="transform scale-y-[-1] w-5 cursor-pointer hover:opacity-80 transition-all"
              @click="moveDownPhoto(i)"
            />
          </div>
          <div class="w-[1px] h-6 bg-gray-300"></div>
          <nuxt-link :href="`${baseUrl}/${file}`" target="_blank">
            <img src="/public/imgs/icons/show-pic-icon.svg" alt="ShowPic" class="w-5 mx-2 cursor-pointer hover:opacity-80 transition-all" />
          </nuxt-link>
          <div class="w-[1px] h-6 bg-gray-300"></div>
          <img
            src="/public/imgs/icons/delete-pic-icon.svg"
            alt="DeletePic"
            class="w-5 mx-2 cursor-pointer hover:opacity-80 transition-all"
            @click="removeFile(i)"
          />
        </div>
      </div>
    </div>
  </transition-group>
</template>
