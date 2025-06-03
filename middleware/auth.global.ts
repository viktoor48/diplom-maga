export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("access_token");

  if (token.value && to.name === "login") {
    return navigateTo("/");
  }

  if (!token.value && to.name !== "login") {
    return navigateTo("/login");
  }
});
