export const usePartners = () => {
  const apiBase = useApiRequest();

  const fetchPartners = (options: any) => apiBase("/api/admin/partners", options);

  const deletePartnerById = (id: number) =>
    apiBase(`/api/admin/partners/${id}`, {
      method: "DELETE",
    });

  const fetchPartnerById = (id: Number) => apiBase(`/api/admin/partners/${id}`, {});

  const createPartner = (data: any) =>
    apiBase("/api/admin/partners", {
      method: "POST",
      body: JSON.stringify(data),
    });

  const editPartner = async (id: Number, photoPath: string, url: string) => {
    return apiBase(`/api/admin/partners/${id}`, {
      method: "PUT",
      body: JSON.stringify({ photo: photoPath, url: url }),
    });
  };

  return {
    fetchPartners,
    createPartner,
    deletePartnerById,
    editPartner,
    fetchPartnerById,
  };
};
