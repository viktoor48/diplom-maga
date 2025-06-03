export const useAboutUs = () => {
  const apiBase = useApiRequest();

  return {
    fetchAboutUs: (options: any) => apiBase("/api/admin/about-us", options),
    editAboutUs: (options: any) => apiBase("/api/admin/about-us", { method: "PUT", body: JSON.stringify(options) }),
    editAboutUsPhoto: (options: any) => apiBase("/api/admin/about-us", { method: "PUT", body: JSON.stringify(options) }),
  };
};
