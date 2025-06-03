<script setup lang="ts">
interface SwiperProps {
  items: Array<any>;
  swiperOptions: Record<string, any>;
  slidesPerView?: number;
  spaceBetween?: number;
  grid?: {
    rows?: number;
  };
}

//значения по умолчанию
const props = withDefaults(defineProps<SwiperProps>(), {
  slidesPerView: 1,
  spaceBetween: 20,
  grid: () => ({ rows: 1, cols: 1 }),
});
</script>

<template>
  <swiper class="w-full !flex" :options="swiperOptions" :spaceBetween="props.spaceBetween" :slidesPerView="slidesPerView" :grid="props.grid">
    <swiper-slide v-for="(item, index) in props.items" :key="index" class="!h-auto">
      <slot :item="item"></slot>
    </swiper-slide>
  </swiper>
</template>

<style></style>
