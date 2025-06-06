<script setup lang="ts">
const { currentPage, total, itemsPerPage, isPaginationLoading } = usePagination();
const { selectedCameras, toggleCamera, resetCameras } = useCameras();

resetCameras();

const isLoading = ref(true);
const camerasData = ref<any[]>([]);
const error = ref<string | null>(null);

const loadData = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Загружаем данные с бэка вместо локального файла
    const response = await fetch("http://localhost:8000/cameras");
    if (!response.ok) throw new Error('Ошибка загрузки данных');
    
    camerasData.value = await response.json();

  } catch (err) {
    console.error("Ошибка при загрузке данных:", err);
    error.value = 'Не удалось загрузить список камер';
  } finally {
    isLoading.value = false;
  }
};

const navigateToAnalysis = () => {
  if (selectedCameras.value.length === 0) {
    alert('Пожалуйста, выберите хотя бы одну камеру');
    return
  }
  navigateTo('/analysis/stats')
}

onMounted(loadData);
</script>

<template>
  <SectionsBlocks>
    <SectionsHeader>
      <template #title> Выбор камер </template>
    </SectionsHeader>
    <SectionsMain>
      <SectionsContainer>
        <section class="flex flex-col gap-6">
          <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
            {{ error }}
            <button @click="loadData" class="mt-2 text-sm underline">Попробовать снова</button>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="camera in camerasData" 
              :key="camera.id"
              class="p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md"
              :class="{
                'border-blue-500 bg-blue-50 shadow-md': selectedCameras.includes(camera.id),
                'border-gray-200 hover:border-gray-300': !selectedCameras.includes(camera.id)
              }"
              @click="toggleCamera(camera.id)"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-lg">📷</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium truncate">{{ camera.name }}</h3>
                  <p class="text-sm text-gray-500 truncate">ID: {{ camera.id }}</p>
                </div>
                <div class="ml-2 flex-shrink-0">
                  <span 
                    class="w-5 h-5 inline-block border-2 rounded-full transition-colors"
                    :class="{
                      'bg-blue-500 border-blue-500': selectedCameras.includes(camera.id),
                      'border-gray-300': !selectedCameras.includes(camera.id)
                    }"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              @click="navigateToAnalysis"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors
                    disabled:bg-gray-300 disabled:cursor-not-allowed"
              :disabled="selectedCameras.length === 0"
            >
              Анализировать данные
              <span v-if="selectedCameras.length > 0" class="ml-2 bg-white text-green-600 rounded-full px-2 py-0.5 text-xs">
                {{ selectedCameras.length }}
              </span>
            </button>
          </div>
        </section>
      </SectionsContainer>

      <Pagination :items-per-page="itemsPerPage" :total="total" :current-page="currentPage" :disabled="false" />
    </SectionsMain>
  </SectionsBlocks>
</template>