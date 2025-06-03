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

const props = defineProps<{
  id: number,
  comment: string | null,
}>()
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger>
      <img class="p-1 action-btn hover:opacity-80 duration-300" src="/assets/images/icons/message-circle.svg" />
    </AlertDialogTrigger>
    <AlertDialogContent class="bg-white !rounded-3xl w-[27.625rem]">
      <AlertDialogHeader class="flex flex-col gap-0">
        <div class="flex justify-between items-center mb-6">
          <AlertDialogTitle class="text-[#101828] font-medium text-[1.125rem] leading-[1.4]">Комментарий к мероприятию</AlertDialogTitle>
          <AlertDialogCancel class="[all:unset]">
            <img class="cursor-pointer p-1 w-8 h-8 action-btn hover:opacity-80 duration-300" src="/assets/images/icons/cross.svg" />
          </AlertDialogCancel>
        </div>
        <AlertDialogDescription class="text-[#667085] text-sm mb-1">Комментарий</AlertDialogDescription>
        <textarea disabled class="resize-none textarea min-h-[10.5rem] px-4 py-3 border border-[#D0D5DD] rounded-lg" type="text" :value="comment" name="comment" />
      </AlertDialogHeader>
      <AlertDialogFooter class="!flex !w-full !justify-center">
        <AlertDialogAction @click="navigateTo(`/calendar/${id}`)" class="w-full py-2 px-3 bg-[#E6F1E5] text-[#000000] text-[1rem] leading-[125%] font-medium rounded-[0.5rem] hover:bg-[#D0E5CF] duration-300"
          >Редактировать мероприятие</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>
.textarea::-webkit-scrollbar {
  width: 0;
}
</style>
