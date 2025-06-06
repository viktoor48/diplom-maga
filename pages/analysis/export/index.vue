<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFilters } from '~/composables/useFilters';

const { filtersState, queryString } = useFilters();
const isLoading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

// Вычисляемое свойство для отображения выбранного периода
const selectedPeriodText = computed(() => {
  if (filtersState.customPeriod) {
    return filtersState.selectedFilter;
  }
  return filtersState.selectedFilter !== 'За всё время' 
    ? `За последние ${filtersState.selectedFilter.toLowerCase()}`
    : 'За всё время';
});

async function exportReport() {
  isLoading.value = true;
  error.value = null;
  success.value = false;
  
  try {
    const url = `http://localhost:8000/export_report?${queryString.value}`;
    const response = await fetch(url);
    
    // Проверяем, что ответ действительно Excel
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      const errorText = await response.text();
      throw new Error(errorText || 'Сервер вернул неожиданный формат данных');
    }
    
    if (!response.ok) {
      // Пытаемся прочитать ошибку в формате JSON
      try {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при выгрузке отчета');
      } catch {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
    }
    
    // Создаем blob и скачиваем файл
    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition') || '';
    const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i);
    const filename = filenameMatch?.[1] || `report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    
    // Современный способ скачивания файла
    const urlObject = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = urlObject;
    anchor.download = decodeURIComponent(filename);
    anchor.style.display = 'none';
    
    anchor.addEventListener('click', () => {
      setTimeout(() => {
        URL.revokeObjectURL(urlObject);
        document.body.removeChild(anchor);
      }, 100);
    });
    
    document.body.appendChild(anchor);
    anchor.click();
    
    success.value = true;
    setTimeout(() => success.value = false, 3000);
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
    console.error('Ошибка выгрузки:', err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Выгрузка отчета</h1>
    
    <!-- Фильтры -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
      <FiltersComponent :error="false" />
    </div>
    
    <!-- Информация о выбранном периоде -->
    <div 
      v-if="filtersState.selectedFilter !== 'За всё время' || filtersState.customPeriod"
      class="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100"
    >
      <p class="font-medium">Будет выгружен отчет:</p>
      <p class="font-semibold">{{ selectedPeriodText }}</p>
    </div>
    
    <!-- Кнопка выгрузки -->
    <div class="flex justify-end mb-6">
      <button
        @click="exportReport"
        :disabled="isLoading"
        class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 
               disabled:opacity-50 flex items-center gap-2 transition-colors duration-200
               shadow hover:shadow-md"
        :class="{
          'bg-green-600': !isLoading,
          'bg-green-400': isLoading
        }"
      >
        <svg 
          v-if="isLoading"
          class="animate-spin h-5 w-5 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg 
          v-else
          class="h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        <span>{{ isLoading ? 'Формирование отчета...' : 'Выгрузить в Excel' }}</span>
      </button>
    </div>
    
    <!-- Сообщение об успехе -->
    <transition name="fade">
      <div 
        v-if="success"
        class="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-100 flex items-center"
      >
        <svg class="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Отчет успешно сформирован и начал скачиваться
      </div>
    </transition>
    
    <!-- Сообщение об ошибке -->
    <transition name="fade">
      <div 
        v-if="error"
        class="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-100"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ error }}</span>
          </div>
          <button 
            @click="error = null"
            class="text-red-600 hover:text-red-800"
            aria-label="Закрыть"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <button
          @click="exportReport"
          class="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center"
        >
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Попробовать снова
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>