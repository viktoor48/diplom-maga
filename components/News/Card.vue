<script setup lang="ts">
import type { NewsCard } from "~/types";
import { useFormattedDate } from "~/composables/useFormattedDate";
import { useNews } from "~/composables/requests/useNews";

const { deleteNewsById } = useNews();

const props = defineProps<{
  card: NewsCard;
}>();

const emit = defineEmits(["refreshNewsList"]);


const deleteCard = async () => {
  await deleteNewsById(props.card.id);
  emit("refreshNewsList");
}

const getFormattedDate = computed(() => useFormattedDate(props.card.date));
</script>
<template>
  <article class="flex flex-col bg-gray-50 rounded-3xl w-full hover:bg-[#F4FCF3] hover:shadow-md duration-300 relative">
    <div class="h-[12.5rem] max-sm:w-full">
      <nuxt-img
        :src="`${$config.public.imageBase}${props.card.photo}`"
        class="h-[12.5rem] w-full object-cover rounded-3xl"
        :placeholder="true"
        format="webp"
        alt=""
      />
    </div>
    <div class="flex flex-col justify-between gap-2 h-full mt-4 px-6 pb-6">
      <div class="text-wrap line-clamp-3 truncate whitespace-normal text-[1.375rem] font-medium leading-[127%]" v-html="props.card.title"></div>
      <div class="flex flex-col gap-2">
        <div class="text-wrap line-clamp-3 truncate whitespace-normal mt-auto text-[1rem] leading-[150%]">
          {{ props.card.subtitle }}
        </div>
      </div>
      <div class="mt-auto">
        <div class="text-wrap line-clamp-3 truncate whitespace-normal text-[0.875rem] leading-[171%] text-[#829086]">
          {{ getFormattedDate }}
        </div>
        <EditDeleteButtons :to="`/news/edit/${card.id}`" @delete="deleteCard" />
      </div>
    </div>
    <div v-if="card.is_pinned" class="absolute right-[0.75rem] top-[0.75rem] w-6 h-6 bg-[#F2F4F7] rounded-2xl flex justify-center items-center">
      <img src="~/assets/images/icons/pinned.svg" alt="">
    </div>
  </article>
</template>
