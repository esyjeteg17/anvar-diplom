<script setup lang="ts">
/**
 * Подвал сайта — финальный блок страницы. Состав:
 *   - крупный логотип SBORIKA + слоган;
 *   - контакты (телефон, ВКонтакте) кратко;
 *   - быстрые ссылки на якоря разделов;
 *   - copyright и атрибуция OpenStreetMap (карта в секции «Центры»).
 *
 * Бренд-стиль выдержан: тёмный фон ink + лёгкий орнамент шестерёнок.
 */

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: "О школе",       href: "#about" },
  { label: "Занятия",       href: "#lessons" },
  { label: "Центры",        href: "#centers" },
  { label: "Преподаватели", href: "#teachers" },
  { label: "Квиз",          href: "#quiz" },
  { label: "Контакты",      href: "#contacts" },
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="relative isolate overflow-hidden bg-ink text-white">
    <!-- Бренд-разделитель: тонкая оранжевая полоса сверху + сразу под ней
         градиентное «затухание» от чуть более светлого slate к ink.
         Делает переход с предыдущей светлой секции мягче и заметнее. -->
    <div class="absolute inset-x-0 top-0 h-1.5 bg-brand z-10" />
    <div class="absolute inset-x-0 top-1.5 h-32 bg-linear-to-b from-slate/30 to-transparent pointer-events-none -z-10" />

    <!-- Декор: пара шестерёнок в углах, очень приглушённые -->
    <div class="pointer-events-none absolute inset-0 -z-20 opacity-10">
      <IconGear
        :size="180"
        color="brand"
        :spin="42"
        class="absolute -bottom-12 -left-8"
      />
      <IconGear
        :size="140"
        color="white"
        :spin="34"
        class="absolute top-4 right-[10%]"
      />
    </div>

    <SiteContainer size="wide">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 py-14 sm:py-16">
        <!-- Бренд -->
        <div>
          <BrandLogo size="lg" theme="dark" />
          <p class="mt-5 text-sm text-white/75 leading-relaxed max-w-xs">
            Школа инженерного мышления для детей <span class="whitespace-nowrap">5–14 лет</span>.<br>
            Москва, партнёрские центры.
          </p>
        </div>

        <!-- Навигация -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-brand mb-4">
            Разделы сайта
          </h4>
          <ul class="grid grid-cols-2 gap-y-2.5 gap-x-4">
            <li v-for="l in navLinks" :key="l.href">
              <a
                :href="l.href"
                class="text-sm text-white/90 hover:text-brand transition-colors"
              >
                {{ l.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Контакты -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest text-brand mb-4">
            Связаться с нами
          </h4>
          <ul class="space-y-3 text-sm">
            <li>
              <a
                href="tel:+79191426166"
                class="inline-flex items-center gap-2 text-white hover:text-brand transition-colors font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                +7 (919) 142-61-66
              </a>
            </li>
            <li>
              <a
                href="https://vk.com/sborika"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 text-white hover:text-brand transition-colors font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.16 17.27c-5.5 0-8.64-3.78-8.77-10.06h2.76c.09 4.61 2.13 6.57 3.74 6.97V7.21h2.6v3.97c1.59-.17 3.26-1.97 3.82-3.97h2.6a7.54 7.54 0 0 1-3.49 4.92c1.94 1 3.6 2.74 4.18 4.95h-2.86c-.45-1.41-1.96-3.04-4.25-3.21v3.4Z" />
                </svg>
                Группа ВКонтакте
              </a>
            </li>
            <li class="text-white/70">Ежедневно, 10:00 – 20:00</li>
          </ul>
        </div>
      </div>

      <!-- Нижняя черта — copyright + атрибуция OSM (раз уж убрали с карты) -->
      <div class="border-t border-white/15 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/60">
        <p>© {{ currentYear }} SBORIKA. Все права защищены.</p>
        <p>
          Карта построена на данных
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener"
            class="underline hover:text-brand"
          >
            OpenStreetMap
          </a>.
        </p>
      </div>
    </SiteContainer>
  </footer>
</template>
