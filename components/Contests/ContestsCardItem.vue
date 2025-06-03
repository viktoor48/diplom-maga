<script setup lang="ts">
import { useFormattedDate } from "~/composables/useFormattedDate";
import { useContests } from "~/composables/requests/useContests";

const { deleteContestById } = useContests();

const { card } = defineProps<{ card: any }>();
const emit = defineEmits(["refreshContestsList"]);

const computedCardStatus = computed(() => getCardStatus(card));

const formattedStartDate = computed(() => useFormattedDate(card.date_start));
const formattedEndDate = computed(() => useFormattedDate(card.date_end));

const getCardStatus = (card: any) => {
  return {
    "bg-[#EBF7EB] text-[#208656]": card.is_active,
    "bg-[#F2F4F7] text-[#667085]": !card.is_active,
  };
};

const deleteCard = () => {
  deleteContestById(card.id, { method: "DELETE" });
  emit("refreshContestsList");
};
</script>

<template>
  <li class="flex flex-col w-full h-[24rem] rounded-[1.5rem] p-6 gap-6 cursor-pointer bg-gray-50 hover:bg-[#F4FCF3] hover:shadow-md duration-300">
    <span class="max-h-[2.25rem] w-fit py-2 px-3 rounded-xl" :class="computedCardStatus">{{ card.is_active ? "Активно" : "Завершено" }}</span>
    <span class="text-[#667085]">{{ formattedStartDate }} - {{ formattedEndDate }}</span>
    <div class="flex flex-col gap-2 h-[10.688rem]">
      <h3 class="h-1/2 text-[1.375rem] leading-[1.2] font-medium text-wrap truncate line-clamp-3" v-html="card.title"></h3>
      <p class="h-1/2 mt-2 text-[1.125rem] leading-[1.4] text-wrap truncate line-clamp-3">
        {{ card.subtitle }}
      </p>
    </div>
    <EditDeleteButtons :to="`contests/${card.id}`" class="mt-auto" @delete="deleteCard" />
  </li>
</template>
