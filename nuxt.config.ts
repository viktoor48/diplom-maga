// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: ["nuxt-swiper", "@nuxt/image", "@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/leaflet"],
  css: ["~/assets/css/main.css", "~/assets/css/normalize.css", "~/assets/fonts/Inter/stylesheet.css", "leaflet/dist/leaflet.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  plugins: ["~/plugins/ckeditor.js", "~/plugins/directives.ts" ,"~/plugins/leaflet.client.ts",],

  shadcn: {
    prefix: "",
    componentDir: "./components/UI",
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      imageBase: `${process.env.NUXT_PUBLIC_API_BASE}/public/`,
    },
  },

  app: {
    head: {
      title: "Диплом",
      htmlAttrs: {
        lang: "ru",
      },
    },
    baseURL: "/",
  },
});