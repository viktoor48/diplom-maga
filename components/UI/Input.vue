<script setup lang="ts">
const model = defineModel<boolean>({required: true})
</script>

<template>
      <input v-model="model" type="checkbox" id="pinned" class="custom">
</template>

<style scoped>
.custom {
  appearance: none;
  background-color: #fff;
  margin: 0;
  width: 1.15em;
  height: 1.15em;
  border: 0.063rem solid #D0D5DD;
  border-radius: 0.25em;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #86C577;
}

.custom:checked {
  background-color: #86C577;
  border-color: #86C577;
}

.custom::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background-image: url("/assets/images/icons/checkbox-white.svg");
  background-repeat: no-repeat;
  background-size: contain;
  transition: all 0.2s ease;
  opacity: 0;
}

.custom:checked::after {
  width: 0.75rem;
  height: 0.75rem;
  opacity: 1;
  background-image: url("/assets/images/icons/checkbox-white.svg");
}

.custom:hover {
  border: 0.063rem solid #86C577;
  background-color: white;
}

.custom:checked:hover::after {
  background-image: url("/assets/images/icons/checkbox-green.svg");
}
</style>