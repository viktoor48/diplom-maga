export const useTrainings = () => {
  const apiBase = useApiRequest();

  return {
    fetchTrainings: (options: {}) => apiBase("/api/admin/trainings", options),
    fetchTrainingById: (id: number, options: {}) => apiBase(`/api/admin/trainings/${id}`, options),
    deleteTrainingById: (id: number, options: {}) => apiBase(`/api/admin/trainings/${id}`, options),
    createTraining: async (options: {}) => {
      return apiBase("/api/admin/trainings", {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    updateTrainingById: async (id: number, options: {}) => {
      return apiBase(`/api/admin/trainings/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    },
  };
};
