export const navigation = ref([
  {
    title: "Разметка камер",
    link: "/admin/camera-zones",
    roles: ["admin"]
  },
  {
    title: "Разметка полигонов",
    link: "/admin/polygon-zones",
    roles: ["admin"]
  },
  {
    title: "Выбор камер для анализа",
    link: "/analysis/select-cameras",
    roles: ["operator", "analyst"]
  },
  {
    title: "Просмотр тепловых карт",
    link: "/analysis/heatmaps",
    roles: ["operator", "analyst"]
  },
  {
    title: "Выгрузка отчёта",
    link: "/analysis/export",
    roles: ["operator", "analyst"]
  },
  {
    title: "Сбор данных",
    link: "/analysis/data",
    roles: ["operator", "analyst"]
  }
]);