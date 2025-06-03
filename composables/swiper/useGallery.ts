export function useGallery() {
  const { enableBodyScroll, disableBodyScroll } = useBodyScroll();

  const isOpengallery = ref<boolean>(false);
  const activeGallery = ref<number | null>(null);
  const activeSlide = ref<number | null>(null);

  const toggleDetail = (galleryIndex: number | null = null, slideIndex: number | null = null) => {
    if (galleryIndex !== null && slideIndex !== null) {
      activeGallery.value = galleryIndex;
      activeSlide.value = slideIndex;
    }
    isOpengallery.value = !isOpengallery.value;
    isOpengallery.value ? disableBodyScroll() : enableBodyScroll();
  };

  return {
    isOpengallery,
    activeGallery,
    activeSlide,
    toggleDetail
  }
}
