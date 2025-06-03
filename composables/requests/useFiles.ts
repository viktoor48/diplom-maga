export const useFiles = () => {
    const apiBase = useApiRequest();
  
    // Загрузить файл
    const uploadFile = async (formData: FormData) => {
      return apiBase("/api/admin/upload", {
        method: "POST",
        body: formData,
      }) as Promise<{ file: string }>;
    };
  
    // Удалить файлы
    const removeFiles = (fileLinks: string[]) =>
      apiBase("/api/admin/remove-files", {
        method: "POST",
        body: JSON.stringify({ file_links: fileLinks }),
      });
  
    return {
      uploadFile,
      removeFiles,
    };
  };
  