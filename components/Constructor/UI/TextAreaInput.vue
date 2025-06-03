<script setup lang="ts">
const emit = defineEmits(["update:modelValue"]);

const { modelValue, placeHolder } = defineProps({
  modelValue: String,
  placeHolder: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: String,
    default: "",
  },
  charCount: {
    type: [Number, null],
    default: null,
  },
});

const textarea = ref<HTMLTextAreaElement | null>(null);

const adjustTextareaHeight = () => {
  if (!textarea.value) return;

  textarea.value.style.height = "2.5rem";
  const scrollHeight = textarea.value.scrollHeight;
  textarea.value.style.height = `${scrollHeight - 14}px`;

  if (scrollHeight > 42) {
    textarea.value.classList.add("has-content");
    textarea.value.style.height = `${scrollHeight + 2}px`;
  } else {
    textarea.value.classList.remove("has-content");
  }
};

const handleTextarea = (e: Event) => {
  adjustTextareaHeight();
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
};

onMounted(() => {
  if (modelValue && textarea.value) {
    nextTick(() => {
      adjustTextareaHeight();
    });
  }
});

watch(
  () => modelValue,
  () => {
    nextTick(() => {
      adjustTextareaHeight();
    });
  }
);
</script>

<template>
  <div class="flex flex-col gap-[0.375rem]">
    <span v-if="title" class="text-[#344054] text-[0.875rem] font-medium leading-[1.4]">{{ title }}</span>
    <textarea
      required
      type="text"
      name="text"
      class="leading-[1.5] border border-[#D0D5DD] px-3.5 pt-[0.5rem] rounded-xl h-[2.5rem] resize-none textarea"
      :class="{'!border-[#B42318] border': errorMessage}"
      ref="textarea"
      @drop.prevent
      :value="modelValue"
      :placeholder="placeHolder"
      @input="handleTextarea"
      v-char-count="charCount"
    />
    <span v-if="errorMessage" class="text-[#B42318] text-[0.875rem] font-medium leading-[142.857%]">{{ errorMessage }}</span>
  </div>
</template>

<style scoped>
.textarea {
  min-height: 2.5rem;
  padding-bottom: 0.25rem;
}

.textarea.has-content {
  padding-bottom: 0.25rem;
  /* box-sizing: content-box; */
}

.textarea::-webkit-scrollbar {
  width: 0;
}
</style>
