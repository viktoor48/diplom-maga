<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useFilters } from "~/composables/useFilters";
import type { FilterOption, CustomPeriod } from "~/types";

// Настройки
const isLoading = ref(true);
const coloredPolygons = ref<any[]>([]);
const bounds = ref<number[]>([]);
const rawVehicleData = ref<any[]>([]);
const rawPolygonsData = ref<any[]>([]); // Храним исходные полигоны

const { filtersState, queryString } = useFilters();

const durationMinutes = 60;
const colorScale = [
  "#c7e9b4", "#FFEDA0", "#FED976", "#FEB24C",
  "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"
];

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>';

// Загрузка данных
const loadData = async () => {
  try {
    const [polygonsRes, analysisRes] = await Promise.all([
      fetch("/data/mock/polygons.geojson"),
      fetch("/data/mock/analysis.json")
    ]);

    rawPolygonsData.value = await polygonsRes.json(); // Сохраняем исходные полигоны
    rawVehicleData.value = await analysisRes.json();

    // Первоначальная обработка данных
    processData(rawPolygonsData.value, rawVehicleData.value);
  } catch (err) {
    console.error("Ошибка при загрузке данных:", err);
  } finally {
    isLoading.value = false;
  }
};

const filterDataByPeriod = (data: any[], period: FilterOption | CustomPeriod | null) => {
  if (!period || period === "За всё время") return data;

  const now = new Date();
  let startDate: Date;
  let endDate: Date = now;

  if (typeof period === "string") {
    switch (period) {
      case "5 минут":
        startDate = new Date(now.getTime() - 5 * 60 * 1000);
        break;
      case "10 минут":
        startDate = new Date(now.getTime() - 10 * 60 * 1000);
        break;
      case "1 час":
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "За неделю":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "За месяц":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }
  } else {
    // Для кастомного периода
    startDate = new Date(period.start);
    endDate = new Date(period.end);
  }

  return data.filter(item => {
    if (!item.timestamp) return false;
    const itemDate = new Date(item.timestamp);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

// Обработка данных для карты
const processData = (polygons: any[], vehicleData: any[]) => {
  try {
    // Фильтрация данных
    const filteredData = filterDataByPeriod(
      vehicleData,
      filtersState.value.customPeriod || filtersState.value.selectedFilter
    );

    console.log('Filtered data count:', filteredData.length);

    // Статистика по направлениям
    const directionStats: Record<string, { count: number; weight_sum: number }> = {};

    for (const item of filteredData) {
      const dir = item.direction;
      const weight = item.weight || 1;
      if (!directionStats[dir]) directionStats[dir] = { count: 0, weight_sum: 0 };
      directionStats[dir].count += 1;
      directionStats[dir].weight_sum += weight;
    }

    console.log('Direction stats:', directionStats);

    // Рассчет интенсивности
    const intensities = Object.values(directionStats).map(s => s.weight_sum / durationMinutes);
    const maxIntensity = Math.max(...intensities, 1);

    bounds.value = Array.from({ length: colorScale.length + 1 }, (_, i) =>
      i * maxIntensity / colorScale.length
    );

    const getColor = (intensity: number) => {
      for (let i = 0; i < bounds.value.length - 1; i++) {
        if (intensity <= bounds.value[i + 1]) return colorScale[i];
      }
      return colorScale[colorScale.length - 1];
    };

    // Генерация GeoJSON
    coloredPolygons.value = polygons.map((poly: any) => {
      const stats = directionStats[poly.direction] || { count: 0, weight_sum: 0 };
      const intensity = stats.weight_sum / durationMinutes;

      return {
        type: "Feature",
        geometry: poly.geometry,
        properties: {
          ...poly,
          count: stats.count,
          weight_sum: stats.weight_sum,
          intensity,
          style: {
            color: "black",
            fillColor: getColor(intensity),
            weight: 1,
            fillOpacity: 0.6
          }
        }
      };
    });

    console.log('Generated polygons:', coloredPolygons.value.length);
  } catch (err) {
    console.error("Ошибка при обработке данных:", err);
  }
};

// Следим за изменениями фильтров
watch(
  () => [filtersState.value.selectedFilter, filtersState.value.customPeriod],
  () => {
    if (rawVehicleData.value.length && rawPolygonsData.value.length) {
      isLoading.value = true;
      setTimeout(() => {
        processData(rawPolygonsData.value, rawVehicleData.value); // Всегда используем исходные полигоны
        isLoading.value = false;
      }, 300);
    }
  },
  { deep: true }
);

// Инициализация
onMounted(loadData);
</script>

<template>
  <div class="relative h-[600px] w-full">
    <!-- Загрузка -->
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <span class="text-lg font-semibold">Обновление данных...</span>
    </div>

    <!-- Карта -->
    <ClientOnly>
      <l-map
        v-if="!isLoading"
        style="height: 100%; width: 100%"
        :zoom="18"
        :center="[50.0889, 5.7525]"
        :options="{ zoomControl: true }"
      >
        <l-tile-layer :url="tileUrl" :attribution="attribution" />

        <l-geo-json
          v-for="(feature, index) in coloredPolygons"
          :key="index"
          :geojson="feature"
          :options-style="() => feature.properties.style"
        >
          <l-tooltip :sticky="true">
            <div>
              <strong>{{ feature.properties.direction }}</strong><br />
              ТС: {{ feature.properties.count }}<br />
              Вес: {{ feature.properties.weight_sum }}<br />
              Инт.: {{ feature.properties.intensity.toFixed(2) }}
            </div>
          </l-tooltip>
        </l-geo-json>

        <!-- Легенда -->
        <div
          class="absolute bottom-5 left-5 bg-white bg-opacity-90 p-3 rounded-md text-sm z-[1000]"
          style="box-shadow: 0 0 5px rgba(0,0,0,0.2);"
        >
          <strong>Интенсивность (ТС/мин):</strong>
          <div class="mt-2 space-y-1">
            <div
              v-for="(color, i) in colorScale"
              :key="i"
              class="flex items-center gap-2"
            >
              <div
                :style="{ backgroundColor: color }"
                class="w-4 h-4 rounded-sm border border-gray-400"
              ></div>
              <span>
                {{ bounds[i]?.toFixed(2) || "0.00" }} – {{ bounds[i + 1]?.toFixed(2) || "+" }}
              </span>
            </div>
          </div>
        </div>
      </l-map>
    </ClientOnly>

    <!-- Нет данных -->
    <div
      v-if="!isLoading && coloredPolygons.length === 0"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50"
    >
      <span class="text-lg font-semibold">Нет данных для отображения</span>
    </div>
  </div>
</template>

<style scoped>
.leaflet-container {
  z-index: 0;
}
</style>