<script setup lang="ts">
import clock from "~/assets/images/icons/clock.svg"
import calendar from "~/assets/images/icons/calendar.svg"
import users from "~/assets/images/icons/users-icon.svg"
import markerPin from "~/assets/images/icons/marker-pin-06.svg"

type IconType = 'time' | 'date' | 'people' | 'location';

const props = defineProps<{
    type: IconType;
}>();

const iconsMap = new Map<IconType, string>([
    ['time', clock],
    ['date', calendar],
    ['people', users],
    ['location', markerPin]
]);

</script>
<template>
    <div class="flex items-center gap-2 text-[1rem] leading-[150%] text-[#101828] bg-[#F2F4F7] rounded-3xl py-1 px-4 max-sm:px-2 max-sm:gap-[0.375rem] max-sm:text-[0.875rem]" :class="{'flex-shrink-0': type !== 'location'}">
        <span class="line-clamp-1">
            <slot></slot>
        </span>
    </div>
</template>
