<script setup lang="ts">
const { currentPage, total, itemsPerPage, isPaginationLoading } = usePagination();
const { selectedCameras, toggleCamera, resetCameras } = useCameras()

resetCameras();

const isLoading = ref(true);
const camerasData = ref<any>([]);

const loadData = async () => {
  try {
    const [camerasRes] = await Promise.all([
      fetch("/data/mock/cameras.json"),
    ]);

    camerasData.value = await camerasRes.json();


  } catch (err) {
    console.error("Ошибка при загрузке данных:", err);
  } finally {
    isLoading.value = false;
  }
};

const navigateToHeatmap = () => {
  if (selectedCameras.value.length === 0) {
    alert('Пожалуйста, выберите хотя бы одну камеру');
    return
  }
  navigateTo('/analysis/heatmaps')
}

onMounted(() => {
  loadData();
})
</script>

<template>
  <SectionsBlocks>
    <SectionsHeader>
      <template #title> Выбор камер </template>
    </SectionsHeader>
    <SectionsMain>
      <SectionsContainer>
        <section class="flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="camera in camerasData" 
              :key="camera.id"
              class="p-4 border rounded-lg cursor-pointer transition-all"
              :class="{
                'border-blue-500 bg-blue-50': selectedCameras.includes(camera),
                'border-gray-200 hover:border-gray-300': !selectedCameras.includes(camera)
              }"
              @click="toggleCamera(camera)"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-lg">📷</span>
                </div>
                <div>
                  <h3 class="font-medium">{{ camera.name }}</h3>
                  <p class="text-sm text-gray-500">ID: {{ camera.id }}</p>
                </div>
                <div class="ml-auto">
                  <span 
                    class="w-5 h-5 inline-block border rounded-full"
                    :class="{
                      'bg-blue-500 border-blue-500': selectedCameras.includes(camera),
                      'border-gray-300': !selectedCameras.includes(camera)
                    }"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              @click="navigateToHeatmap"
              class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              :disabled="selectedCameras.length === 0"
            >
              Просмотр тепловой карты
            </button>
          </div>
        </section>
      </SectionsContainer>

      <Pagination :items-per-page="itemsPerPage" :total="total" :current-page="currentPage" :disabled="false" />
    </SectionsMain>
  </SectionsBlocks>
</template>
