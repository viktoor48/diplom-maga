export const documentLink = (link: string) => {
  const apiBase = useRuntimeConfig().public.apiBase;
  return `${apiBase}/api/download?file_link=${link}`;
};
