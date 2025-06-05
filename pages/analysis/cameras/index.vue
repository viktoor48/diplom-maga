<script setup>
const { currentPage, total, itemsPerPage, isPaginationLoading } = usePagination();
const { selectedCameras, toggleCamera } = useCameras()

const cameras = [
  { id: 1, name: 'Камера №1 Autoroute du Soleil (прямая)' },
  { id: 2, name: 'Камера №2 Autoroute du Soleil (со съездом)' }
]

const navigateToAnalysis = () => {
  if (selectedCameras.value.length === 0) {
    alert('Пожалуйста, выберите хотя бы одну камеру');
    return
  }
  navigateTo('/analysis/stats')
}
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
              v-for="camera in cameras" 
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
              @click="navigateToAnalysis"
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              :disabled="selectedCameras.length === 0"
            >
              Анализировать данные
            </button>
          </div>
        </section>
      </SectionsContainer>

      <Pagination :items-per-page="itemsPerPage" :total="total" :current-page="currentPage" @update:page="paginate" :disabled="false" />
    </SectionsMain>
  </SectionsBlocks>
</template>
