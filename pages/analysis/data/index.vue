<script setup lang="ts">
import Pagination from "~/components/Pagination.vue";
import { ref, onMounted } from "vue";

// Состояния компонента
const analysisData = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(20);
const totalItems = ref(0);
const searchQuery = ref("");

// Функция загрузки данных
async function fetchAnalysisData() {
  isLoading.value = true;
  error.value = null;

  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.value.toString(),
      ...(searchQuery.value && { search: searchQuery.value }),
    });

    const response = await fetch(`http://localhost:8000/analysis_data?${params}`);

    // Проверка типа контента
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Ожидался JSON, получено: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка сервера");
    }

    const data = await response.json();
    analysisData.value = data.data;
    totalItems.value = data.total;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Неизвестная ошибка";
    console.error("Ошибка загрузки данных:", err);
  } finally {
    isLoading.value = false;
  }
}

// Функция для тестирования соединения
async function testConnection() {
  try {
    const response = await fetch("http://localhost:8000/test_data");
    const data = await response.json();
    console.log("Тестовый запрос:", data);
  } catch (err) {
    console.error("Ошибка тестового запроса:", err);
  }
}

// Хуки жизненного цикла
onMounted(() => {
  testConnection();
  fetchAnalysisData();
});

// Функция для поиска
function handleSearch() {
  currentPage.value = 1;
  fetchAnalysisData();
}

const paginate = async (event: number) => {
  currentPage.value = event;
  fetchAnalysisData();
};
</script>

<template>
  <SectionsBlocks>
    <SectionsHeader :hide-search-and-button="true" v-model="searchQuery">
      <template #title> Анализ транспортных средств </template>
      <template #footer>
        <div class="flex mt-5">
          <div class="flex gap-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по ID или типу ТС"
              class="px-4 py-2 border rounded-md flex-grow"
              @keyup.enter="handleSearch"
            />
            <button @click="handleSearch" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Поиск</button>
          </div>
        </div>
      </template>
    </SectionsHeader>
    <SectionsMain>
      <SectionsContainer>
        <section class="">
          <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          <!-- Сообщение об ошибке -->
          <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
            {{ error }}
            <button @click="fetchAnalysisData" class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Попробовать снова</button>
          </div>

          <div v-else class="bg-white shadow rounded-lg overflow-hidden mb-6">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип ТС</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Камера</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Направление</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in analysisData" :key="item.track_id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.track_id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.vehicle_type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.camera_id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(item.timestamp).toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.direction }}</td>
                </tr>
                <tr v-if="analysisData.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Нет данных для отображения</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </SectionsContainer>

      <Pagination
        :items-per-page="itemsPerPage"
        :total="totalItems"
        :current-page="currentPage"
        @update:page="paginate"
        :disabled="currentPage * itemsPerPage >= totalItems"
      />
    </SectionsMain>
  </SectionsBlocks>
</template>
