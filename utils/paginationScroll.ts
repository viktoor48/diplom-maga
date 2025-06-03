export const scrollToTop = (id: string) => {
  const list = document.querySelector(`#${id}`);
  if (list) {
    list.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
