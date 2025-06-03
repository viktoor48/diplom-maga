export const useEvents = () => {
  const apiBase = useApiRequest();

  const fetchEventById = (id: number, options: {}) => apiBase(`/api/admin/events/${id}`, options);

  return {
    fetchEventsList: (options: {}) => apiBase("/api/admin/events", options),
    fetchEventById,
    deleteEventById: (id: number) =>
      fetchEventById(id, {
        method: "DELETE",
      }),
    createEvent: async (options: {}) => {
      return apiBase("/api/admin/events", {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    updateEventById: async (id: number, options: {}) => {
      return apiBase(`/api/admin/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    },
    rejectEventById: async (id: number, options: {}) => {
      return apiBase(`/api/admin/events/${id}/reject`, {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    approveEventById: async (id: number) => {
      return apiBase(`/api/admin/events/${id}/approve`, {
        method: "PATCH",
      });
    },
  };
};
