export const useApiRequest = () => {
  const token = useCookie("access_token");

  const request = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBase,
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  return (url: string, options: any) => request(url, options);
};
