export const useProjects = () => {
  const apiBase = useApiRequest();
  return {
    fetchProjects: (options: any) => apiBase("/api/admin/projects", options),
    fetchProjectsById: (id: number, options: {}) => apiBase(`/api/admin/projects/${id}`, options),
    deleteProjectById: (id: number, options: {}) => apiBase(`/api/admin/projects/${id}`, options),
    createProject: async (options: {}) => {
      return apiBase("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    updateProjectById: async (id: number, options: {}) => {
      return apiBase(`/api/admin/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    },
  };
};
