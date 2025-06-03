<script setup lang="ts">
import type { CustomPeriod } from "~/types";

import type { DateRange } from "radix-vue";
import { RangeCalendar } from "@/components/UI/range-calendar";
import { getLocalTimeZone, today } from "@internationalized/date";

const start = today(getLocalTimeZone());
const end = start.add({ days: 6 });

const value = ref({
  start,
  end,
}) as Ref<DateRange>;

const emit = defineEmits<{
  (e: "apply", period: CustomPeriod): void;
  (e: "cancel"): void;
}>();

const applyCalendar = () => {
  if (value.value.start && value.value.end) {
    const period: CustomPeriod = {
      start: value.value.start.toString(),
      end: value.value.end.toString(),
    };

    emit("apply", period);
  }
};

const cancelCalendar = () => {
  emit("cancel");
};
</script>

<template>
  <div @click.stop="">
    <RangeCalendar locale="ru" v-model="value" class="" />
    <footer>
      <FiltersButtons @apply="applyCalendar" @cancel="cancelCalendar" />
    </footer>
  </div>
</template>
