<script setup lang="ts">
import TextInputComponent from "~/components/Constructor/UI/TextInputComponent.vue";
import TextAreaInput from "../Constructor/UI/TextAreaInput.vue";

const organization = ref<string>("");
const login = ref<string>("");
const password = ref<string>("");
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label for="organization" class="text-[#344054] font-medium text-sm">Организация</label>
    <TextAreaInput id="organization" placeHolder="Введите название организации" class="w-full" v-model="organization" />
  </div>
  <div class="flex flex-col gap-1.5 w-full">
    <label for="organizer-login" class="text-[#344054] font-medium text-sm">Логин</label>
    <TextInputComponent id="organizer-login" placeHolder="Введите логин" class="w-full" v-model="login" />
  </div>
  <div class="flex flex-col gap-1.5 w-full">
    <label for="organizer-password" class="text-[#344054] font-medium text-sm">Пароль</label>
    <TextInputComponent id="organizer-password" placeHolder="Введите пароль" class="w-full" v-model="password" />
  </div>
</template>
