<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const API_URL = 'http://localhost:8000'

// Состояния
const cameras = ref<any[]>([])
const selectedCamera = ref<any>(null)
const polygons = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

// Загрузка камер
const fetchCameras = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${API_URL}/cameras`)
    if (!response.ok) throw new Error('Ошибка загрузки камер')
    cameras.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
  } finally {
    isLoading.value = false
  }
}

// Загрузка полигонов для камеры
const fetchPolygons = async (cameraId: number) => {
  try {
    isLoading.value = true
    const response = await fetch(`${API_URL}/cameras/${cameraId}/polygons`)
    if (!response.ok) throw new Error('Ошибка загрузки полигонов')
    
    const rawPolygons = await response.json()
    polygons.value = rawPolygons.map(polygon => ({
      ...polygon,
      geometry: polygon.geometry || {
        type: 'Polygon',
        coordinates: [[]]
      },
      // Добавляем строковое представление геометрии
      geometryString: JSON.stringify(polygon.geometry || {
        type: 'Polygon',
        coordinates: [[]]
      }, null, 2)
    }))
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
  } finally {
    isLoading.value = false
  }
}

// Выбор камеры
const selectCamera = (camera: any) => {
  selectedCamera.value = camera
  fetchPolygons(camera.id)
}

// Добавление нового полигона
const addPolygon = () => {
  const newPolygon = {
    polygon_id: Date.now(), // Уникальный ID
    direction: `Направление ${polygons.value.length + 1}`,
    geometry: {
      type: 'Polygon',
      coordinates: [[]]
    }
  }
  polygons.value.push({
    ...newPolygon,
    geometryString: JSON.stringify(newPolygon.geometry, null, 2)
  })
}

// Удаление полигона
const removePolygon = (index: number) => {
  polygons.value.splice(index, 1)
}

// Обновление геометрии при изменении текста
const updateGeometry = (index: number) => {
  try {
    const parsed = JSON.parse(polygons.value[index].geometryString)
    polygons.value[index].geometry = parsed
    error.value = null
  } catch (err) {
    error.value = 'Неверный формат JSON'
  }
}

// Сохранение полигонов
const savePolygons = async () => {
  if (!selectedCamera.value) return
  
  try {
    isLoading.value = true
    // Проверяем все полигоны на валидность JSON
    for (const polygon of polygons.value) {
      try {
        JSON.parse(polygon.geometryString)
      } catch (err) {
        throw new Error(`Полигон "${polygon.direction}" содержит невалидный JSON`)
      }
    }
    
    // Подготавливаем данные для отправки
    const polygonsToSave = polygons.value.map(polygon => ({
      polygon_id: polygon.polygon_id,
      direction: polygon.direction,
      geometry: JSON.parse(polygon.geometryString)
    }))
    
    const response = await fetch(`${API_URL}/cameras/${selectedCamera.value.id}/polygons`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(polygonsToSave)
    })
    
    if (!response.ok) throw new Error('Ошибка сохранения')
    
    success.value = 'Полигоны успешно сохранены'
    setTimeout(() => success.value = null, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
  } finally {
    isLoading.value = false
  }
}

// Инициализация
onMounted(fetchCameras)
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-2xl font-bold mb-6">Управление полигонами камер</h1>
    
    <!-- Выбор камеры -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4">Выберите камеру</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="camera in cameras"
          :key="camera.id"
          @click="selectCamera(camera)"
          class="p-4 border rounded-lg hover:bg-gray-50 transition"
          :class="{ 'border-blue-500 bg-blue-50': selectedCamera?.id === camera.id }"
        >
          <h3 class="font-medium">{{ camera.name }}</h3>
          <p class="text-sm text-gray-500">ID: {{ camera.id }}</p>
        </button>
      </div>
    </div>

    <!-- Редактирование полигонов -->
    <div v-if="selectedCamera" class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Полигоны камеры: {{ selectedCamera.name }}</h2>
        <button @click="addPolygon" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Добавить полигон
        </button>
      </div>

      <div v-for="(polygon, index) in polygons" :key="index" class="mb-6 p-4 border rounded-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-medium">Полигон #{{ index + 1 }}</h3>
          <button @click="removePolygon(index)" class="text-red-600 hover:text-red-800">
            Удалить
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Направление</label>
            <input v-model="polygon.direction" type="text" class="w-full p-2 border rounded-md">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Геометрия полигона (GeoJSON)</label>
          <textarea 
            v-model="polygon.geometryString"
            @blur="updateGeometry(index)"
            class="w-full h-32 p-2 border rounded-md font-mono text-sm"
            placeholder='{"type": "Polygon", "coordinates": [[[x1,y1], [x2,y2], ...]]}'
          ></textarea>
        </div>
      </div>

      <button 
        @click="savePolygons"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
      </button>
    </div>

    <!-- Сообщения -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
      {{ error }}
      <button @click="error = null" class="float-right font-bold">×</button>
    </div>
    <div v-if="success" class="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
      {{ success }}
      <button @click="success = null" class="float-right font-bold">×</button>
    </div>

    <!-- Пример данных -->
    <div class="bg-gray-50 p-4 rounded-lg mt-6">
      <h3 class="font-bold mb-2">Пример данных полигона:</h3>
      <pre class="text-xs bg-white p-2 rounded overflow-auto max-h-40">
{
  "type": "Polygon",
  "coordinates": [
    [
      [0.1, 0.2],
      [0.3, 0.4],
      [0.5, 0.6],
      [0.1, 0.2]
    ]
  ]
}</pre>
    </div>
  </div>
</template>