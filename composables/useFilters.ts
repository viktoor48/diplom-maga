import type { FilterOption, CustomPeriod, FiltersState } from "~/types";

let filtersStateInstance: Ref<FiltersState> | null = null;

const defaultState: FiltersState = {
  selectedFilter: "За всё время",
  customPeriod: null,
};

export function useFilters() {
  if (!filtersStateInstance) {
    filtersStateInstance = ref({ ...defaultState });
  }

  // Получаем глобальное состояние
  const filtersState = filtersStateInstance!;

  const queryString: ComputedRef<string> = computed(() => {
    if (filtersState.value.customPeriod) {
      return `period=custom&start_date=${filtersState.value.customPeriod.start}&end_date=${filtersState.value.customPeriod.end}`;
    }

    switch (filtersState.value.selectedFilter) {
      case "За всё время":
        return "";
      case "5 минут":
        return "period=5min";
      case "10 минут":
        return "period=10min";
      case "1 час":
        return "period=1h";
      case "За неделю":
        return "period=week";
      case "За месяц":
        return "period=month";
      default:
        return "";
    }
  });

  function resetFilters() {
    Object.assign(filtersState.value, { ...defaultState });
  }

  function updateFilter(newFilter: FilterOption) {
    if (newFilter !== "Выбрать период...") {
      filtersState.value.selectedFilter = newFilter;
      filtersState.value.customPeriod = null;
    }
  }

  function updateCustomPeriod(period: CustomPeriod) {
    filtersState.value.customPeriod = period;
    filtersState.value.selectedFilter = formatPeriod(period);
  }

  function formatPeriod(period: CustomPeriod): string {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

    const startDate = new Date(period.start);
    const endDate = new Date(period.end);

    const formattedStart = startDate.toLocaleDateString("ru-RU", options);
    const formattedEnd = endDate.toLocaleDateString("ru-RU", options);

    return `С ${formattedStart} по ${formattedEnd}`;
  }

  function getDateRange(): { start: string; end: string } | null {
  if (!filtersState.value.customPeriod) return null;
  
  return {
    start: new Date(filtersState.value.customPeriod.start).toISOString(),
    end: new Date(filtersState.value.customPeriod.end).toISOString()
  };
}

  return { filtersState, resetFilters, updateFilter, updateCustomPeriod, queryString, getDateRange };
}