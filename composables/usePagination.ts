export const usePagination = () => {
  const currentPage = ref<number>(1);
  const lastPage = ref<number>(1);
  const isPaginationLoading = ref<boolean>(false);
  const total = ref<number>(1);
  const itemsPerPage = ref<number>(15);

  return {
    currentPage,
    lastPage,
    isPaginationLoading,
    total,
    itemsPerPage,
  };
};
