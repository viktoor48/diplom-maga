<script setup lang="ts">
import { Navigation, Keyboard } from "swiper/modules";
import { Swiper as SwiperCore } from "swiper";

const { images } = defineProps<{
  images: { id: number; src: string; alt: string }[];
}>();

const openGallery = ref(false);
const swiperRef = ref<SwiperCore | null>(null);
const currentSlide = ref(0);

const { enableBodyScroll, disableBodyScroll } = useBodyScroll();

function openSlide(index: number) {
  openGallery.value = !openGallery.value;
  openGallery.value ? disableBodyScroll() : enableBodyScroll();
  currentSlide.value = index;
}

function toggleSlide() {
  openGallery.value = !openGallery.value;
  openGallery.value ? disableBodyScroll() : enableBodyScroll();
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    openGallery.value = false;
    enableBodyScroll();
  }
}

const onSwiper = (swiper: any) => {
  swiperRef.value = swiper;
  currentSlide.value = swiper.activeIndex;
};

const prevSlide = () => {
  if (swiperRef.value) {
    swiperRef.value.slidePrev();
    currentSlide.value = swiperRef.value.activeIndex;
  }
};

const nextSlide = () => {
  if (swiperRef.value) {
    swiperRef.value.slideNext();
    currentSlide.value = swiperRef.value.activeIndex;
  }
};

const onSlideChange = () => {
  if (swiperRef.value) {
    currentSlide.value = swiperRef.value.activeIndex;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  document.body.classList.remove("overflow-hidden");
});

const imageConfig = useRuntimeConfig().public.imageBase;
</script>

<template>
  <div class="relative flex flex-col rounded-3xl">
    <ul class="grid grid-cols-4 gap-5">
      <li
        v-for="(image, index) in images"
        :key="image.id"
        class="w-full h-[14rem] rounded-2xl hover:shadow-md duration-300 cursor-pointer max-sm:w-full max-sm:hover:shadow-none"
      >
        <nuxt-img
          :src="`${imageConfig}${image.src}`"
          :alt="image.alt"
          @click="openSlide(index)"
          class="rounded-2xl w-full h-full object-cover"
          format="webp"
          :placeholder="true"
        />
      </li>
    </ul>

    <div v-if="openGallery" class="gallery_background" @click.self="toggleSlide">
      <div class="relative z-20 mx-auto w-[70%] h-[40rem] swiper-2xl max-sm:h-[15rem] max-sm:w-[90%]">
        <client-only>
          <Swiper
            @swiper="onSwiper"
            @slide-change="onSlideChange"
            :modules="[Navigation, Keyboard]"
            :slides-per-view="1"
            :initial-slide="currentSlide"
            :space-between="10"
            :keyboard="{ enabled: true }"
            class="rounded-[2rem] max-sm:rounded-2xl"
          >
            <SwiperSlide v-for="(image, index) in images" :key="index" class="m-auto">
              <div class="flex rounded-[2rem] w-full items-center justify-center max-sm:rounded-2xl" id="gallery">
                <img class="w-full h-full rounded-[2rem] object-cover max-sm:rounded-2xl" :src="`${imageConfig}${image.src}`" alt="Фото" />
              </div>
            </SwiperSlide>
          </Swiper>
        </client-only>
        <SwiperNavigation
          class="w-full max-sm:pr-0 max-sm:pt-2"
          :current-slide="currentSlide + 1"
          :total-slides="images.length"
          :in-full-screen="true"
          @prev="prevSlide"
          @next="nextSlide"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.swiper {
  height: 100%;
}

.gallery_background {
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-2xl {
  @media screen and (min-width: 1920px) {
    height: 75%;
  }
}
</style>
