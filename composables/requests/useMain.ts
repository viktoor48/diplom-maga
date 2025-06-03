export const useMain = () => {
  const apiBase = useApiRequest();

  const fetchMain = async (options: {}) => {
    return apiBase("/api/admin/main-entity", {
      ...options,
    });
  };

  const editMain = async (photoPath: string | null, link: string | null) => {

    return apiBase("/api/admin/main-entity", {
      method: "PUT",
      body: JSON.stringify({ photo: photoPath, link }),
    });
  }

  return {
    fetchMain,
    editMain
  };
};
