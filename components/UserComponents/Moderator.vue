<script setup lang="ts">
import TextInputComponent from "~/components/Constructor/UI/TextInputComponent.vue";

const userSurname = ref<string>("");
const userName = ref<string>("");
const userPatronymic = ref<string>("");
const userLogin = ref<string>("");
const userPassword = ref<string>("");
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label for="user-surname" class="text-[#344054] font-medium text-sm">Фамилия</label>
    <TextInputComponent id="user-surname" placeHolder="Введите фамилию" class="w-full" v-model="userSurname" />
  </div>
  <div class="flex flex-col gap-1.5 w-full">
    <label for="user-name" class="text-[#344054] font-medium text-sm">Имя</label>
    <TextInputComponent id="user-name" placeHolder="Введите имя" class="w-full" v-model="userName" />
  </div>
  <div class="flex flex-col gap-1.5 w-full">
    <label for="user-patronymic" class="text-[#344054] font-medium text-sm">Отчество</label>
    <TextInputComponent id="user-patronymic" placeHolder="Введите отчество" class="w-full" v-model="userPatronymic" />
  </div>
  <div class="flex flex-col gap-1.5 w-full">
    <label for="user-login" class="text-[#344054] font-medium text-sm">Логин</label>
    <TextInputComponent id="user-login" placeHolder="Введите логин" class="w-full" v-model="userLogin" />
  </div>
  <div class="flex flex-col gap-1.5 w-full">
    <label for="user-password" class="text-[#344054] font-medium text-sm">Пароль</label>
    <TextInputComponent id="user-password" placeHolder="Введите пароль" class="w-full" v-model="userPassword" />
  </div>
</template>
