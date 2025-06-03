export function useBodyScroll() {
  const disableBodyScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const enableBodyScroll = () => {
    document.body.style.overflow = "auto";
  };

  return { disableBodyScroll, enableBodyScroll };
}
