<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useCameras } from '~/composables/useCameras'

const { selectedCameras } = useCameras()

const videoFile = ref<File | null>(null)
const frameUrl = ref<string>('')
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const detections = ref<any[]>([])
const frameUpdateInterval = ref<NodeJS.Timeout | null>(null)
const detectionsUpdateInterval = ref<NodeJS.Timeout | null>(null)
const isProcessing = ref(false)

const handleFileUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    videoFile.value = files[0]
    stopProcessing()
  }
}

const startProcessing = () => {
  frameUpdateInterval.value = setInterval(() => {
    if (frameUrl.value) {
      frameUrl.value = `http://localhost:8000/current_frame?t=${Date.now()}`
    }
  }, 100)

  detectionsUpdateInterval.value = setInterval(async () => {
    try {
      const response = await fetch('http://localhost:8000/current_detections')
      if (response.ok) {
        detections.value = await response.json()
      }
    } catch (e) {
      console.error('Ошибка получения детекций:', e)
    }
  }, 500)
}

const stopProcessing = async () => {
  try {
    // Отправляем запрос на сервер для остановки обработки
    const response = await fetch('http://localhost:8000/stop_analysis', {
      method: 'POST'
    })
    
    if (!response.ok) {
      throw new Error('Не удалось остановить анализ')
    }
    
    console.log('Анализ успешно остановлен')
  } catch (e) {
    console.error('Ошибка при остановке анализа:', e)
    errorMessage.value = 'Ошибка при остановке анализа'
  } finally {
    // Останавливаем интервалы обновления на фронтенде
    if (frameUpdateInterval.value) clearInterval(frameUpdateInterval.value)
    if (detectionsUpdateInterval.value) clearInterval(detectionsUpdateInterval.value)
    frameUpdateInterval.value = null
    detectionsUpdateInterval.value = null
    isProcessing.value = false
    isLoading.value = false
  }
}

const analyzeVideo = async () => {
  if (!videoFile.value || selectedCameras.value.length === 0) {
    errorMessage.value = 'Пожалуйста, выберите видео и камеру'
    return
  }

  try {
    isLoading.value = true
    isProcessing.value = true
    errorMessage.value = null
    detections.value = []
    frameUrl.value = ''
    
    const cameraId = selectedCameras.value[0]
    const formData = new FormData()
    formData.append('file', videoFile.value)

    const response = await fetch(`http://localhost:8000/start_analysis/${cameraId}`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Ошибка запуска анализа')
    }

    frameUrl.value = `http://localhost:8000/current_frame?t=${Date.now()}`
    startProcessing()

  } catch (error) {
    console.error('Analysis error:', error)
    errorMessage.value = error.message || 'Ошибка при анализе видео'
    stopProcessing()
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  stopProcessing()
})
</script>

<template>
  <div class="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
    <div>
      <h3 class="font-medium mb-2 text-lg">Выбранные камеры:</h3>
      <ul class="list-disc pl-5">
        <li v-for="camId in selectedCameras" :key="camId" class="text-gray-700">Камера #{{ camId }}</li>
      </ul>
    </div>

    <div class="flex flex-col gap-2">
      <label class="block">
        <span class="sr-only">Выберите видео</span>
        <div class="relative">
          <input
            type="file"
            accept="video/*"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </label>
      <p class="text-xs text-gray-500">Поддерживаемые форматы: MP4, AVI, MOV</p>
    </div>

    <div v-if="errorMessage" class="p-3 bg-red-100 text-red-700 rounded">
      {{ errorMessage }}
    </div>

    <div class="flex gap-4">
      <button
        @click="analyzeVideo"
        :disabled="isLoading || !videoFile || isProcessing"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="isLoading">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
        <span>{{ isLoading ? "Идет анализ..." : "Анализировать видео" }}</span>
      </button>

      <button
        @click="stopProcessing"
        :disabled="!isProcessing"
        class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>Остановить анализ</span>
      </button>
    </div>

    <div v-if="frameUrl" class="mt-4 bg-gray-50 p-4 rounded-lg">
      <h3 class="font-medium mb-2 text-lg">Результат анализа:</h3>
      <img 
        :src="frameUrl" 
        class="w-full rounded-lg shadow"
        alt="Video Stream"
      >
    </div>

    <div v-if="detections.length > 0" class="mt-4">
      <h3 class="font-medium mb-2">Обнаружено объектов: {{ detections.length }}</h3>
      <div class="grid grid-cols-3 gap-2">
        <div 
          v-for="(det, i) in detections" 
          :key="i"
          class="p-2 border rounded text-sm"
        >
          {{ det.type }} ({{ det.direction }}) - {{ (det.confidence * 100).toFixed(1) }}%
        </div>
      </div>
    </div>
  </div>
</template>