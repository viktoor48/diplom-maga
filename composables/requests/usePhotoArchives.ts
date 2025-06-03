export const usePhotoArchives = () => {
  const apiBase = useApiRequest();
  return {
    fetchArchives: (options: any) => apiBase("/api/admin/photo-archives", options),
    fetchArchivesById: (id: number, options: {}) => apiBase(`/api/admin/photo-archives/${id}`, options),
    deleteArchiveById: (id: number, options: {}) => apiBase(`/api/admin/photo-archives/${id}`, options),
    createArchive: async (options: {}) => {
      return apiBase("/api/admin/photo-archives", {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    updateArchiveByid: async (id: number, options: {}) => {
      return apiBase(`/api/admin/photo-archives/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    },
  };
};
