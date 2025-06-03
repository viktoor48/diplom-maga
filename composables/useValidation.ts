export const useValidation = () => {
  const isValidVideoLink = (link: string): boolean => {
    const videoRegex = /^https?:\/\/.+\/.+\.(mp4|avi)(\?.*)?$/i;
    return videoRegex.test(link);
  };

  const isValidURL = (link: string): boolean => {
    const urlRegex = /^(https?:\/\/)([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;
    return urlRegex.test(link);
  };

  const validateURLWithErrorMessage = (link: string): string | boolean => isValidURL(link) ? true : 'Неверный тип данных';

  const required = (value: any): string | boolean => !!value.trim() || "Обязательное поле для ввода";

  const maxLength = (max: number) => (value: string): string | boolean =>
    !value || value.length <= max || `Превышено максимальное количество символов`;

  const minItems = (min: number) => (items: any[]): string | boolean =>
    items.length >= min || `Обязательное поле для ввода`;

  const validateImage = (link: string): string | boolean =>  required(link);

  const validateVideo = (url: string): string | boolean =>
    typeof required(url) === "string" ? required(url) : isValidVideoLink(url) || "Некорректная ссылка на видео";

  const validateUrl = (url: string): string | boolean => (typeof required(url) === "string" ? required(url) : isValidURL(url) || "Некорректный URL");

  const getBlockValidators = (type: string) => {
    const validators: Record<string, Array<(value: any) => string | boolean>> = {
      text: {
        title: [required, maxLength(255)],
        text: [required]
      },
      image: {
        link: [validateImage]
      },
      video_file: {
        url: [validateVideo]
      },
      image_gallery: {
        links: [minItems(1)]
      },
      quote: {
        title: [required, maxLength(255)],
        text: [required]
      },
      file_list: {
        title: [required, maxLength(255)],
        files: [minItems(1)]
      }
    };

    return validators[type] || {};
  };

  const noLinks = (value: string): string | boolean => {
    const urlRegex = /https?:\/\/[\S]+/i;
    return !urlRegex.test(value) || "Неверный тип данных";
  };

  const isInvalidDateRange = (dateStart: string, dateEnd: string): string => dateStart > dateEnd ? 'Дата начала не может быть больше даты окончания' : '';

  const validateField = (value: any, rules: Array<(val: any) => string | boolean>): string => {
    for (const rule of rules) {
      const result = rule(value);
      if (typeof result === 'string') return result;
    }
    return '';
  };

  return {
    isValidVideoLink,
    isValidURL,
    required,
    maxLength,
    minItems,
    validateImage,
    validateVideo,
    validateUrl,
    getBlockValidators,
    validateField,
    isInvalidDateRange,
    noLinks,
    validateURLWithErrorMessage,
  };
};
