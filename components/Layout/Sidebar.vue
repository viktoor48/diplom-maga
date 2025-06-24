<script setup lang="ts">
import { useAuth } from "~/composables/requests/useAuth";
import { navigation } from "~/utils/constants/navigation";

const { fetchLogOut } = useAuth();

const role = ref<string | null>(localStorage.getItem("role"));

const handleLoggout = async () => {
  try {
    await fetchLogOut();
  } catch (error) {
    console.error("Ошибка при выходе:", error);
  } finally {
    useCookie("access_token").value = null;
    await navigateTo("/login");
  }
};

const filteredNavigation = computed(() => {
  if (!role.value) return [];
  return navigation.value.filter(item => item.roles.includes(role.value as string));
});
</script>

<template>
  <aside class="flex flex-col w-[21rem] h-screen overflow-y-auto bg-[#FAFAFA] py-10 pr-6 pl-10 border-solid border-r border-gray-100 scroll-hidden sticky top-0">
    <ul class="flex flex-col *:font-medium *:text-[1.125rem] *:leading-[1.3] *:text-[#16350F] gap-2">
      <li v-for="item in filteredNavigation" :key="item.link">
        <nuxt-link class="flex w-full bg-[#FFFFFF] rounded-2xl py-3 px-6 hover:bg-[#D0E5CF] duration-300" :to="item.link" active-class="active-link">
          <p>{{ item.title }}</p>
        </nuxt-link>
      </li>
    </ul>

    <footer class="flex flex-col gap-2 mt-[2.25rem]">
      <button @click="handleLoggout" class="py-0.5 px-2 flex items-center gap-2 w-fit">
        <img src="/assets/images/icons/sidebar-logout-icon.svg" alt="Выйти" class="w-3 hover:opacity-80 duration-300" />
        <span class="font-medium text-sm text-[#667085] hover:opacity-80 duration-300">Выйти из системы</span>
      </button>
    </footer>
  </aside>
</template>

<style scoped>
.active-link {
  background-color: #e6f1e5;
}

.active-link:hover {
  background-color: #d0e5cf;
}
</style>