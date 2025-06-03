<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/UI/alert-dialog";

const emit = defineEmits(["delete"]);

const deleteFile = () => {
  emit("delete");
};
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger>
      <button class="hover:opacity-80 duration-300">
        <img src="/assets//images//icons/delete-pic-icon.svg" alt="Удалить" class="w-5" />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent class="bg-white !rounded-3xl max-w-[26rem]">
      <AlertDialogHeader class="flex flex-col gap-1">
        <AlertDialogTitle class="text-[#101828] font-medium text-[1.125rem] leading-[1.4]">Удаление документа</AlertDialogTitle>
        <AlertDialogDescription class="text-[#667085] text-sm">Удалить документ без возможности восстановления?</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="!flex !w-full !justify-center mt-2">
        <AlertDialogCancel
          class="w-full text-[#101828] text-[1rem] font-medium border border-[#D0D5DD] shadow-sm rounded-[0.5rem] hover:bg-[#EFEFEF] duration-300"
          >Отмена</AlertDialogCancel
        >
        <AlertDialogAction class="w-full bg-[#B42318] text-white text-[1rem] font-medium rounded-[0.5rem] hover:bg-red-800 duration-300" @click="deleteFile"
          >Удалить</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
