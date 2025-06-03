<script setup lang="ts">
import { Calendar } from '@/components/UI/calendar'
import { type DateValue } from "@internationalized/date";

const dateValue = ref<DateValue>()

const props = defineProps<{
    initialDate?: DateValue,
}>();

if (props.initialDate) {
    dateValue.value = props.initialDate;
}

const emit = defineEmits<{
    (e: "apply", dateValue: DateValue): void;
    (e: "cancel"): void;
}>();

const applyCalendar = () => {
    if (dateValue.value) {

        emit("apply", dateValue.value);
    }
};

const cancelCalendar = () => {
    emit("cancel");
};
</script>

<template>
    <div @click.stop="" class="bg-white">
        <Calendar v-model="dateValue" locale="ru" class="w-[24.625rem]" />
        <footer>
            <FiltersButtons @apply="applyCalendar" @cancel="cancelCalendar" />
        </footer>
    </div>
</template>
