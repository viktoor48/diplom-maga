<script setup lang="ts">
import Pagination from "~/components/Pagination.vue";
import AddCardButton from "~/components/UIComponents/AddCardButton.vue";

import { useTrainings } from "~/composables/requests/useTrainings";
import { useCourses } from "~/composables/requests/useCourses";
import { useDevelopments } from "~/composables/requests/useDevelopments";

import { scrollToTop } from "~/utils/paginationScroll";

import { watchDebounced } from "@vueuse/core";

const route = useRoute();
const router = useRouter();

const { fetchTrainings } = useTrainings();
const { fetchCourses } = useCourses();
const { fetchDevelopments } = useDevelopments();

const searchQuery = ref<string>("");
const isNoContent = ref<boolean>(false);

const { currentPage, total, itemsPerPage } = usePagination();

const tabs = ref<string>(route.query.tab?.toString() || "trainings");

const formRequestParams = () => {
  const params: any = { page: currentPage.value };
  if (searchQuery.value) {
    params.search = searchQuery.value;
  }
  return params;
};

const {
  data: cards,
  refresh: refreshCardList,
  error,
  status,
} = await useAsyncData<any>(
  "education",
  async () => {
    let response: any;
    if (tabs.value === "trainings") {
      response = await fetchTrainings({ params: formRequestParams() });
    } else if (tabs.value === "courses") {
      response = await fetchCourses({ params: formRequestParams() });
    } else if (tabs.value === "developments") {
      response = await fetchDevelopments({ params: formRequestParams() });
    }

    if (response === undefined) {
      isNoContent.value = true;
      total.value = 1;
      return [];
    } else {
      isNoContent.value = false;
      total.value = response.meta.total;
      itemsPerPage.value = response.meta.per_page;

      return response.data;
    }
  },
  { default: () => [] }
);

if (error.value) {
  console.error("Ошибка при получении данных:", error.value);
  isNoContent.value = false;
}

const refreshListOnDelete = async () => {
  if (tabs.value === "trainings") {
    await fetchTrainings({ params: formRequestParams() });
  } else if (tabs.value === "courses") {
    await fetchCourses({ params: formRequestParams() });
  } else if (tabs.value === "developments") {
    await fetchDevelopments({ params: formRequestParams() });
  }
  refreshCardList();
};

const navigateTab = (tab: string) => {
  tabs.value = tab;
  currentPage.value = 1;

  router.push({
    query: {
      ...route.query,
      tab: tab,
    },
  });

  scrollToTop("education-list");
};

const paginate = async (event: number) => {
  currentPage.value = event;
  scrollToTop("education-list");
};

const getCreateLink = computed(() => {
  if (tabs.value === "trainings") {
    return "education/trainings/create";
  } else if (tabs.value === "courses") {
    return "education/courses/create";
  } else if (tabs.value === "developments") {
    return "education/developments/create";
  }
});

watch([currentPage, tabs], () => {
  refreshCardList();
});

watchDebounced(
  searchQuery,
  () => {
    if (searchQuery.value.trim() !== "") {
      refreshCardList();
    } else {
      refreshCardList();
    }
    currentPage.value = 1;
  },
  { debounce: 500, maxWait: 5000 }
);

onMounted(() => {
  if (route.query.tab) {
    tabs.value = route.query.tab.toString();
  }
});
</script>

<template>
  <SectionsBlocks>
    <SectionsHeader v-model="searchQuery">
      <template #title> Обучение </template>
      <template #add-button>
        <AddCardButton :redirect-link="getCreateLink" />
      </template>
      <template #footer>
        <div class="flex gap-1 *:py-2.5 *:px-4 *:border *:border-[#D0D5DD] *:rounded-lg mt-10">
          <button
            class="hover:bg-[#F2F4F7] duration-300"
            :class="{ 'active-tab duration-300': tabs === 'trainings' }"
            @click="navigateTab('trainings')"
            :disabled="status === 'error'"
          >
            Программы повышения квалификации
          </button>
          <button
            class="hover:bg-[#F2F4F7] duration-300"
            :class="{ 'active-tab duration-300': tabs === 'courses' }"
            @click="navigateTab('courses')"
            :disabled="status === 'error'"
          >
            Запись на курсы
          </button>
          <button
            class="hover:bg-[#F2F4F7] duration-300"
            :class="{ 'active-tab duration-300': tabs === 'developments' }"
            @click="navigateTab('developments')"
            :disabled="status === 'error'"
          >
            Методические разработки
          </button>
        </div>
      </template>
    </SectionsHeader>
    <SectionsMain>
      <SectionsContainer>
        <section class="flex flex-col gap-6" :class="{ 'h-[85%]': !cards.length }">
          <EducationCardList
            v-if="status === 'success' && cards.length"
            id="education-list"
            :cards="cards"
            :tabs="tabs"
            @refreshTrainingsList="refreshListOnDelete"
            @refreshCoursesList="refreshListOnDelete"
            @refreshDevelopmentsList="refreshListOnDelete"
          />
          <ul v-else-if="status === 'pending'" id="ggg" class="grid grid-cols-3 gap-5 relative pb-4">
            <Skeleton v-for="i in 9" :key="i" class="w-full h-[15rem] rounded-[1.25rem] bg-gray-100" />
          </ul>
          <WarningsEmptyList v-if="isNoContent">Карточки по вашему запросу не найдены</WarningsEmptyList>
          <WarningsEmptyList v-if="!cards.length && status === 'success' && !isNoContent">Список карточек пуст</WarningsEmptyList>
          <WarningsError v-if="status === 'error'"> Произошла ошибка :(</WarningsError>
        </section>
      </SectionsContainer>
      <Pagination :items-per-page="itemsPerPage" :total="total" :current-page="currentPage" @update:page="paginate" :disabled="!cards.length" />
    </SectionsMain>
  </SectionsBlocks>
</template>

<style scoped>
.active-tab {
  background-color: #e6f1e5;
  border: 1px solid transparent;
}

.active-tab:hover {
  background-color: #d0e5cf;
}
</style>
