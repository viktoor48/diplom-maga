<script lang="ts" setup>
import type { RangeCalendarCellProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { RangeCalendarCell, useForwardProps } from "radix-vue";
import { computed } from "vue";

const props = defineProps<RangeCalendarCellProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <RangeCalendarCell
    :class="
      cn(
        'relative h-9 w-full p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-[#EBF3F0] first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md [&:has([data-selected][data-outside-view])]:bg-neutral-100/50 [&:has([data-selected][data-selection-end])]:rounded-r-md [&:has([data-selected][data-selection-start])]:rounded-l-md',
        props.class,
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarCell>
</template>
