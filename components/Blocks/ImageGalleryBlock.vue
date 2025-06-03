<script setup lang="ts">
const { block, index } = defineProps<{ block: { links: string[] },  index: number }>();

import { useSwiper } from "@/composables/swiper/useSwiper";

const {
  currentSlides,
  totalSlides,
  onSwiper,
  prevSlide,
  nextSlide,
  onSlideChange,
} = useSwiper();

const emit = defineEmits<{
  (e: "toggleDetail", index: number, ind: number): void;
}>();

const eventToggleDetail = (galleryIndex: number, slideIndex: number) => {
  emit('toggleDetail', galleryIndex, slideIndex);
}

const imageConfig = useRuntimeConfig().public.imageBase;
</script>

<template>
  <section>
    <div class="w-[56.25rem] max-sm:w-full flex mx-auto">
      <ClientOnly>
        <swiper
          @swiper="(swiper) => onSwiper(swiper, index)"
          @slide-change="onSlideChange(index)"
          class="w-full !flex rounded-[2rem] max-sm:rounded-3xl"
          :spaceBetween="20"
          :slidesPerView="1"
        >
          <swiper-slide v-for="(item, ind) in block.links" :key="ind" class="!h-auto !justify-center cursor-pointer">
            <nuxt-img
              @click="eventToggleDetail(index, ind)"
              :src="`${imageConfig}${item}`"
              class="w-[56.25rem] max-sm:w-full h-[25rem] object-cover rounded-[2rem] max-sm:rounded-3xl"
              :placeholder="true"
              format="webp"
              alt=""
              loading="lazy"
            />
          </swiper-slide>
        </swiper>
      </ClientOnly>
    </div>
    <SwiperNavigation :currentSlide="currentSlides[index] + 1" :totalSlides="totalSlides[index] || 0" @prev="prevSlide(index)" @next="nextSlide(index)" />
  </section>
</template>
