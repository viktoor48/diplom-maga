export const navigation = ref([
  {
    title: "Разметка камер",
    link: "/admin/camera/zones",
    roles: ["admin"]
  },
  {
    title: "Разметка полигонов",
    link: "/admin/polygon",
    roles: ["admin"]
  },
  {
    title: "Выбор камер для анализа",
    link: "/analysis/cameras",
    roles: ["operator"]
  },
  {
    title: "Просмотр тепловых карт",
    link: "/cameras",
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