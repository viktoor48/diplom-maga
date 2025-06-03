export const useGlobalSearch = () => {
  const apiBase = useApiRequest();

  return {
    fetchSearch: (options: {}) => apiBase("/api/search", options),
  };
};
