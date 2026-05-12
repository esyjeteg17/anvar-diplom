import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  // Автоимпорт компонентов без префикса по подпапке.
  // То есть `components/sections/HeroSection.vue` импортится как `<HeroSection />`,
  // а не `<SectionsHeroSection />`.
  components: [{ path: "~/components", pathPrefix: false }],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8042/api",
    },
  },
  devServer: {
    port: 4040,
  },
  app: {
    head: {
      title: "SBORIKA — школа инженерного мышления для детей",
      htmlAttrs: { lang: "ru" },
      meta: [
        { name: "description", content: "Робототехника для детей 5–14 лет. Партнёрские центры в Москве. Собирай. Думай. Создавай." },
      ],
      link: [
        // Подключение шрифта Inter c Google Fonts. Кириллица + латиница, нужные начертания.
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
        },
      ],
    },
  },
})
