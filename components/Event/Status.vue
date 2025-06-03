<script setup lang="ts">
import check from '@/assets/images/icons/eventCheck.svg'
import eventClose from '@/assets/images/icons/eventClose.svg'
import loader from '@/assets/images/icons/loader.svg'

const props = defineProps<{
    status: string
}>()


const getStatusMap = new Map<string, string>([
    ['approved', 'Одобренное'],
    ['pending', 'Ожидайте ответа модератора'],
    ['completed', 'Прошедшие'],
    ['rejected', 'Неодобренное']
]);

const getIcon = new Map<string, string>([
    ['approved', check],
    ['pending', loader],
    ['rejected', eventClose]
])
</script>

<template>
    <div class="text-[#98A2B3] text-[0.875rem] flex items-center gap-[0.375rem]">
        <img :src="getIcon.get(status)">
        <span>
            {{ getStatusMap.get(status) }}
        </span>
    </div>
</template>