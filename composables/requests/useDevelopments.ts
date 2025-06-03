export const useDevelopments = () => {
  const apiBase = useApiRequest();

  return {
    fetchDevelopments: (options: {}) => apiBase("/api/admin/developments", options),
    fetchDevelopmentById: (id: number, options: {}) => apiBase(`/api/admin/developments/${id}`, options),
    deleteDevelopmentById: (id: number, options: {}) => apiBase(`/api/admin/developments/${id}`, options),
    createDevelopment: async (options: {}) => {
      return apiBase("/api/admin/developments", {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    updateDevelopmentById: async (id: number, options: {}) => {
      return apiBase(`/api/admin/developments/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    },
  };
};
