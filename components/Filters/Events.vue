<script setup lang="ts">
import type { Filter, CustomPeriod, FilterOption } from "~/types";
import { useClickOutside } from "#imports";
import { useBodyScroll } from "#imports";
import { useEventFilters } from "~/composables/useEventPeriodFilters";

const { isMobile } = useWindowWidth();

const filterIsOpen: Ref<Boolean> = ref(false);
const isPeriodSelected = ref(false);
const selectedFilter = ref<FilterOption | null>(null); // Для временного хранения выбранного фильтра

const buttonRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

useClickOutside(closeMenu, [buttonRef, menuRef]);
const { enableBodyScroll, disableBodyScroll } = useBodyScroll();

const { filtersState, resetFilters, updateFilter, updateCustomPeriod, queryString } = useEventFilters();

const { error } = defineProps<{ error: any }>();

const filters: Filter[] = [
    {
        label: "За всё время",
        action: (event) => {
            const filter = "За всё время";
            if (isMobile.value) {
                selectedFilter.value = filter; // Сохраняем выбранный фильтр для мобильной версии
            } else {
                handleDesktopFilter(filter); // Применяем сразу для десктопа
            }
        },
        isActive: () => filtersState.value.selectedFilter === "За всё время",
    },
    {
        label: "За неделю",
        action: (event) => {
            const filter = "За неделю";
            if (isMobile.value) {
                selectedFilter.value = filter; // Сохраняем выбранный фильтр для мобильной версии
            } else {
                handleDesktopFilter(filter); // Применяем сразу для десктопа
            }
        },
        isActive: () => filtersState.value.selectedFilter === "За неделю",
    },
    {
        label: "За сегодня",
        action: (event) => {
            const filter = "За сегодня";
            if (isMobile.value) {
                selectedFilter.value = filter; // Сохраняем выбранный фильтр для мобильной версии
            } else {
                handleDesktopFilter(filter); // Применяем сразу для десктопа
            }
        },
        isActive: () => filtersState.value.selectedFilter === "За сегодня",
    },
    {
        label: "За месяц",
        action: (event) => {
            const filter = "За месяц";
            if (isMobile.value) {
                selectedFilter.value = filter; // Сохраняем выбранный фильтр для мобильной версии
            } else {
                handleDesktopFilter(filter); // Применяем сразу для десктопа
            }
        },
        isActive: () => filtersState.value.selectedFilter === "За месяц",
    },
    {
        label: "Выбрать период...",
        action: (event) => {
            if (isMobile.value) {
                selectedFilter.value = "Выбрать период...";
                openCalendar();
            } else {
                openCalendar(); // Открываем календарь для десктопа
            }
        },
        isActive: () => isPeriodSelected.value,
    },
];

function toggleMenu() {
    filterIsOpen.value = !filterIsOpen.value;
}

function closeMenu() {
    filterIsOpen.value = false;
    isPeriodSelected.value = false;
}

// Применение фильтра (мобильная версия)
function applyFilter() {
    if (selectedFilter.value) {
        if (selectedFilter.value === "Выбрать период...") {
            isPeriodSelected.value = true; // Открываем календарь
        } else {
            updateFilter(selectedFilter.value); // Применяем выбранный фильтр
        }
        selectedFilter.value = null; // Сбрасываем временное значение
        closeMenu();
    }
}

// Отмена фильтра (мобильная версия)
function cancelFilter() {
    selectedFilter.value = null; // Сбрасываем временное значение
    closeMenu();
}

// Логика для десктопа
function handleDesktopFilter(filter: FilterOption) {
    if (filter !== "Выбрать период...") {
        updateFilter(filter); // применяем фильтр
        closeMenu();
    } else {
        openCalendar();
    }
}

watch(filterIsOpen, (newValue, oldValue) => {
    if (newValue === true) {
        if (isMobile.value === true) {
            disableBodyScroll();
        }

        return;
    }

    enableBodyScroll();
});

function openCalendar() {
    isPeriodSelected.value = true;
}

