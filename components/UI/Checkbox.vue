<script setup lang="ts">
const model = defineModel<boolean>({ required: true });

defineProps<{
  isHovered?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <input
    v-model="model"
    type="checkbox"
    class="custom"
    :class="[{ 'hover-state': isHovered }, { 'cursor-default border-[#d0d5dd]': disabled }]"
    :disabled="disabled"
  />
</template>

<style scoped>
.custom {
  appearance: none;
  background-color: #fff;
  margin: 0;
  width: 1em;
  height: 1em;
  border: 0.063rem solid #d0d5dd;
  border-radius: 0.25em;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #86c577;
}

.custom:checked {
  background-color: rgba(185, 233, 174, 0.2);
  border-color: #639a72;
}

.custom::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background-repeat: no-repeat;
  background-size: contain;
  transition: all 0.2s ease;
  opacity: 0;
}

.custom:checked::after {
  width: 0.75rem;
  height: 0.75rem;
  opacity: 1;
  background-image: url("/assets/images/icons/checkbox-green.svg");
}

.custom:hover,
.custom.hover-state {
  border: 0.063rem solid #639a72;
}
</style>
