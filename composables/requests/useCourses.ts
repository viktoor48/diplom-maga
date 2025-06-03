export const useCourses = () => {
  const apiBase = useApiRequest();

  return {
    fetchCourses: (options: {}) => apiBase("/api/admin/courses", options),
    fetchCourseById: (id: number, options: {}) => apiBase(`/api/admin/courses/${id}`, options),
    deleteCourseById: (id: number, options: {}) => apiBase(`/api/admin/courses/${id}`, options),
    createCourse: async (options: {}) => {
      return apiBase("/api/admin/courses", {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    updateCourseById: async (id: number, options: {}) => {
      return apiBase(`/api/admin/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    },
  };
};