// Обработка выбора периода через календарь
function handleCalendarApply(period: CustomPeriod) {
    updateCustomPeriod(period); // Применяем выбранный период
    isPeriodSelected.value = false; // Закрываем календарь
    closeMenu();
}

function handleCalendarCancel() {
    isPeriodSelected.value = false; // Закрываем календарь
    closeMenu();
}
</script>

<template>
    <button @click="toggleMenu" ref="buttonRef" :class="{ relative: isMobile === false }"
        class="flex items-center h-9 gap-1 text-[1rem] px-4 rounded-lg font-medium text-black bg-white border border-[#D0D5DD] duration-300 hover:bg-[#F9FAFB] group"
        :disabled="error">
        <span class="max-sm:text-[0.78rem]">{{ filtersState.selectedFilter }}</span>
        <img class="h-5 w-5 rotate-180 duration-300" :class="{ 'rotate-[360]': filterIsOpen === true }"
            src="~/assets/images/icons/chevron-down.svg" alt="" />
        <aside v-if="filterIsOpen && !isMobile" ref="menuRef"
            class="absolute z-20 -left-[1px] top-[100%] mt-[0.375rem] p-1 rounded-2xl bg-white menu-shadow">
            <div v-if="isPeriodSelected !== true" class="flex flex-col w-[11.875rem]">
                <div class="w-full" v-for="(filter, index) in filters" :key="index">
                    <p @click.stop="filter.action"
                        class="p-3 text-[1rem] leading-[150%] text-[#101828] font-medium text-left rounded-xl duration-300 hover:bg-[#F2F4F7]"
                        :class="{ 'bg-[#F2F4F7]': filter.isActive && filter.isActive(), 'mb-[0.2rem]': index !== 0, 'mb-0': index === filters.length - 1 }">
                        {{ filter.label }}
                    </p>
                    <hr v-if="index === 0" class="bg-[#0A15121A]/10 h-[0.063rem] my-[0.125rem] mx-3 rounded-full" />
                </div>
            </div>
            <!-- Календарь -->
            <div v-else-if="isPeriodSelected === true" class="w-full flex flex-col">
                <FiltersCalendar @apply="handleCalendarApply" @cancel="handleCalendarCancel" />
            </div>
        </aside>
    </button>
    <div @click="closeMenu" v-if="filterIsOpen && isMobile" :class="{ 'bg-black/60': filterIsOpen }"
        class="absolute right-0 left-0 top-0 bottom-0 w-full flex flex-col justify-end z-[2000]">
        <div @click.stop="" class="w-full flex flex-col pt-2 bg-white rounded-t-[1.5rem]">
            <header class="flex items-center justify-between px-4 mb-4">
                <h3 class="text-[1.25rem] leading-[120%] font-medium">Сортировка</h3>
                <div @click="closeMenu" class="p-3">
                    <img class="w-6 h-6" src="~/assets/images/icons/cross.svg" alt="cross" />
                </div>
            </header>
            <main class="w-full">
                <div v-if="isPeriodSelected === false">
                    <div v-for="(filter, index) in filters" :key="index" class="cursor-pointer">
                        <p @click="filter.action"
                            class="py-3 px-4 text-[1rem] leading-[150%] text-[#101828] font-medium text-left rounded-xl duration-300 hover:bg-[#F2F4F7]">
                            {{ filter.label }}
                        </p>
                        <hr v-if="index === 0" class="bg-[#0A15121A]/10 my-[0.125rem] mx-3 rounded-full" />
                    </div>
                </div>
                <div v-else-if="isPeriodSelected === true" class="w-full flex flex-col">
                    <FiltersCalendar @apply="handleCalendarApply" @cancel="handleCalendarCancel" />
                </div>
            </main>
            <footer v-if="isPeriodSelected === false">
                <FiltersButtons @apply="applyFilter" @cancel="cancelFilter" />
            </footer>
        </div>
    </div>
</template>

<style scoped></style>
