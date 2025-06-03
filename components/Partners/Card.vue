<script setup lang="ts">
import type { Partner } from "~/types";
import { usePartners } from "~/composables/requests/usePartners";

const { deletePartnerById } = usePartners();

const emit = defineEmits<{
  (e: "refreshPartnersList"): void;
}>();

const props = defineProps<{
  partner: Partner;
}>();

const deleteCard = async () => {
  await deletePartnerById(props.partner.id);
  emit("refreshPartnersList");
}
</script>

<template>
  <article
    class="flex flex-col bg-[#FCFCFD] hover:bg-[#F4FCF3] duration-300 rounded-[1.25rem] h-[18.188rem]"
  >
    <div
      class="flex justify-center items-center w-full h-[10.188rem] bg-[#F2F4F7] py-10 px-5 rounded-[1.25rem]"
    >
      <nuxt-img
        :src="`${$config.public.imageBase}${props.partner.photo}`"
        class="max-h-full"
        :placeholder="true"
        format="webp"
        alt=""
      />
    </div>
    <div class="p-6 h-[8rem] flex flex-col gap-5">
      <p
        class="text-[#667085] text-base leading-[150%] line-clamp-1 text-wrap truncate"
      >
        {{ props.partner.url }}
      </p>
      <EditDeleteButtons :to="`/main/partners/edit/${props.partner.id}`" @delete="deleteCard" />
    </div>
  </article>
</template>
