import { Swiper as SwiperCore } from "swiper";

export function useSwiper() {
  const swiperRefs = ref<Record<number, SwiperCore | null>>({});
  const currentSlides = ref<Record<number, number>>({});
  const totalSlides = ref<Record<number, number>>({});

  const onSwiper = (swiper: SwiperCore, index: number) => {
    swiperRefs.value[index] = swiper;
    currentSlides.value[index] = swiper.activeIndex;
    totalSlides.value[index] = swiper.slides.length;
  };

  const prevSlide = (index: number) => {
    if (swiperRefs.value[index]) {
      swiperRefs.value[index].slidePrev();
      currentSlides.value[index] = swiperRefs.value[index]?.activeIndex ?? 0;
    }
  };

  const nextSlide = (index: number) => {
    if (swiperRefs.value[index]) {
      swiperRefs.value[index].slideNext();
      currentSlides.value[index] = swiperRefs.value[index].activeIndex ?? 0;
    }
  };

  const onSlideChange = (index: number) => {
    if (swiperRefs.value[index]) {
      currentSlides.value[index] = swiperRefs.value[index].activeIndex ?? 0;
    }
  };

  return {
    swiperRefs,
    currentSlides,
    totalSlides,
    onSwiper,
    prevSlide,
    nextSlide,
    onSlideChange,
  };
}
