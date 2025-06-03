export const useUsers = () => {
  const apiBase = useApiRequest();

  return {
    fetchUsers: (options: {}) => apiBase("/api/admin/users", options),
    fetchUserById: (id: number, options: {}) => apiBase(`/api/admin/users/${id}`, options),
    addUser: async (options: {}) => {
      return apiBase("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(options),
      });
    },
    updateUserById: async (id: number, options: {}) => {
      return apiBase(`/api/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(options),
      });
    },
    deleteUser: (id: number, options: {}) => apiBase(`/api/admin/users/${id}`, options),
  };
};
