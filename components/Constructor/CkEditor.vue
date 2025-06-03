<template>
  <div>
    <div class="main-container">
      <div class="editor-container editor-container_classic-editor" ref="editorContainerElement" :class="{ 'editor-error': isLimitExceeded || errorMessage }">
        <div class="editor-container__editor flex flex-col">
          <div ref="editorElement" class="shadow rounded-xl">
            <ckeditor v-if="isLayoutReady" :editor="editor" :config="config" v-model="text" @input="updateText" @ready="onEditorReady" />
          </div>
          <div class="flex justify-between">
            <div>
              <p class="text-[0.875rem] mt-2 self-start text-[#B42318]" v-if="errorMessage">{{ errorMessage }}</p>
              <p class="text-[0.875rem] mt-2 self-start text-[#B42318]" v-if="isLimitExceeded">Превышено максимальное количество символов</p>
              <p class="text-[0.875rem] mt-2 self-start text-[#B42318] w-10" v-else></p>
            </div>
            <p class="text-xs mt-2 justify-end !self-end" :class="[isLimitExceeded ? 'text-[#B42318]' : 'text-[#98A2B3]']">{{ charCount }} из 800 символов</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const text = ref(props.modelValue);
const charCount = ref(0);
const editorInstance = ref(null);
const isLimitExceeded = computed(() => charCount.value > 800);

const updateText = (newText) => {
  text.value = newText;
  emit("update:modelValue", newText);

  if (editorInstance.value) {
    const textWithoutHtml = newText.replace(/(<([^>]+)>)/gi, "");
    charCount.value = textWithoutHtml.length;
  }
};

const onEditorReady = (editor) => {
  editorInstance.value = editor;

  const initialText = editor.getData();
  const textWithoutHtml = initialText.replace(/(<([^>]+)>)/gi, "");
  charCount.value = textWithoutHtml.length;

  editor.model.document.on("change", () => {
    const currentText = editor.getData();
    const textWithoutHtml = currentText.replace(/(<([^>]+)>)/gi, "");
    charCount.value = textWithoutHtml.length;
  });
};

watch(
  () => props.modelValue,
  (newVal) => {
    text.value = newVal;
    if (editorInstance.value && newVal !== editorInstance.value.getData()) {
      editorInstance.value.setData(newVal);
    }
  }
);
</script>

<script>
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autosave,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Italic,
  Paragraph,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo,
  Link,
  List,
  Indent,
  IndentBlock,
  PasteFromOffice,
} from "ckeditor5";

import translations from "ckeditor5/translations/ru.js";

import "ckeditor5/ckeditor5.css";

export default {
  name: "app",
  data() {
    return {
      isLayoutReady: false,
      config: null,
      editor: ClassicEditor,
    };
  },
  mounted() {
    this.config = {
      toolbar: {
        items: [
          "bold",
          "italic",
          "strikethrough",
          "underline",
          "link",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "alignment",
          "|",
          "numberedList",
          "bulletedList",
          "|",
          "subscript",
          "superscript",
          "|",
          "specialCharacters",
          "|",
          "accessibilityHelp",
          "|",
          "removeFormat",
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        AccessibilityHelp,
        Alignment,
        Autosave,
        Bold,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        GeneralHtmlSupport,
        Italic,
        Paragraph,
        RemoveFormat,
        SelectAll,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Subscript,
        Superscript,
        Underline,
        Undo,
        Link,
        List,
        Indent,
        IndentBlock,
        PasteFromOffice,
      ],
      fontFamily: {
        supportAllValues: true,
      },
      fontSize: {
        options: [10, 12, 14, "default", 18, 20, 22],
        supportAllValues: true,
      },
      htmlSupport: {
        allow: [
          {
            name: /^.*$/,
            styles: true,
            attributes: true,
            classes: true,
          },
        ],
      },
      language: "ru",
      placeholder: "Введите текст...",
      translations: [translations],
      pasteFilter: "plain-text",
    };

    this.isLayoutReady = true;
  },
};
</script>

<style lang="scss">
.ck .ck-content {
  ul,
  ol {
    padding-left: 2.5rem;
  }
}

.ck {
  .ck-sticky-panel__content {
    height: 3rem;
    border-radius: 12px;
  }
}

.ck.ck-editor .ck-editor__top .ck-sticky-panel .ck-toolbar {
  height: 100%;
}

.ck .ck-toolbar__items {
  font-size: 0.7rem;
}

:root {
  --ck-custom-border: #d0d5dd;
  --ck-color-focus-border: #d0d5dd;
  --ck-color-shadow-drop: none;
  --ck-color-shadow-inner: none;
}

.editor-error {
  .ck.ck-editor__editable:not(.ck-editor__nested-editable) {
    border-bottom: 1px solid #b42318 !important;
    border-left: 1px solid #b42318 !important;
    border-right: 1px solid #b42318 !important;
    // border-radius: 12px;
  }

  .ck.ck-toolbar {
    outline: 1px solid #b42318 !important;
  }
}
</style>
