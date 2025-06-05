<script setup>
const { currentPage, total, itemsPerPage, isPaginationLoading } = usePagination();
const { selectedCameras } = useCameras()

console.log(selectedCameras.value)

</script>

<template>
  <SectionsBlocks>
    <SectionsHeader :hideSearchAndButton="true">
      <template #title> Просмотр тепловых карт </template>
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1 mt-10">
            <FiltersComponent :error="false" />
          </div>
          <div class="mt-10">
            {{ selectedCameras[0].name }}
          </div>
        </div>
      </template>
    </SectionsHeader>
    <SectionsMain>
      <SectionsContainer>
        <section class="flex flex-col gap-6">
          <HeatmapMap />
        </section>
      </SectionsContainer>

      <Pagination :items-per-page="itemsPerPage" :total="total" :current-page="currentPage" @update:page="paginate" :disabled="false" />
    </SectionsMain>
  </SectionsBlocks>
</template>
