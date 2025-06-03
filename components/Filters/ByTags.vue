<script setup lang="ts">
import { useClickOutside, useBodyScroll, useEventsFilters } from "#imports";
import CheckboxInput from "../UI/Checkbox.vue";

const { isMobile } = useWindowWidth();

const filterIsOpen: Ref<boolean> = ref(false);
const selectedTags = ref<string[]>([]);

const buttonRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const hoveredTag = ref<string | null>(null);

useClickOutside(closeMenu, [buttonRef, menuRef]);
const { enableBodyScroll, disableBodyScroll } = useBodyScroll();

const { fetchedTags } = defineProps<{ fetchedTags: string[] | null }>();

const emit = defineEmits<{
  (e: "closeAll"): void;
  (e: "selectTags", tags: string[]): void;
}>();

const eventTags = [
  "Финансы",
  "Инвестиции",
  "Бюджетирование",
  "Налоги",
  "Банковские услуги",
  "Страхование",
  "Пенсионные накопления",
  "Кредиты и займы",
  "Личный капитал",
  "Расходы",
  "Сбережения",
  "Финансовая грамотность",
];

if (fetchedTags) {
  selectedTags.value = fetchedTags;
}

async function toggleMenu() {
  filterIsOpen.value = !filterIsOpen.value;
  if (filterIsOpen.value) {
    await nextTick();
    menuRef.value?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

function closeMenu() {
  filterIsOpen.value = false;
  emit("closeAll");
}

function isTagSelected(tag: string): boolean {
  return selectedTags.value.includes(tag);
}

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
}

function selectTag(tag: string) {
  if (isTagSelected(tag)) {
    toggleTag(tag);
  } else if (selectedTags.value.length < 3) {
    toggleTag(tag);
  }

  emit("selectTags", selectedTags.value);
}

const selectedTagsText = computed(() => {
  const count = selectedTags.value.length;
  if (count === 0) return "Выбрать теги";
  return `Выбрать теги (${count})`;
});

watch(filterIsOpen, (newValue) => {
  if (newValue && isMobile.value) {
    disableBodyScroll();
  } else {
    enableBodyScroll();
  }
});

watch(
  () => fetchedTags,
  (newTags) => {
    if (newTags) {
      selectedTags.value = [...newTags];
    } else {
      selectedTags.value = [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <button
    v-if="!isMobile"
    @click="toggleMenu"
    ref="buttonRef"
    class="flex h-[2.64rem] relative text-[1rem] leading-[125%] rounded-xl font-medium py-2.5 px-3.5 bg-white border border-[#D0D5DD] duration-300 hover:bg-[#F9FAFB] group"
    :class="{ 'text-[#667085]': !selectedTags.length }"
  >
    <span>{{ selectedTagsText }}</span>
    <img
      class="h-5 w-5 ml-auto rotate-180 duration-300"
      :class="{ 'rotate-[360deg]': filterIsOpen }"
      src="~/assets/images/icons/chevron-down.svg"
      alt="chevron"
    />

    <aside
      v-if="filterIsOpen"
      ref="menuRef"
      class="absolute z-20 -right-[2px] top-[100%] mt-2 px-1 py-[0.375rem] rounded-2xl bg-white w-[17.75rem] menu-shadow"
    >
      <div class="w-full flex flex-col h-fit overflow-auto scroll" id="tags-dropdown">
        <div
          @click.stop="() => selectTag(tag)"
          v-for="(tag, index) in eventTags"
          :key="index"
          @mouseenter="hoveredTag = tag"
          @mouseleave="hoveredTag = null"
          class="flex items-center gap-[0.625rem] p-2 hover:bg-[#F2F4F7] rounded-xl duration-300 w-[16.125rem]"
          :class="{
            'opacity-50': !isTagSelected(tag) && selectedTags.length >= 3,
          }"
        >
          <CheckboxInput
            :model-value="isTagSelected(tag)"
            @update:model-value="() => selectTag(tag)"
            :is-hovered="hoveredTag === tag"
            :disabled="!isTagSelected(tag) && selectedTags.length >= 3"
          />
          <label class="text-[0.9rem] leading-[125%] text-[#101828] font-medium text-left">
            {{ tag }}
          </label>
        </div>
      </div>
    </aside>
  </button>
</template>

<style scoped>
.menu-shadow {
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
}

.scroll::-webkit-scrollbar {
  width: 6px;
}
</style>
