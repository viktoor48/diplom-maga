<script setup lang="ts">
import type { NewsCard } from "~/types";
import { useFilters } from "~/composables/useFilters";
import { useNews } from "~/composables/requests/useNews";

import { scrollToTop } from "~/utils/paginationScroll";

import { watchDebounced } from "@vueuse/core";

import Pagination from "~/components/Pagination.vue";
import AddCardButton from "~/components/UIComponents/AddCardButton.vue";

const searchQuery = ref<string>("");
const isNoContent = ref<boolean>(false);
const pinnedTab = ref<boolean>(false);

const { queryString, resetFilters } = useFilters();
const { currentPage, total, itemsPerPage, isPaginationLoading } = usePagination();
const { fetchNews, fetchPinnedNews, pinnedNewsList } = useNews();

resetFilters();

const formRequestParams = () => {
  const params: any = { page: currentPage.value };
  if (searchQuery.value) {
    params.search = searchQuery.value;
  }

  if (pinnedTab.value) {
    params.pinned = true;
  }
  return params;
};

const {
  data: newsList,
  error,
  status,
  refresh: refreshNews,
} = await useAsyncData<NewsCard[]>(
  "news",
  async () => {
    const response = (await fetchNews({
      params: {
        ...formRequestParams(),
        ...Object.fromEntries(new URLSearchParams(queryString.value)),
      },
    })) as { data: NewsCard[]; meta: { total: number; per_page: number } };

    if (response === undefined) {
      isNoContent.value = true;
      return [];
    } else {
      isNoContent.value = false;
      total.value = response.meta.total;
      itemsPerPage.value = response.meta.per_page;

      return response.data;
    }
  },
  {
    server: false,
    default: () => [],
  }
);

if (error.value) {
  console.error("Ошибка при получении данных:", error.value);
  isNoContent.value = false;
}

const paginate = async (event: number) => {
  currentPage.value = event;
  scrollToTop("news-list");
};

watch(
  () => queryString.value,
  (newQueryString) => {
    currentPage.value = 1;
    refreshNews();
  }
);

watch(currentPage, () => {
  refreshNews();
});

onMounted(async () => {
  await fetchPinnedNews();
});

watchDebounced(
  searchQuery,
  () => {
    if (searchQuery.value.trim() !== "") {
      refreshNews();
    } else {
      refreshNews();
    }
    currentPage.value = 1;
  },
  { debounce: 500, maxWait: 5000 }
);

const refreshListOnDelete = async () => {
  await fetchNews({ params: { page: currentPage.value } });
  refreshNews();
  fetchPinnedNews();
};

const editTab = (pinned: boolean) => {
  pinnedTab.value = pinned;
  scrollToTop("news-list");
};

watch(pinnedTab, () => {
  currentPage.value = 1;
  refreshNews();
});
</script>

<template>
  <SectionsBlocks>
    <SectionsHeader v-model="searchQuery">
      <template #title> Новости </template>
      <template #add-button>
        <AddCardButton :redirect-link="'/news/create'" />
      </template>
      <template #footer>
        <div class="flex items-center gap-1 mt-10">
          <FiltersComponent :error="false" />
          <button
            class="flex justify-center items-center gap-1 px-4 border h-9 border-[#D0D5DD] hover:bg-[#F2F4F7] rounded-lg duration-300"
            @click="editTab(false)"
            :class="{ 'bg-[#E6F1E5] hover:!bg-[#D0E5CF]': !pinnedTab }"
          >
            Все
          </button>
          <button
            v-if="pinnedNewsList?.length"
            :class="{ 'bg-[#E6F1E5] hover:!bg-[#D0E5CF]': pinnedTab }"
            class="flex justify-center items-center gap-2 h-9 px-4 border border-[#D0D5DD] hover:bg-[#F2F4F7] rounded-lg duration-300"
            @click="editTab(true)"
          >
            Закрепленные <span class="bg-[#E6F1E5] rounded-[0.375rem] px-2 h-[1.25rem]">{{ pinnedNewsList.length }} из 6</span>
          </button>
        </div>
      </template>
    </SectionsHeader>
    <SectionsMain>
      <SectionsContainer>
        <section class="flex flex-col gap-6" :class="{ 'h-[75%]': !newsList.length }">
          <ul v-if="status === 'success' && newsList.length" id="news-list" class="grid grid-cols-3 gap-5 relative pb-4">
            <NewsCard v-for="(newsItem, index) in newsList" :card="newsItem" :key="index" @refresh-news-list="refreshListOnDelete" />
          </ul>
          <ul v-else-if="status === 'pending'" class="grid grid-cols-3 gap-5 relative pb-4">
            <Skeleton v-for="i in 9" :key="i" class="w-full h-[30.125rem] rounded-3xl bg-gray-100" />
          </ul>
          <WarningsEmptyList v-if="isNoContent">Карточки по вашему запросу не найдены</WarningsEmptyList>
          <WarningsEmptyList v-if="!newsList.length && status === 'success' && !isNoContent">Список карточек пуст </WarningsEmptyList>
          <WarningsError v-if="status === 'error'"> Произошла ошибка :(</WarningsError>
        </section>
      </SectionsContainer>

      <Pagination :items-per-page="itemsPerPage" :total="total" :current-page="currentPage" @update:page="paginate" :disabled="!newsList.length" />
    </SectionsMain>
  </SectionsBlocks>
</template>

<style scoped></style>
