const windowWidth = ref<number>(0);
const isMobile = ref<boolean>(false);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  isMobile.value = window.innerWidth <= 639;
};

export function useWindowWidth() {
  onMounted(() => {
    if (import.meta.client) {
      handleResize();
      window.addEventListener("resize", handleResize);
    }
  });

  return {
    windowWidth,
    isMobile,
  };
}
