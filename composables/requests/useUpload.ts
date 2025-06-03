export const useUpload = () => {
  const apiBase = useApiRequest();

  return {
    fetchUpload: (options: {}) => apiBase("/api/admin/upload", options),
  };
};
