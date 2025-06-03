export const useFormattedDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return new Date(date).toLocaleDateString("ru-RU", options).replace("г.", '');
};
