<script setup lang="ts">
import { Button } from "~/components/UI/button";

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "~/components/UI/pagination";

const { itemsPerPage, total, currentPage } = defineProps<{ itemsPerPage: number; total: number; currentPage: number }>();
</script>

<template>
  <Pagination
    class="flex w-full pr-10 pt-3 bg-white items-start border-t border-t-[#D0D5DD]"
    :page="currentPage"
    :items-per-page="itemsPerPage"
    :total="total"
    :sibling-count="1"
    show-edges
    :default-page="1"
  >
    <PaginationList v-slot="{ items }" class="flex w-full px-6 items-center justify-center gap-1">
      <PaginationFirst class="border-none shadow-none text-[#667085] hover:opacity-80 duration-300" />
      <PaginationPrev class="border-none shadow-none text-[#667085] hover:opacity-80 duration-300" />

      <template v-for="(item, index) in items">
        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
          <Button
            class="w-8 h-8 p-0 rounded-[0.625rem] text-[#667085] border border-[#D0D5DD] hover:bg-[#F2F4F7] duration-300"
            :variant="item.value === currentPage ? 'default' : 'outline'"
            :class="{ 'active-page': item.value === currentPage }"
            @click="$emit('update:page', item.value)"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext class="border-none shadow-none text-[#667085] hover:opacity-80 duration-300" />
      <PaginationLast class="border-none shadow-none text-[#667085] hover:opacity-80 duration-300" />
    </PaginationList>
    <p class="text-[#667085] text-sm min-w-[8rem] pt-3">Страница {{ currentPage }} из {{ Math.ceil(total / itemsPerPage) }}</p>
  </Pagination>
</template>

<style scoped>
.active-page {
  color: #05603a;
  box-shadow: none;
  background-color: #f2f4f7;
  border: 1px solid #d0d5dd;
}
</style>
