import { defineNuxtPlugin } from "#app";
import CharCount from "~/directives/char-count";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("char-count", CharCount);
})