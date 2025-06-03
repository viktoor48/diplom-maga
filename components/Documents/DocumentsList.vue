<script setup lang="ts">
import DeleteFileModal from "../Modals/DeleteFileModal.vue";
import { useDocuments } from "~/composables/requests/useDocuments";

const { documents } = defineProps<{ documents: any }>();
const emit = defineEmits(["refreshDocumentsList", "refreshOrder"]);

const { deleteDocumentById, moveDocument } = useDocuments();

const getFileFormat = (link: string) => {
  if (link.includes(".docx") || link.includes(".doc")) {
    return "DOCX";
  } else if (link.includes(".pdf")) {
    return "PDF";
  }
};

const getFileFormatIcon = (link: string) => {
  if (link.includes(".docx") || link.includes(".doc")) {
    return "/admin/images/file-formats/doc-format.svg";
  } else if (link.includes(".pdf")) {
    return "/admin/images/file-formats/pdf-format.svg";
  }
};

const deleteDocument = (document: any) => {
  deleteDocumentById(document.id, { method: "DELETE" });
  emit("refreshDocumentsList");
};

const moveDocumentUp = (document: any, index: number) => {
  if (document.order === 0 || index === 0) return;
  moveDocument(document.order, document.order + 1);
  emit("refreshOrder");
};

const moveDocumentDown = (document: any, index: number) => {
  if (index === documents.length - 1) return;
  moveDocument(document.order, document.order - 1);
  emit("refreshOrder");
};
</script>

<template>
  <transition-group name="list" tag="article" class="flex flex-col gap-1 m-auto w-[50rem] p-3 bg-[#F7F7F8] border border-[#E4E4E7 ] shadow-md rounded-[1.5rem]">
    <li v-for="(document, i) in documents" :key="document.id" class="flex items-center justify-between gap-3 p-4 bg-white border border-[#D0D5DD] rounded-xl">
      <div class="flex items-center gap-3">
        <img :src="getFileFormatIcon(document.link)" alt="File" class="w-10 h-10" />
        <div>
          <div class="flex">
            <h3 class="text-[#101828] text-sm font-medium" v-html="document.title"></h3>
            <span class="text-[#101828] text-sm font-medium">.{{ getFileFormat(document.link) }}</span>
          </div>
          <span class="text-[#667085] text-xs">{{ document.size }} МБ</span>
        </div>
      </div>
      <div class="flex items-center gap-4 h-9">
        <nuxt-link :to="`/documents/${document.id}`">
          <img src="assets/images/icons/edit-icon.svg" alt="Редактировать" class="cursor-pointer w-5 hover:opacity-80 duration-300" />
        </nuxt-link>
        <div class="w-[1px] h-6 bg-gray-300"></div>
        <div class="flex items-center gap-4">
          <img src="/assets/images/icons/move-block-icon.svg" class="cursor-pointer w-5 hover:opacity-80 duration-300" @click="moveDocumentUp(document, i)" />
          <img
            src="/assets/images/icons/move-block-icon.svg"
            class="cursor-pointer transform scale-y-[-1] w-5 hover:opacity-80 duration-300"
            @click="moveDocumentDown(document, i)"
          />
        </div>
        <div class="w-[1px] h-6 bg-gray-300"></div>
        <DeleteFileModal @delete="deleteDocument(document)" />
      </div>
    </li>
  </transition-group>
</template>

<style lang="scss" scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
