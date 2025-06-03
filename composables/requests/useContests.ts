export const useContests = () => {
  const apiBase = useApiRequest();

  return {
    fetchContests: (options: {}) => apiBase("/api/admin/contests", options),
    fetchContestById: (id: number, options: {}) => apiBase(`/api/admin/contests/${id}`, options),
    deleteContestById: (id: number, options: {}) => apiBase(`/api/admin/contests/${id}`, options),
    createContest: async (options: {}) => {
      return apiBase("/api/admin/contests", {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    updateContestById: async (id: number, options: {}) => {
      return apiBase(`/api/admin/contests/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    },
  };
};
