import { getBlockList } from "~/utils/constants/blockList";

import FileInputMultiple from "~/components/Constructor/FileInputs/FileInputMultiple.vue";
import ImageGalleryInput from "~/components/Constructor/FileInputs/ImageGalleryInput.vue";
import ImageInput from "~/components/Constructor/FileInputs/ImageInput.vue";
import TextInputMultiple from "~/components/Constructor/FileInputs/TextInputMultiple.vue";
import QuoteInput from "~/components/Constructor/FileInputs/QuoteInput.vue";
import VideoPlayerInput from "~/components/Constructor/FileInputs/VideoPlayerInput.vue";

import { useValidation } from "#imports";

export const useBlocks = () => {
  const blocks = ref<{ id: number; component: any; type: string; data: {}; errors?: Record<string, string>}[]>([]);
  const sorting = ref(getBlockList());
  const selectBottom = ref(true);
  const disabledButton = ref(true);

  const { validateField, getBlockValidators } = useValidation();

  const validateBlocks = (): boolean => {
    let isValid = true;

    for(const block of blocks.value) {
      block.errors = {};
      const validators = getBlockValidators(block.type);

      for (const fieldKey in validators) {
        const fieldValue = (block.data as any)[fieldKey];
        const fieldRules = validators[fieldKey];

        const error = validateField(fieldValue, fieldRules);
        if (error) {
          isValid = false;
          if (!block.errors) block.errors = {};
          block.errors[fieldKey] = error;
        }
      }
    }

    return isValid;
  }

  const addBlock = (e: any) => {
    let component;
    switch (e) {
      case "Текстовый блок":
        component = TextInputMultiple;
        blocks.value.push({ id: Date.now(), type: "text", component: component, data: { title: "", text: "" } });
        break;
      case "Цитата":
        component = QuoteInput;
        blocks.value.push({ id: Date.now(), type: "quote", component: component, data: { title: "", text: "" } });
        break;
      case "Изображение":
        component = ImageInput;
        blocks.value.push({ id: Date.now(), type: "image", component: component, data: { link: "" } });
        break;
      case "Видеоплеер":
        component = VideoPlayerInput;
        blocks.value.push({ id: Date.now(), type: "video_file", component: component, data: { url: "" } });
        break;
      case "Файлы":
        component = FileInputMultiple;
        blocks.value.push({ id: Date.now(), type: "file_list", component: component, data: { files: [] } });
        break;
      case "Галерея изображений":
        component = ImageGalleryInput;
        blocks.value.push({ id: Date.now(), type: "image_gallery", component: component, data: { links: [] } });
        break;
    }

    setTimeout(() => {
      const newBlock = document.querySelector("article:last-child");
      if (newBlock) {
        newBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  const deleteBlock = async (id: number) => {
    const index = blocks.value.findIndex((block) => block.id === id);
    if (index !== -1) {
      blocks.value.splice(index, 1);
    }
  };

  const moveUpBlock = (id: number) => {
    const index = blocks.value.findIndex((block) => block.id === id);
    if (index > 0) {
      [blocks.value[index], blocks.value[index - 1]] = [blocks.value[index - 1], blocks.value[index]];
    }
  };

  const moveDownBlock = (id: number) => {
    const index = blocks.value.findIndex((block) => block.id === id);
    if (index < blocks.value.length - 1) {
      [blocks.value[index], blocks.value[index + 1]] = [blocks.value[index + 1], blocks.value[index]];
    }
  };

  return {
    blocks,
    sorting,
    addBlock,
    deleteBlock,
    moveUpBlock,
    moveDownBlock,
    selectBottom,
    disabledButton,
    validateBlocks,
  };
};
