<script setup>
import { Listbox, ListboxLabel, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  sorting: Array,
  selectBottom: Boolean,
  selectRight: Boolean,
});

const emit = defineEmits(["addBlock", "filterPerPage", "sortDate", "sortCategory"]);

const selectedFilter = ref(props.sorting[0]);
const isSelectOpen = ref(false);

const sort = (item) => {
  if (item.unavailable) {
    return;
  }

  switch (item.type) {
    case "block":
      emit("addBlock", item.name);
      selectedFilter.value = props.sorting[0];
      break;
    case "perPageFilter":
      emit("filterPerPage", item.perPage);
      break;
    case "sortDate":
      emit("sortDate", item.state);
      break;
    case "category":
      emit("sortCategory", item.id);
      break;
  }
  isSelectOpen.value = false;
};

const dynamicClasses = computed(() => {
  return {
    "mb-1 bottom-full": props.selectBottom,
    "right-0": props.selectRight,
  };
});

const toggleSelect = () => {
  isSelectOpen.value = !isSelectOpen.value;
};
</script>

<template>
  <div class="mb-6">
    <Listbox v-model="selectedFilter">
      <div class="relative">
        <ListboxButton
          class="shadow relative w-fit cursor-pointer rounded-xl border border-[#D0D5DD] bg-white py-1.5 pl-3 pr-10 text-left hover:bg-gray-100 duration-300 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-200 sm:text-sm"
          @click="toggleSelect"
        >
          <!-- <span class="block truncate font-medium">{{ selectedFilter.name }}</span> -->
          <span class="block truncate font-medium">Добавить блок</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon class="h-5 w-5 text-gray-400 rotate-0 duration-300" aria-hidden="true" :class="{ 'rotate-180 duration-300': isSelectOpen }" />
          </span>
        </ListboxButton>

        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions
            class="absolute mt-1 max-h-[14rem] w-fit overflow-auto rounded-xl bg-white text-sm py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
            :class="dynamicClasses"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="item in sorting"
              :key="item.id"
              :value="item"
              as="template"
              :disabled="item.unavailable"
              @click.stop="sort(item)"
            >
              <li
                :class="[
                  active ? 'bg-[#EAECF0] cursor-pointer text-[#101828] duration-300' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-2 pr-8 mx-1 rounded-md',
                ]"
              >
                <span :class="[selected ? 'font-normal' : 'font-normal', 'block truncate', { 'opacity-75': item.unavailable }]">{{ item.name }}</span>
                <!-- <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-[#101828]">
                  <CheckIcon v-if="!item.unavailable" class="h-5 w-5" aria-hidden="true" />
                </span> -->
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
