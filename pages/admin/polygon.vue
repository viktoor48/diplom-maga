<script setup lang="ts">
const cameras = ref<any[]>([]);
const selectedCameraId = ref<number | null>(null);
const polygonData = ref<string>("");
const error = ref<string | null>(null);
const success = ref<string | null>(null);

// Загрузка существующих камер
onMounted(async () => {
  try {
    const response = await fetch("http://localhost:8000/cameras");
    if (!response.ok) throw new Error("Ошибка загрузки камер");
    cameras.value = await response.json();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Ошибка загрузки";
  }
});

async function submitPolygonData() {
  if (!selectedCameraId.value || !polygonData.value.trim()) {
    error.value = "Выберите камеру и введите данные полигона";
    return;
  }

  try {
    const data = JSON.parse(polygonData.value);

    const response = await fetch("http://localhost:8000/update_polygon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ camera_id: selectedCameraId.value, data }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Ошибка сохранения");
    }

    success.value = `Полигон для камеры ${selectedCameraId.value} успешно сохранен`;
    error.value = null;
    polygonData.value = "";
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Ошибка обработки данных";
    success.value = null;
  }
}

function formatJson() {
  try {
    const obj = JSON.parse(polygonData.value);
    polygonData.value = JSON.stringify(obj, null, 2);
    error.value = null;
  } catch (err) {
    error.value = "Невалидный JSON";
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-2xl font-bold mb-6">Добавление полигонов</h1>

    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Выберите камеру:</label>
        <select v-model="selectedCameraId" class="w-full p-2 border rounded-md">
          <option :value="null">Выберите камеру</option>
          <option v-for="camera in cameras" :key="camera.id" :value="camera.id">
            {{ camera.name || `Камера #${camera.id}` }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Данные полигона (JSON):</label>
        <textarea v-model="polygonData" class="w-full h-64 p-2 border rounded-md font-mono text-sm" placeholder="Вставьте JSON данные полигона..."></textarea>
      </div>

      <div class="flex justify-between">
        <button @click="formatJson" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Форматировать JSON</button>

        <button
          @click="submitPolygonData"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          :disabled="!selectedCameraId || !polygonData.trim()"
        >
          Сохранить полигон
        </button>
      </div>
    </div>

    <!-- Пример данных -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="font-bold mb-2">Пример данных полигона:</h3>
      <pre class="text-xs bg-white p-2 rounded overflow-auto max-h-40">
{
  "polygon_id": 203,
  "camera_id": 2,
  "direction": "straight_turn",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [5.752343720396226, 50.08873776509364],
        [5.7525442144223575, 50.08886652653746],
        [5.752630934557544, 50.08894207909671]
      ]
    ]
  }
}</pre
      >
    </div>

    <!-- Сообщения об ошибках/успехе -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
      {{ error }}
    </div>

    <div v-if="success" class="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
      {{ success }}
    </div>
  </div>
</template>
