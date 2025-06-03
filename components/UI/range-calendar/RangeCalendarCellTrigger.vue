<script lang="ts" setup>
import type { RangeCalendarCellTriggerProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { buttonVariants } from "@/components/UI/button";
import { cn } from "@/lib/utils";
import { RangeCalendarCellTrigger, useForwardProps } from "radix-vue";
import { computed } from "vue";

const props = defineProps<RangeCalendarCellTriggerProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <RangeCalendarCellTrigger
    class="w-full"
    :class="
      cn(
        buttonVariants({ variant: 'ghost' }),
        'h-9 w-9 p-0 font-normal data-[selected]:opacity-100',
        '[&[data-today]:not([data-selected])]:bg-neutral-100 text-[1rem]',
        // Selection Start
        'data-[selection-start]:bg-[#B9E9AE] data-[selection-start]:text-neutral-50 data-[selection-start]:hover:bg-[#B9E9AE] data-[selection-start]:hover:text-neutral-50 data-[selection-start]:focus:bg-[#B9E9AE] data-[selection-start]:focus:text-neutral-50',
        // Selection End
        'data-[selection-end]:bg-[#B9E9AE] data-[selection-end]:text-neutral-50 data-[selection-end]:hover:bg-[#B9E9AE] data-[selection-end]:hover:text-neutral-50 data-[selection-end]:focus:bg-[#B9E9AE] data-[selection-end]:focus:text-neutral-50',
        // Outside months
        'data-[outside-view]:text-neutral-500 data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-neutral-100/50 [&[data-outside-view][data-selected]]:text-neutral-500 [&[data-outside-view][data-selected]]:opacity-30',
        // Disabled
        'data-[disabled]:text-neutral-500 data-[disabled]:opacity-50',
        // Unavailable
        'data-[unavailable]:text-neutral-50 data-[unavailable]:line-through',
        props.class,
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarCellTrigger>
</template>
