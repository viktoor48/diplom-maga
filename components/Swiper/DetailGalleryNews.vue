<script setup lang="ts">
import { Navigation, Keyboard } from "swiper/modules";
import { Swiper as SwiperCore } from "swiper";

const { images, initialSlide } = defineProps<{
  images: string[];
  initialSlide: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const swiperRef = ref<SwiperCore | null>(null);
const currentSlide = ref(initialSlide);

function close() {
  emit("close");
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    emit("close");
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
});
</script>

<template>
  <div class="relative flex flex-col rounded-3xl">
    <div class="gallery_background" @click.self="close">
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
                <img class="w-full h-[35rem] rounded-[2rem] object-cover max-sm:rounded-2xl" :src="`${$config.public.imageBase}/${image}`" alt="" />
              </div>
            </SwiperSlide>
          </Swiper>
        </client-only>

        <SwiperNavigation @prev="prevSlide" @next="nextSlide" :currentSlide="currentSlide + 1" :totalSlides="images.length" :inFullScreen="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.swiper-button-next {
  margin: 40px;
}

.swiper-button-prev {
  margin: 40px;
}

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
  overflow: auto;
}

.swiper-2xl {
  @media screen and (min-width: 1920px) {
    height: 75%;
  }
}
</style>
