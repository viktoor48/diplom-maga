<script setup lang="ts">
import type { EventCard } from "~/types";
import DeleteCardModal from "~/components/Modals/DeleteCardModal.vue";
import ShowCommentModal from "~/components/Modals/ShowCommentModal.vue";
import { useEvents } from "~/composables/requests/useEvents";

const { deleteEventById } = useEvents();

const getRole = computed(() => {
  return localStorage.getItem("role");
});

const props = defineProps<{
  event: EventCard;
}>();

const emit = defineEmits<{
  (e: "refreshEventsList"): void;
}>();

const getFormattedDate = computed(() => useFormattedDate(props.event.event_start.split(" ")[0]));

const getPeriodTime = computed(() => {
  const startTime = props.event.event_start.split(" ")[1].split(":").slice(0, 2).join(":");

  if (!props.event.event_end) return startTime;

  const endTime = props.event.event_end.split(" ")[1].split(":").slice(0, 2).join(":");

  return `${startTime} - ${endTime}`;
});

// Показывать кнопку "Подробнее" только для pending и не organiser
const showDetailsButton = computed(() => {
  return props.event.status === 'pending' && getRole.value !== 'organiser';
})

// Показывать статус и action-кнопки
const showStatusAndActions = computed(() => {
  // Не показываем если pending и не organiser
  if (props.event.status === 'pending' && getRole.value !== 'organiser') return false;
  // Во всех остальных случаях показываем
  return true;
})

const showCommentaryIcon = computed(() => {
  return !!props.event.commentary &&
    props.event.status !== 'approved' &&
    !(props.event.status === 'pending' && getRole.value === 'organiser') && 
    props.event.status !== 'completed';
});

const showEditIcon = computed(() => {
  return props.event.status !== 'completed' && !(props.event.status === 'pending' && getRole.value === 'organiser');
})


const deleteCard = async () => {
  await deleteEventById(props.event.id);
  emit("refreshEventsList");
}

const formatMap = new Map<string, string>([
  ["offline", 'Офлайн'],
  ["online", 'Онлайн'],
]);

const isStatusCompleted = computed(() => {
  return props.event.status === 'completed'
})
</script>

<template>
  <article class="flex flex-col bg-[#FCFCFD] rounded-3xl w-full shadow duration-300" :class="{'bg-[#FCFCFD]': event.status === 'completed'}">
    <div :to="`/calendar/${event.id}`"
      class="flex h-[20.75rem] flex-col gap-6 max-sm:gap-4 duration-300 rounded-3xl w-full p-4 max-sm:p-4 max-sm:h-[18.75rem]">
      <header class="flex flex-col gap-[0.375rem]">
        <div class="flex gap-2">
          <EventLabel type="date" :class="{'text-[#667085]': isStatusCompleted }"> {{ getFormattedDate }}</EventLabel>
          <EventLabel type="time" :class="{'text-[#667085]': isStatusCompleted }">{{ getPeriodTime }}</EventLabel>
        </div>
        <div class="flex gap-[0.375rem] flex-nowrap overflow-hidden">
          <EventLabel type="people" :class="{'text-[#667085]': isStatusCompleted }">{{ formatMap.get(event.event_format) }}</EventLabel>
          <EventLabel type="location" :class="{'text-[#667085]': isStatusCompleted }">{{ event.address }}</EventLabel>
        </div>
      </header>
      <main class="flex flex-col gap-4">
        <p class="text-[1.375rem] break-words font-medium leading-[120%] text-[#000] text-wrap line-clamp-2" :class="{'text-[#667085]': isStatusCompleted }">{{ event.title }}</p>
        <div class="flex flex-col gap-1">
          <div v-for="(tag, ind) in event.tags" :key="ind"
            class="text-[#667085] text-[1rem] leading-[125%] max-sm:text-[0.875rem] max-sm:leading-[142.857%]">
            {{ tag }}
          </div>
        </div>
      </main>
      <footer class="flex flex-col gap-2 max-sm:gap-1 mt-auto">
        <NuxtLink v-if="showDetailsButton" :to="`/calendar/preview/${event.id}`"
          class="w-full bg-white rounded-lg flex justify-center items-center py-[0.375rem] px-3 border border-[#D0D5DD] text-[1rem] leading-[125%] text-black">
          Подробнее
        </NuxtLink>
        <div v-if="showStatusAndActions" class="flex justify-between items-center">
          <EventStatus :status="event.status" />
          <div class="flex items-center icon-list ml-auto">
            <div
              v-if="showCommentaryIcon"
              class="icon-item h-[2.25rem] cursor-pointer">
              <ShowCommentModal :comment="event.commentary" :id="event.id" />
            </div>
            <nuxt-link v-if="showEditIcon" :to="`calendar/${event.id}`"
              class="icon-item h-[2.25rem] cursor-pointer hover:opacity-80 duration-300">
              <img class="p-1 action-btn" src="/assets/images/icons/editEvent.svg" />
            </nuxt-link>
            <div class="icon-item h-[2.25rem] cursor-pointer">
              <DeleteCardModal v-if="true" :custom-icon="true" @delete="deleteCard" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.shadow {
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.02), 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
}

.icon-list {
  display: flex;
  align-items: center;
}

.icon-item {
  position: relative;
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.icon-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 1.5rem;
  width: 1px;
  background-color: #d1d5db;
}
</style>
