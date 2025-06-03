<script setup lang="ts">
import DeleteCardModal from "./Modals/DeleteCardModal.vue";

const props = defineProps<{
  hideEditButton?: boolean;
  to?: string;
  hide_button?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const handleEdit = () => {
  emit("edit");
};

const handleDelete = () => {
  emit("delete");
};

const getCurrentComponent = computed(() => (props.to ? resolveComponent("NuxtLink") : "button"));

const getStyle = computed(() => {
  return props.hideEditButton === true ? "justify-end" : "justify-between";
});

const getBindAttrs = computed(() => (props.to ? { to: props.to } : { onClick: handleEdit }));
</script>

<template>
  <div class="flex mt-3" :class="getStyle">
    <component
      class="flex items-center gap-3 cursor-pointer hover:opacity-80 duration-300"
      :is="getCurrentComponent"
      v-bind="getBindAttrs"
      v-if="!hideEditButton"
    >
      <img src="/assets/images//icons/edit-icon.svg" alt="Редактировать" class="w-[1.125rem]" />
      <span class="text-sm text-[#667085]">Редактировать</span>
    </component>
    <DeleteCardModal v-if="!hide_button" @delete="handleDelete" />
  </div>
</template>
