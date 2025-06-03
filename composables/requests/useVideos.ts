export const useVideos = () => {
  const apiBase = useApiRequest();

  return {
    fetchVideos: (options: {}) => apiBase("/api/admin/video-galleries", options),
    // fetchVideoById: (id: number, options: {}) => apiBase(`/api/admin/video-galleries/${id}`, options),
    deleteVideoById: (id: number, options: {}) => apiBase(`/api/admin/video-galleries/${id}`, options),
  };
};
