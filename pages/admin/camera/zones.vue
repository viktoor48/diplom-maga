<script setup lang="ts">
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:8000'

// Состояния
const cameras = ref<any[]>([])
const selectedCamera = ref<any>(null)
const zones = ref<any[]>([])
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

// Загрузка зон для камеры
// Загрузка зон для камеры
const fetchZones = async (cameraId: number) => {
  try {
    isLoading.value = true
    const response = await fetch(`${API_URL}/cameras/${cameraId}/zones`)
    if (!response.ok) throw new Error('Ошибка загрузки зон')
    
    // Преобразуем полученные зоны в нужный формат
    const rawZones = await response.json()
    zones.value = rawZones.map(zone => ({
      ...zone,
      // Используем name как direction, если direction не указан
      direction: zone.name || '', 
      is_active: true,
      points: Array.isArray(zone.points) ? zone.points : []
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
  fetchZones(camera.id)
}

// Добавление новой зоны
const addZone = () => {
  zones.value.push({
    zone_id: Date.now(), // Уникальный ID
    name: `Новая зона ${zones.value.length + 1}`,
    points: [],
    is_active: true
  })
}

// Удаление зоны
const removeZone = (index: number) => {
  zones.value.splice(index, 1)
}

// Сохранение зон
const saveZones = async () => {
  if (!selectedCamera.value) return
  
  try {
    isLoading.value = true
    // Подготавливаем данные для отправки
    const zonesToSave = zones.value.map(zone => ({
      zone_id: zone.zone_id,
      name: zone.name,  // Используем name вместо direction
      points: zone.points
    }))
    
    const response = await fetch(`${API_URL}/cameras/${selectedCamera.value.id}/zones`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zonesToSave)
    })
    
    if (!response.ok) throw new Error('Ошибка сохранения')
    
    success.value = 'Зоны успешно сохранены'
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
    <h1 class="text-2xl font-bold mb-6">Управление зонами камер</h1>
    
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

    <!-- Редактирование зон -->
    <div v-if="selectedCamera" class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Зоны камеры: {{ selectedCamera.name }}</h2>
        <button @click="addZone" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Добавить зону
        </button>
      </div>

      <div v-for="(zone, index) in zones" :key="index" class="mb-6 p-4 border rounded-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-medium">Зона #{{ index + 1 }}</h3>
          <button @click="removeZone(index)" class="text-red-600 hover:text-red-800">
            Удалить
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Направление</label>
            <input v-model="zone.name" type="text" class="w-full p-2 border rounded-md">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Точки зоны (JSON)</label>
          <textarea 
            v-model="zone.points"
            class="w-full h-32 p-2 border rounded-md font-mono text-sm"
            placeholder="[[x1,y1], [x2,y2], ...]"
          ></textarea>
        </div>
      </div>

      <button 
        @click="saveZones"
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
  </div>
</template>