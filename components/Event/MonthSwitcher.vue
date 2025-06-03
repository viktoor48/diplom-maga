<script setup lang="ts">

const props = defineProps<{
  modelValue: { name: string; number: number }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { name: string; number: number }): void
}>()

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const currentMonthIndex = computed(() => props.modelValue.number - 1)

const prevMonth = () => {
  const newIndex = (currentMonthIndex.value - 1 + 12) % 12
  emit('update:modelValue', {
    name: MONTHS[newIndex],
    number: newIndex + 1,
  })
}

const nextMonth = () => {
  const newIndex = (currentMonthIndex.value + 1) % 12
  emit('update:modelValue', {
    name: MONTHS[newIndex],
    number: newIndex + 1,
  })
}

const currentMonthName = computed(() => MONTHS[currentMonthIndex.value])

</script>

<template>
  <div class="flex justify-between items-center gap-4 text-black font-medium min-w-[12.356rem] max-sm:w-full">
    <button
      @click="prevMonth"
      class="bg-white p-2 rounded-2xl border border-[#D0D5DD] hover:bg-gray-100 flex justify-center items-center w-10 h-10 duration-300"
      aria-label="Previous month"
    >
      <img src="/assets/images/icons/AltArrowLeft.svg" alt="" />
    </button>

    <transition name="fade-slide" mode="out-in">
      <span class="text-lg" :key="currentMonthName">{{ currentMonthName }}</span>
    </transition>

    <button
      @click="nextMonth"
      class="bg-white p-2 rounded-2xl border border-[#D0D5DD] hover:bg-gray-100 flex justify-center items-center w-10 h-10 duration-300"
      aria-label="Next month"
    >
      <img src="/assets/images/icons/AltArrowRight.svg" alt="" />
    </button>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
  display: inline-block;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
