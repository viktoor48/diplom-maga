import type { FilterOption, CustomPeriod, FiltersState } from "~/types";
import { format } from "date-fns";
import { startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

let filtersStateInstance: Ref<FiltersState> | null = null;

const defaultState: FiltersState = {
  selectedFilter: "За всё время",
  customPeriod: null,
};

const formatDate = (date: Date): string => format(date, "yyyy-MM-dd");

export function useEventFilters() {
  if (!filtersStateInstance) {
    filtersStateInstance = ref({ ...defaultState });
  }

  // Получаем глобальное состояние
  const filtersState = filtersStateInstance!;

  const queryString: ComputedRef<string> = computed(() => {
    const selected = filtersState.value.selectedFilter;
    const custom = filtersState.value.customPeriod;

    if (custom) {
      return `start=${custom.start}&end=${custom.end}`;
    }

    const today = new Date();

    if (selected === "За всё время") {
      return "";
    }

    if (selected === "За сегодня") {
      const start = formatDate(startOfToday());
      const end = formatDate(endOfToday());
      return `start=${start}&end=${end}`;
    }

    if (selected === "За неделю") {
      const start = formatDate(startOfWeek(today, { weekStartsOn: 1 }));
      const end = formatDate(endOfWeek(today, { weekStartsOn: 1 }));
      return `start=${start}&end=${end}`;
    }

    if (selected === "За месяц") {
      const start = formatDate(startOfMonth(today));
      const end = formatDate(endOfMonth(today));
      return `start=${start}&end=${end}`;
    }

    return "";
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

  return { filtersState, resetFilters, updateFilter, updateCustomPeriod, queryString };
}
