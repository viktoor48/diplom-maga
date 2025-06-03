<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const isLoading = ref(false);
const passwordType = ref("password");

const isLoginValid = ref(true);
const isPassValid = ref(true);
const isDataValid = ref(true);

const user = ref({
  email: "",
  password: "",
});

onMounted(() => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

const switchPasswordType = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
};

const validateInput = () => {
  isLoginValid.value = Boolean(user.value.email);
  isPassValid.value = Boolean(user.value.password);
};

// Моковая функция авторизации
const mockAuth = (email: string, password: string) => {
  // Имитация задержки сети
  return new Promise((resolve) => {
    setTimeout(() => {
      // Проверка учетных данных и определение роли
      if (email === "admin" && password === "admin") {
        resolve({
          token: "mock_admin_token",
          role: "admin",
          organization: "Главный офис"
        });
      } else if (email === "operator" && password === "operator") {
        resolve({
          token: "mock_operator_token",
          role: "operator",
          organization: "Операторский центр"
        });
      } else if (email === "analyst" && password === "analyst") {
        resolve({
          token: "mock_analyst_token",
          role: "analyst",
          organization: "Аналитический отдел"
        });
      } else {
        resolve(null);
      }
    }, 800);
  });
};

const submitLogin = async () => {
  isLoading.value = true;
  validateInput();

  if (!isLoginValid.value || !isPassValid.value) {
    isLoading.value = false;
    return;
  }

  try {
    const response: any = await mockAuth(user.value.email, user.value.password);

    if (response?.token) {
      useCookie("access_token").value = response.token;
      window.localStorage.setItem("role", response.role);
      window.localStorage.setItem("organization", response.organization);
      navigateTo("/");
    } else {
      isDataValid.value = false;
    }
  } catch (error) {
    isDataValid.value = false;
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => user.value.email,
  (newValue) => {
    if (newValue) {
      isLoginValid.value = true;
      isDataValid.value = true;
    }
  }
);

watch(
  () => user.value.password,
  (newValue) => {
    if (newValue) {
      isPassValid.value = true;
      isDataValid.value = true;
    }
  }
);
</script>

<template>
  <main class="flex h-full justify-center items-center z-10 min-h-screen">
    <div class="w-[24.5rem] flex flex-col p-[1.5rem] rounded-3xl border border-[#F2F4F7] content bg-white">
      <div class="flex flex-col items-center mt-[3rem] gap-1">
        <h3 class="font-semibold text-[#101828] text-[1.75rem]">Войдите в аккаунт</h3>
        <span class="text-[#667085] text-center text-[1rem] leading-[150%] font-normal">Введите логин и пароль в форме ниже</span>
      </div>

      <form class="flex flex-col gap-[0.75rem] mt-6">
        <div class="flex flex-col gap-1">
          <label for="email" class="text-[#344054] font-medium text-sm">Логин</label>
          <div class="relative">
            <input
              type="email"
              id="email"
              placeholder="Введите логин"
              class="border border-gray-300 py-2.5 px-3.5 rounded-xl w-full"
              :class="{ '!border-[#B42318]': !isLoginValid }"
              required
              v-model="user.email"
            />
            <img src="public/auth/alert.svg" alt="Alert" class="pass" v-if="!isLoginValid" />
          </div>
          <p class="text-[#B42318] text-sm" v-if="!isLoginValid">Необходимо указать логин</p>
          <p class="text-[#B42318] text-sm" v-if="!isDataValid">Неверное имя пользователя или пароль</p>
        </div>
        <div class="flex flex-col gap-1">
          <label for="password" class="text-[#344054] font-medium text-sm">Пароль</label>
          <div class="relative w-full">
            <input
              :type="passwordType"
              id="password"
              placeholder="Введите пароль"
              class="border border-gray-300 py-2.5 px-3.5 rounded-xl w-full"
              :class="{ '!border-[#B42318]': !isPassValid }"
              required
              v-model="user.password"
            />
            <img src="public/auth/link-visible.svg" alt="Show" class="pass" v-if="passwordType === 'password' && isPassValid" @click="switchPasswordType" />
            <img src="public/auth/link-invisible.svg" alt="Show" class="pass" v-else-if="passwordType === 'text' && isPassValid" @click="switchPasswordType" />
            <img src="public/auth/alert.svg" alt="Alert" class="pass" v-if="!isPassValid" />
          </div>
          <p class="text-[#B42318] text-sm" v-if="!isPassValid">Необходимо указать пароль</p>
          <p class="text-[#B42318] text-sm" v-if="!isDataValid">Неверное имя пользователя или пароль</p>
        </div>
        <button class="bg-[#B9E9AE] py-3 px-4 text-[#000000] font-medium rounded-xl mt-[3rem] hover:bg-[#86C577] duration-300" @click.prevent="submitLogin">
          Войти
        </button>
      </form>
    </div>
    <Loader v-if="isLoading" />
  </main>
</template>

<style scoped>
.pass {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  cursor: pointer;
}
</style>