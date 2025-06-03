export function useClickOutside(callback: () => void, refs: Array<Ref<HTMLElement | null>>) {
  const handleClickOutside = (event: MouseEvent) => {
    const isOutside = refs.every((ref) => ref.value && !ref.value.contains(event.target as Node));
    if (isOutside) {
      callback();
    }
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
}
