<script setup lang="ts">
import type { WithClassAsProps } from "./interface";
import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/button";
import { ArrowRight } from "lucide-vue-next";
import { useCarousel } from "./useCarousel";

const props = defineProps<WithClassAsProps>();

const { orientation, canScrollNext, scrollNext } = useCarousel();
</script>

<template>
  <Button
    :disabled="!canScrollNext"
    :class="
      cn(
        'touch-manipulation absolute h-8 w-8 rounded-lg p-0 hover:bg-[#F2F4F7] duration-300',
        orientation === 'horizontal' ? '-right-12 top-1/2 -translate-y-1/2' : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        props.class
      )
    "
    variant="outline"
    @click="scrollNext"
  >
    <slot>
      <img src="/assets/images/icons/alt-arrow-right.svg" alt="" />
      <span class="sr-only">Next Slide</span>
    </slot>
  </Button>
</template>
