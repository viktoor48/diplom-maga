import { useClickOutside } from "#imports";
import {
  getLocalTimeZone,
  parseZonedDateTime,
  today,
  type DateValue
} from "@internationalized/date";

export function useCalendar(dateStart: Ref<string>) {
    const isOpenCalendar = ref(false);
    const calendarRef = ref<HTMLElement | null>(null);
    const calendarWrapper = ref<HTMLElement | null>(null);
    const dateValue = ref<DateValue>(today(getLocalTimeZone()));
  
    useClickOutside(() => (isOpenCalendar.value = false), [calendarRef, calendarWrapper]);
  
    watch(
      dateStart,
      (val) => {
        if (val) {
          try {
            dateValue.value = parseZonedDateTime(`${val}T00:00[${getLocalTimeZone()}]`);
          } catch {}
        }
      },
      { immediate: true }
    );
  
    watch(dateValue, (newVal) => {
      if (newVal) {
        dateStart.value = formatDateForApi(newVal);
      }
    });
  
    const handleUpdateDate = (val: DateValue) => {
      dateValue.value = val;
      isOpenCalendar.value = false;
    };
  
    const handleCancelCalendar = () => {
      isOpenCalendar.value = false;
    };
  
    const formatDateForApi = (date: DateValue): string => {
      const jsDate = date.toDate(getLocalTimeZone());
      const day = String(jsDate.getDate()).padStart(2, "0");
      const month = String(jsDate.getMonth() + 1).padStart(2, "0");
      const year = jsDate.getFullYear();
      return `${year}-${month}-${day}`;
    };
  
    const formatDateDisplay = (date: DateValue): string => {
      const jsDate = date.toDate(getLocalTimeZone());
      const day = String(jsDate.getDate()).padStart(2, "0");
      const month = String(jsDate.getMonth() + 1).padStart(2, "0");
      const year = jsDate.getFullYear();
      return `${day}.${month}.${year}`;
    };

    watchEffect(() => {
        if (!dateStart.value && dateValue.value) {
          dateStart.value = formatDateForApi(dateValue.value);
        }
      });
  
    return {
      isOpenCalendar,
      calendarRef,
      calendarWrapper,
      dateValue,
      handleUpdateDate,
      handleCancelCalendar,
      formatDateDisplay
    };
  }
