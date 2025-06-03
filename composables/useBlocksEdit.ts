import { getBlockList } from "~/utils/constants/blockList";

import FileInputMultiple from "~/components/Constructor/FileInputs/FileInputMultiple.vue";
import ImageGalleryInput from "~/components/Constructor/FileInputs/ImageGalleryInput.vue";
import ImageInput from "~/components/Constructor/FileInputs/ImageInput.vue";
import TextInputMultiple from "~/components/Constructor/FileInputs/TextInputMultiple.vue";
import QuoteInput from "~/components/Constructor/FileInputs/QuoteInput.vue";
import VideoPlayerInput from "~/components/Constructor/FileInputs/VideoPlayerInput.vue";

export const useBlocksEdit = () => {
  const blocks = ref<{ id: number; component: any; type: string; data: {}; errors: Record<string, string> }[]>([]);
  const sorting = ref(getBlockList());

  const selectBottom = ref(true);
  const disabledButton = ref(true);
  const isLoading = ref(false);

  let imageAdded = ref(true);
  let textAdded = ref(true);
  let quoteAdded = ref(true);
  let videoAdded = ref(true);
  let fileAdded = ref(true);
  let galleryAdded = ref(true);

  const { validateField, getBlockValidators } = useValidation();

  const validateBlocks = (): boolean => {
    let isValid = true;

    for (const block of blocks.value) {
      block.errors = {};
      const validators = getBlockValidators(block.type);

      for (const fieldKey in validators) {
        const fieldValue = (block.data as any)[fieldKey];
        const fieldRules: any = validators[fieldKey];

        const error = validateField(fieldValue, fieldRules);
        if (error) {
          isValid = false;
          block.errors[fieldKey] = error;
        }
      }
    }

    return isValid;
  };

  const fillFields = (data: any) => {
    data.blocks.forEach((block: any) => {
      switch (block.type) {
        case "text":
          blocks.value.push({ id: Date.now(), component: TextInputMultiple, type: "text", data: { title: block.title, text: block.text }, errors: {} });
          break;
        case "image":
          blocks.value.push({ id: Date.now(), component: ImageInput, type: "image", data: { link: block.link }, errors: {} });
          break;
        case "video_file":
          blocks.value.push({ id: Date.now(), component: VideoPlayerInput, type: "video_file", data: { url: block.url }, errors: {} });
          break;
        case "file_list":
          blocks.value.push({
            id: Date.now(),
            component: FileInputMultiple,
            type: "file_list",
            data: { title: block.title, files: block.files.map((file: any) => file.link) },
            errors: {},
          });
          break;
        case "image_gallery":
          blocks.value.push({ id: Date.now(), component: ImageGalleryInput, type: "image_gallery", data: { links: block.links }, errors: {} });
          break;
        case "quote":
          blocks.value.push({ id: Date.now(), component: QuoteInput, type: "quote", data: { title: block.title, text: block.text }, errors: {} });
          break;
      }
    });
  };

  const addBlock = (e: any) => {
    let component;
    switch (e) {
      case "Текстовый блок":
        component = TextInputMultiple;
        blocks.value.push({ id: Date.now(), type: "text", component: component, data: { title: "", text: "" }, errors: {} });
        break;
      case "Цитата":
        component = QuoteInput;
        blocks.value.push({ id: Date.now(), type: "quote", component: component, data: { title: "", text: "" }, errors: {} });
        break;
      case "Изображение":
        component = ImageInput;
        blocks.value.push({ id: Date.now(), type: "image", component: component, data: { link: "" }, errors: {} });
        break;
      case "Видеоплеер":
        component = VideoPlayerInput;
        blocks.value.push({ id: Date.now(), type: "video_file", component: component, data: { url: "" }, errors: {} });
        break;
      case "Файлы":
        component = FileInputMultiple;
        blocks.value.push({ id: Date.now(), type: "file_list", component: component, data: { files: [] }, errors: {} });
        break;
      case "Галерея изображений":
        component = ImageGalleryInput;
        blocks.value.push({ id: Date.now(), type: "image_gallery", component: component, data: { links: [] }, errors: {} });
        break;
    }

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  const deleteBlock = (i: number) => {
    const blockToDelete = blocks.value[i];
    blocks.value.splice(i, 1);
    checkBlockToDelete(blockToDelete.component.__name);
  };

  const checkBlockToDelete = (name: string) => {
    switch (name) {
      case "ImageInput":
        imageAdded.value = false;
        break;
      case "TextInputMultiple":
        textAdded.value = false;
        break;
      case "QuoteInput":
        quoteAdded.value = false;
        break;
      case "VideoPlayerInput":
        videoAdded.value = false;
        break;
      case "FileInputMultiple":
        fileAdded.value = false;
        break;
      case "ImageGalleryInput":
        galleryAdded.value = false;
        break;
    }
  };

  const moveUpBlock = (index: number) => {
    if (index > 0) {
      [blocks.value[index], blocks.value[index - 1]] = [blocks.value[index - 1], blocks.value[index]];
    }
  };

  const moveDownBlock = (index: number) => {
    if (index < blocks.value.length - 1) {
      [blocks.value[index], blocks.value[index + 1]] = [blocks.value[index + 1], blocks.value[index]];
    }
  };

  return {
    blocks,
    sorting,
    addBlock,
    fillFields,
    deleteBlock,
    checkBlockToDelete,
    moveUpBlock,
    moveDownBlock,
    selectBottom,
    disabledButton,
    isLoading,
    validateBlocks,
  };
};
