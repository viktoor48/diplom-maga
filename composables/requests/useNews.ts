import type { NewsCard } from "~/types";

export const useNews = () => {
    const apiBase = useApiRequest();
    const pinnedNewsList = ref<NewsCard[] | null>(null);
  
    const fetchNews = (options: {}) => apiBase("/api/admin/news", options);
    const fetchNewsById = (id: number, options: {}) => apiBase(`/api/admin/news/${id}`, options);
    const deleteNewsById = (id: number) => fetchNewsById(id, {
      method: "DELETE"
    });
    const createNews = async (options: {}) => {
      return apiBase("/api/admin/news", {
        method: "POST",
        body: JSON.stringify(options),
      });
    };
    const updateNewsById = async (id: number, options: {}) => {
      return apiBase(`/api/admin/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    };

    const fetchPinnedNews = async () => {
      try {
        const response = (await fetchNews({
          params: { pinned: 1 },
        })) as { data: NewsCard[] };
        
        pinnedNewsList.value = response.data;
      } catch (error) {
        console.error("Ошибка загрузки закрепленных новостей:", error);
      }

      return pinnedNewsList.value;
    };

    return {fetchNews, fetchNewsById, fetchPinnedNews, deleteNewsById, pinnedNewsList, createNews, updateNewsById};
  };
  