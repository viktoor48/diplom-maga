export const useDocuments = () => {
  const apiBase = useApiRequest();

  return {
    fetchDocuments: (options: {}) => apiBase("/api/admin/documents", options),
    fetchDocumentById: (id: number, options: {}) => apiBase(`/api/admin/documents/${id}`, options),
    createDocument: async (title: string, link: string) => {
      return apiBase("/api/admin/documents", {
        method: "POST",
        body: JSON.stringify({ title, link }),
      });
    },
    updateDocumentById: async (id: number, title: string, link: string) => {
      return apiBase(`/api/admin/documents/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, link }),
      });
    },
    deleteDocumentById: (id: number, options: {}) => apiBase(`/api/admin/documents/${id}`, options),
    moveDocument: async (from: number, to: number) => {
      return apiBase(`/api/admin/documents/move`, {
        method: "POST",
        body: JSON.stringify({ from, to }),
      });
    },
  };
};
