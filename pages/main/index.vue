<script setup lang="ts">
import { usePartners } from "~/composables/requests/usePartners";
import { useMain } from "~/composables/requests/useMain";
import Pagination from "~/components/Pagination.vue";
import type { Partner } from "~/types";

const { fetchMain, editMain } = useMain();
const { fetchPartners } = usePartners();
const { currentPage, total, itemsPerPage } = usePagination();

const isLoading = ref<boolean>(false);

const {
  data: partnersList,
  error,
  status,
  refresh: refreshPartners,
} = await useAsyncData<Partner[]>(
  "partners",
  async () => {
    const response = (await fetchPartners({
      params: {
        page: currentPage.value,
      },
    })) as { data: Partner[]; meta: { total: number; per_page: number } };

    total.value = response.meta.total;
    itemsPerPage.value = response.meta.per_page;

    return response.data;
  },
  {
    server: false,
    default: () => [],
  }
);

const paginate = async (event: number) => {
  currentPage.value = event;
};

watch(currentPage, () => {
  refreshPartners();
});

interface MainImg {
  photo: string,
  link: string,
}

const mainImg = ref<MainImg>();

const loadMainImg = async () => {
  isLoading.value = true;
  try {
    const response = (await fetchMain({
      params: {},
    })) as { photo: string, link: string };

    mainImg.value = response || null;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  } finally {
    isLoading.value = false;
  }
};

const resetImage = async () => {
  isLoading.value = true;
  try {
    await editMain(null, mainImg.value?.link || null);
    await loadMainImg();
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  } finally {
    isLoading.value = false;
  }
};

await loadMainImg();

const isNoPhoto = computed(() => {
  return mainImg.value?.photo ? false : true;
})

const refreshListOnDelete = async () => {
  await fetchPartners({ params: { page: currentPage.value } });
  refreshPartners();
};
</script>

<template>
  <SectionsBlocks>
    <SectionsHeader :hide-search-and-button="true">
      <template #title> Управление главной </template>
    </SectionsHeader>
    <SectionsMain>
      <SectionsContainer>
        <MainImageEditor v-model="isLoading" :hide_button="isNoPhoto" to="/main/image/edit" :image="mainImg?.photo" @clear-file="resetImage" />

        <section class="flex flex-col gap-5 pb-4">
          <header class="flex items-center justify-between">
            <h3 class="text-[1.25rem] pl-2">Партнеры</h3>
            <button class="py-2 pr-2 pl-3 bg-[#B9E9AE] rounded-lg hover:bg-[#86C577] duration-300">
              <nuxt-link to="/main/partners/create"> Добавить + </nuxt-link>
            </button>
          </header>

          <div v-if="status === 'success' && partnersList.length" class="grid grid-cols-3 gap-5">
            <PartnersCard v-for="partner in partnersList" :partner="partner" :key="partner.id" @refresh-partners-list="refreshListOnDelete" />
          </div>
          <ul v-else-if="status === 'pending'" class="grid grid-cols-3 gap-5 relative pb-4">
            <Skeleton v-for="i in 9" :key="i" class="w-full h-[18.188rem] rounded-[1.25rem] bg-gray-100" />
          </ul>
          <WarningsEmptyList v-if="!partnersList.length && status === 'success'">Список карточек пуст
          </WarningsEmptyList>
          <WarningsError v-if="status === 'error'" />
        </section>
      </SectionsContainer>

      <Pagination :items-per-page="itemsPerPage" :total="total" :current-page="currentPage" @update:page="paginate" />
    </SectionsMain>
  </SectionsBlocks>
  <Loader v-if="isLoading" />
</template>

<style scoped></style>
