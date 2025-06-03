export type EventType = "all" | "offline" | "online";

export interface EventsFiltersState {
  eventType: EventType;
  selectedTags: string[];
}

let eventsFiltersStateInstance: Ref<EventsFiltersState> | null = null;

const defaultEventsState: EventsFiltersState = {
  eventType: "all",
  selectedTags: [],
};

export function useEventsFilters() {
  if (!eventsFiltersStateInstance) {
    eventsFiltersStateInstance = ref({ ...defaultEventsState });
  }

  const filtersState = eventsFiltersStateInstance;

  const queryString = computed(() => {
    const params = new URLSearchParams();

    if (filtersState.value.eventType !== "all") {
      params.append("format", filtersState.value.eventType);
    }

    if (filtersState.value.selectedTags.length > 0) {
      params.append("tags", filtersState.value.selectedTags.join(","));
    }

    return decodeURIComponent(params.toString().replace(/\+/g, '%20'));
  });

  function resetFilters() {
    Object.assign(filtersState.value, {...defaultEventsState});
  }

  function updateEventType(type: EventType) {
    filtersState.value.eventType = type;
  }

  function toggleTag(tag: string) {
    const index = filtersState.value.selectedTags.indexOf(tag);
    if (index === -1) {
      filtersState.value.selectedTags.push(tag);
    } else {
      filtersState.value.selectedTags.splice(index, 1);
    }
  }

  function setTags(tags: string[]) {
    filtersState.value.selectedTags = [...tags];
  }

  function isTagSelected(tag: string): boolean {
    return filtersState.value.selectedTags.includes(tag);
  }

  return {
    filtersState,
    queryString,
    resetFilters,
    updateEventType,
    toggleTag,
    isTagSelected,
    setTags,
  };
}
